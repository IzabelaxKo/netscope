from config import db
from sqlalchemy import Column, Integer, String


class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String(120), unique=True, nullable=False)
    passw_hash = Column(String(128), nullable=False)
    role = Column(String(20), nullable=False, default='user')
    created_at = Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f'<User {self.username}>'

    def to_json(self):
        return {
            'id': self.id,
            'username': self.username
        } 

class Asset(db.Model):
    __tablename__ = 'assets'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, db.ForeignKey('users.id'), nullable=False)
    name = Column(String(120), unique=True, nullable=False)
    target = Column(String(120), nullable=False)
    asset_type = Column(String(50), nullable=False)
    created_at = Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f'<Asset {self.name}>'

    def to_json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'target': self.target,
            'asset_type': self.asset_type
        }

class AuthorizationRequest(db.Model):
    __tablename__ = 'authorization_requests'

    id = Column(Integer, primary_key=True)
    asset_id = Column(Integer, db.ForeignKey('assets.id'), nullable=False)
    document_path = Column(String(255), nullable=False)
    status = Column(String(20), nullable=False, default='pending')
    expires_at = Column(db.DateTime, nullable=False)
    created_at = Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f'<AuthorizationRequest {self.id}>'

    def to_json(self):
        return {
            'id': self.id,
            'asset_id': self.asset_id,
            'document_path': self.document_path,
            'status': self.status,
            'expires_at': self.expires_at
        }


class ScanRun(db.Model):
    __tablename__ = 'scan_runs'

    id = Column(Integer, primary_key=True)
    asset_id = Column(Integer, db.ForeignKey('assets.id'), nullable=False)
    user_id = Column(Integer, db.ForeignKey('users.id'), nullable=False)
    status = Column(String(20), nullable=False, default='pending')
    results_json = Column(db.JSON)
    created_at = Column(db.DateTime, default=db.func.current_timestamp())
    completed_at = Column(db.DateTime)

    def __repr__(self):
        return f'<ScanRun {self.id}>'

    def to_json(self):
        return {
            'id': self.id,
            'asset_id': self.asset_id,
            'user_id': self.user_id,
            'status': self.status,
            'results_json': self.results_json,
            'created_at': self.created_at,
            'completed_at': self.completed_at
        }
