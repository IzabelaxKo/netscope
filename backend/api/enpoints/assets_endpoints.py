from config import app, db
from flask import jsonify, request
from models import Asset


@app.route('/assets', methods=['POST'])
def create_asset():
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

@app.route('/assets', methods=['GET'])
def get_assets():
    assets = Asset.query.all()
    return jsonify([asset.to_json() for asset in assets]), 200

@app.route('/assets/<int:user_id>', methods=['GET'])
def get_assets_by_user(user_id):
    assets = Asset.query.filter_by(user_id=user_id).all()
    return jsonify([asset.to_json() for asset in assets]), 200

@app.route('/assets/<int:asset_id>', methods=['DELETE'])
def delete_asset(asset_id):
    asset = Asset.query.get_or_404(asset_id)
    db.session.delete(asset)
    db.session.commit()
    return jsonify({'message': 'Asset deleted successfully'}), 200

@app.route('/asset_status/<int:asset_id>', methods=['POST'])
def update_asset_status(asset_id):
    asset = Asset.query.get_or_404(asset_id)
    data = request.get_json()
    status = data.get('status')

    if not status:
        return jsonify({'error': 'Missing required field: status'}), 400

    asset.status = status
    db.session.commit()

    return jsonify(asset.to_json()), 200

@app.route('/asset_edit/<int:asset_id>', methods=['POST'])
def edit_asset(asset_id):
    asset = Asset.query.get_or_404(asset_id)
    data = request.get_json()

    if 'name' in data:
        asset.name = data['name']
    if 'target' in data:
        asset.target = data['target']
    if 'asset_type' in data:
        asset.asset_type = data['asset_type']

    db.session.commit()

    return jsonify(asset.to_json()), 200


