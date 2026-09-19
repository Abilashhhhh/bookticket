"""
routes/auth_routes.py
----------------------
POST /api/auth/send-otp        -> emails a 6-digit code for 'register' or 'reset-password'
POST /api/auth/verify-otp      -> checks a code is correct and unexpired
POST /api/auth/register        -> create a new Attendee account (requires a verified OTP first)
POST /api/auth/login           -> check email/password, return a JWT token
POST /api/auth/reset-password  -> set a new password (requires a verified OTP first)
"""

from flask import Blueprint, request, jsonify

from models.user import create_user, get_user_by_email, update_password
from models.otp import generate_and_store_otp, verify_otp, has_verified_otp
from utils.auth import hash_password, verify_password, create_token
from utils.email import send_otp_email

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    purpose = data.get('purpose')

    if not email or purpose not in ('register', 'reset-password'):
        return jsonify({'error': 'A valid email and purpose are required'}), 400

    existing_user = get_user_by_email(email)
    if purpose == 'register' and existing_user:
        return jsonify({'error': 'An account with this email already exists'}), 409
    if purpose == 'reset-password' and not existing_user:
        return jsonify({'error': 'No account found with this email'}), 404

    otp_code = generate_and_store_otp(email, purpose)
    try:
        send_otp_email(email, otp_code, purpose)
    except Exception:
        return jsonify({'error': 'Could not send the verification email. Please try again.'}), 500

    return jsonify({'message': f'A verification code was sent to {email}'}), 200


@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp_route():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    otp_code = (data.get('otp') or '').strip()
    purpose = data.get('purpose')

    if not email or not otp_code or purpose not in ('register', 'reset-password'):
        return jsonify({'error': 'Email, code and purpose are required'}), 400

    if not verify_otp(email, otp_code, purpose):
        return jsonify({'error': 'Invalid or expired code'}), 400

    return jsonify({'message': 'Verified'}), 200


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

    if not has_verified_otp(email, 'register'):
        return jsonify({'error': 'Please verify your email with the code sent to it first'}), 403

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


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    new_password = data.get('password') or ''

    if not email or not new_password:
        return jsonify({'error': 'email and new password are required'}), 400

    if not has_verified_otp(email, 'reset-password'):
        return jsonify({'error': 'Please verify your email with the code sent to it first'}), 403

    if not get_user_by_email(email):
        return jsonify({'error': 'No account found with this email'}), 404

    password_hash = hash_password(new_password)
    update_password(email, password_hash)
    return jsonify({'message': 'Password updated successfully'}), 200