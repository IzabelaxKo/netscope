import datetime

from config import app, db
from flask import jsonify, request
from models import Asset, AuthorizationRequest, ScanRun


# assets:
@app.route('/user/assets/<int:user_id>', methods=['GET'])
def user_get_assets(user_id):   
    assets = Asset.query.filter_by(user_id=user_id).all()
    return jsonify([asset.to_json() for asset in assets]), 200  

@app.route('/user/assets', methods=['POST'])
def user_create_asset():
    data = request.get_json()
    user_id = data.get('user_id')
    name = data.get('name')
    target = data.get('target')
    asset_type = data.get('asset_type')

    if not user_id or not name or not target or not asset_type:
        return jsonify({'error': 'Missing required fields'}), 400

    asset = Asset(user_id=user_id, name=name, target=target, asset_type=asset_type)
    db.session.add(asset)
    db.session.commit()

    return jsonify(asset.to_json()), 201

@app.route('/user/assets/<int:asset_id>', methods=['DELETE'])
def user_delete_asset(asset_id):
    asset = Asset.query.get_or_404(asset_id)
    db.session.delete(asset)
    db.session.commit()
    return jsonify({'message': 'Asset deleted successfully'}), 200

@app.route('/user/asset_edit/<int:asset_id>', methods=['POST'])
def user_edit_asset(asset_id):
    asset = Asset.query.get_or_404(asset_id)
    data = request.get_json()
    for key, value in data.items():
        setattr(asset, key, value)
    db.session.commit()
    return jsonify({'message': 'Asset updated successfully'}), 200


# authorization requests:
@app.route('/user/authorization_requests/<int:user_id>', methods=['GET'])
def user_get_authorization_requests(user_id):
    requests = AuthorizationRequest.query.join(Asset).filter(Asset.user_id == user_id).all()
    return jsonify([req.to_json() for req in requests]), 200

@app.route('/user/authorization_requests', methods=['POST'])
def user_create_authorization_request():
    data = request.get_json()
    asset_id = data.get('asset_id')
    document_path = data.get('document_path')
    expires_in_days = data.get('expires_in_days', 30)

    if not asset_id or not document_path:
        return jsonify({'error': 'Missing required fields: asset_id and document_path'}), 400

    asset = Asset.query.get_or_404(asset_id)

    expires_at = datetime.datetime.now(datetime.UTC) + datetime.timedelta(days=int(expires_in_days))
    existing = AuthorizationRequest.query.filter_by(asset_id=asset_id).first()
    if existing:
        existing.document_path = document_path
        existing.status = 'pending'
        existing.expires_at = expires_at
        db.session.commit()
        return jsonify(existing.to_json()), 200

    auth_request = AuthorizationRequest(
        asset_id=asset_id,
        document_path=document_path,
        status='pending',
        expires_at=expires_at
    )
    db.session.add(auth_request)
    db.session.commit()
    return jsonify(auth_request.to_json()), 201

@app.route('/user/authorization_requests/<int:req_id>', methods=['DELETE'])
def user_delete_authorization_request(req_id):
    auth_request = AuthorizationRequest.query.get_or_404(req_id)
    db.session.delete(auth_request)
    db.session.commit()
    return jsonify({'message': 'Authorization request deleted successfully'}), 200


# scan runs:
@app.route('/user/scan_runs/<int:user_id>', methods=['GET'])
def user_get_scan_runs(user_id):
    scan_runs = ScanRun.query.join(Asset).filter(Asset.user_id == user_id).all()
    return jsonify([scan_run.to_json() for scan_run in scan_runs]), 200

@app.route('/user/scan_runs', methods=['POST'])
def user_create_scan_run():
    data = request.get_json()
    asset_id = data.get('asset_id')
    user_id = data.get('user_id')

    if not asset_id or not user_id:
        return jsonify({'error': 'Missing required fields: asset_id and user_id'}), 400

    asset = Asset.query.get_or_404(asset_id)

    # If asset is a private page or restricted asset, require physical ownership authorization
    if asset.asset_type in ['private_page', 'private', 'internal']:
        auth = AuthorizationRequest.query.filter_by(asset_id=asset_id, status='accepted').first()
        if not auth:
            return jsonify({'error': 'Authorization required. Physical ownership proof has not been accepted for this private page.'}), 403

    scan_run = ScanRun(
        asset_id=asset_id,
        user_id=user_id,
        status='completed',
        results_json={
            'target': asset.target,
            'asset_name': asset.name,
            'asset_type': asset.asset_type,
            'status': 'Online',
            'latency_ms': 18,
            'open_ports': [80, 443],
            'vulnerabilities_detected': 0,
            'scanned_at': datetime.datetime.now(datetime.UTC).isoformat()
        },
        created_at=datetime.datetime.now(datetime.UTC),
        completed_at=datetime.datetime.now(datetime.UTC)
    )
    db.session.add(scan_run)
    db.session.commit()
    return jsonify(scan_run.to_json()), 201

