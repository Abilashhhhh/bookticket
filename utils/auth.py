"""
utils/auth.py
--------------
Everything related to login security lives here:
  - hashing passwords (so we NEVER store plain-text passwords in MySQL)
  - creating and reading JWT tokens (the "login pass" the frontend keeps
    after a successful login, and sends back on every request that needs
    to prove who the user is)
  - two decorators, @token_required and @admin_required, that you put on
    top of any Flask route that should only work for logged-in users /
    admins.
"""

from functools import wraps
from datetime import datetime, timedelta, timezone

import jwt
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

from config import Config


# ---------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------
def hash_password(plain_password: str) -> str:
    """Turns a plain-text password into a secure hash for storing in MySQL."""
    return generate_password_hash(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """Checks a login attempt's password against the stored hash."""
    return check_password_hash(password_hash, plain_password)


# ---------------------------------------------------------------
# JWT tokens
# ---------------------------------------------------------------
def create_token(user_id: int, email: str, role: str) -> str:
    """Creates a signed token that encodes who the user is and their role."""
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=Config.JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')


def decode_token(token: str):
    """Returns the payload dict if the token is valid, otherwise None."""
    try:
        return jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def _get_token_from_header():
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        return auth_header.split(' ', 1)[1]
    return None


# ---------------------------------------------------------------
# Route decorators
# ---------------------------------------------------------------
def token_required(f):
    """
    Put this above any route that requires the user to be logged in
    (any role). Reads the token from the 'Authorization: Bearer <token>'
    header and attaches the decoded user info to request.user.
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = _get_token_from_header()
        if not token:
            return jsonify({'error': 'Missing Authorization token'}), 401
        payload = decode_token(token)
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        request.user = payload
        return f(*args, **kwargs)
    return wrapper


def admin_required(f):
    """
    Put this above any route that only Admins should access
    (e.g. add/edit/delete event, view all users). Must be used together
    with @token_required (put @token_required UNDERNEATH this one).
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = _get_token_from_header()
        if not token:
            return jsonify({'error': 'Missing Authorization token'}), 401
        payload = decode_token(token)
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        if payload.get('role') != 'Admin':
            return jsonify({'error': 'Admin access required'}), 403
        request.user = payload
        return f(*args, **kwargs)
    return wrapper
