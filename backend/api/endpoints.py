import datetime
from functools import wraps
from config import app, db
from flask import jsonify, request
from flask_bcrypt import Bcrypt
import jwt
from models import User


bcrypt = Bcrypt(app)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1].strip()
        elif 'session_token' in request.cookies:
            token = request.cookies.get('session_token')

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = db.session.get(User, payload['user_id'])
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(current_user, *args, **kwargs)

    return decorated


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

    token = jwt.encode(
        {
            'user_id': user.id,
            'email': user.email,
            'role': user.role,
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24),
        },
        app.config['SECRET_KEY'],
        algorithm='HS256',
    )

    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_json()
    }), 200

@app.route('/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({'user': current_user.to_json()}), 200


