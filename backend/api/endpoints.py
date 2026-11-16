from config import app, db
from flask import jsonify, request
from models import Asset, AuthorizationRequest, ScanRun, User

@app.route('/')
def index():
    return jsonify({'message': 'Welcome to the API'}), 200

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({'error': 'Username is required'}), 400

    user = User(username=username)
    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_json()), 201

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_json() for user in users]), 200

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_json()), 200

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'}), 200


