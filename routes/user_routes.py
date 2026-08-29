"""
routes/user_routes.py
------------------------
GET /api/users   -> admin: list all registered users
"""

from flask import Blueprint, jsonify

from models.user import get_all_users
from utils.auth import admin_required

user_bp = Blueprint('users', __name__, url_prefix='/api/users')


@user_bp.route('', methods=['GET'])
@admin_required
def list_users():
    return jsonify(get_all_users()), 200
