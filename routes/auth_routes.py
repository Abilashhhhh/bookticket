"""
routes/auth_routes.py
----------------------
POST /api/auth/register  -> create a new Attendee account
POST /api/auth/login     -> check email/password, return a JWT token
"""

from flask import Blueprint, request, jsonify

from models.user import create_user, get_user_by_email
from utils.auth import hash_password, verify_password, create_token

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    phone = data.get('phone')

    if not name or not email or not password:
        return jsonify({'error': 'name, email and password are required'}), 400

    if get_user_by_email(email):
        return jsonify({'error': 'An account with this email already exists'}), 409

    password_hash = hash_password(password)
    user_id = create_user(name, email, password_hash, phone, role='Attendee')

    token = create_token(user_id, email, 'Attendee')
    return jsonify({
        'token': token,
        'user': {'id': user_id, 'name': name, 'email': email, 'role': 'Attendee'},
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'error': 'email and password are required'}), 400

    user = get_user_by_email(email)
    if not user or not verify_password(password, user['password_hash']):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = create_token(user['id'], user['email'], user['role'])
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role'],
        },
    }), 200
