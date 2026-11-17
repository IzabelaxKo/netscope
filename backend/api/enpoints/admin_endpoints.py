from config import app, db
from flask import jsonify, request
from models import Asset, AuthorizationRequest, ScanRun, User

# ADMIN ONLY ENDPOINTS - CHECKS WHETHER ADMIN IS TRYING TO GET ACCESS
# admin can :
# edit, browse, delete users, 
# edit, browse, deleteassets, 
# accept or not authorization requests(if not accepted, the request is deleted, else its held in the db with status accepted), 
# scan runs - browse

# users:
@app.route('/admin/users', methods=['GET'])
def admin_get_users():
    users = User.query.all()
    return jsonify([user.to_json() for user in users]), 200

@app.route('/admin/users/<int:user_id>', methods=['DELETE'])
def admin_delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'}), 200

@app.route('/admin/user_edit/<int:user_id>', methods=['POST'])
def admin_edit_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    for key, value in data.items():
        setattr(user, key, value)
    db.session.commit()
    return jsonify({'message': 'User updated'}), 200


#assets:
@app.route('/admin/assets', methods=['GET'])
def admin_get_assets():
    assets = Asset.query.all()
    return jsonify([asset.to_json() for asset in assets]), 200

@app.route('/admin/assets/<int:asset_id>', methods=['DELETE'])
def admin_delete_asset(asset_id):
    asset = Asset.query.get_or_404(asset_id)
    db.session.delete(asset)
    db.session.commit()
    return jsonify({'message': 'Asset deleted'}), 200

@app.route('/admin/asset_edit/<int:asset_id>', methods=['POST'])
def admin_edit_asset(asset_id):
    asset = Asset.query.get_or_404(asset_id)
    data = request.get_json()
    for key, value in data.items():
        setattr(asset, key, value)
    db.session.commit()
    return jsonify({'message': 'Asset updated'}), 200

# authorization requests:
@app.route('/admin/authorization_requests', methods=['GET'])
def admin_get_authorization_requests():
    requests = AuthorizationRequest.query.all()
    return jsonify([request.to_json() for request in requests]), 200

@app.route('/admin/authorization_requests/<int:request_id>', methods=['POST'])
def admin_update_authorization_request(request_id):
    auth_request = AuthorizationRequest.query.get_or_404(request_id)
    data = request.get_json()
    status = data.get('status')

    if not status:
        return jsonify({'error': 'Missing required field: status'}), 400

    auth_request.status = status
    if status == 'rejected':
        db.session.delete(auth_request)
    db.session.commit()

    return jsonify(auth_request.to_json()), 200


# scan runs:
@app.route('/admin/scan_runs', methods=['GET'])
def admin_get_scan_runs():
    scan_runs = ScanRun.query.all()
    return jsonify([scan_run.to_json() for scan_run in scan_runs]), 200