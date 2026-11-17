from config import app, db
from flask import jsonify, request
from models import Asset, AuthorizationRequest, ScanRun


# assets:
@app.route('/user/assets/<int:user_id>', methods=['GET'])
def user_get_assets(user_id):   
    assets = Asset.query.filter_by(user_id=user_id).all()
    return jsonify([asset.to_json() for asset in assets]), 200  

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

@app.route('/user/authorization_requests/<int:req_id>', methods=['DELETE'])
def user_delete_authorization_request(req_id):
    auth_request = AuthorizationRequest.query.get_or_404(req_id)
    db.session.delete(auth_request)
    db.session.commit()
    return jsonify({'message': 'Authorization request deleted successfully'}), 200


# scan runs check:
@app.route('/user/scan_runs/<int:user_id>', methods=['GET'])
def user_get_scan_runs(user_id):
    scan_runs = ScanRun.query.join(Asset).filter(Asset.user_id == user_id).all()
    return jsonify([scan_run.to_json() for scan_run in scan_runs]), 200
