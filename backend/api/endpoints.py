from config import app, db
from flask import jsonify, request
from flask_bcrypt import Bcrypt
from models import User


bcrypt = Bcrypt(app)

@app.route('/')
def index():
    return jsonify({'message': 'Welcome to the API'}), 200

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    hashed_pwd = bcrypt.generate_password_hash(password).decode('utf-8')

    user = User(email=email, passw_hash=hashed_pwd, role='user')
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

@app.route('/login_user', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.passw_hash, password):
        return jsonify({'error': 'Invalid email or password'}), 401

#   PIRATE TOKEN
    return jsonify(user.to_json()), 200

