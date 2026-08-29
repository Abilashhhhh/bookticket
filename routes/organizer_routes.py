"""
routes/organizer_routes.py
-----------------------------
GET    /api/organizers        -> admin: list organizers
POST   /api/organizers        -> admin: add organizer
PUT    /api/organizers/<id>   -> admin: edit organizer
DELETE /api/organizers/<id>   -> admin: delete organizer
"""

from flask import Blueprint, request, jsonify

from models.organizer import (
    get_all_organizers, create_organizer, update_organizer, delete_organizer,
)
from utils.auth import admin_required

organizer_bp = Blueprint('organizers', __name__, url_prefix='/api/organizers')


@organizer_bp.route('', methods=['GET'])
@admin_required
def list_organizers():
    return jsonify(get_all_organizers()), 200


@organizer_bp.route('', methods=['POST'])
@admin_required
def add_organizer():
    data = request.get_json(silent=True) or {}
    name, email = data.get('name'), data.get('email')
    if not name or not email:
        return jsonify({'error': 'name and email are required'}), 400
    new_id = create_organizer(name, email, data.get('phone'), data.get('status', 'Active'))
    return jsonify({'id': new_id, 'message': 'Organizer added'}), 201


@organizer_bp.route('/<int:organizer_id>', methods=['PUT'])
@admin_required
def edit_organizer(organizer_id):
    data = request.get_json(silent=True) or {}
    updated = update_organizer(
        organizer_id, data.get('name'), data.get('email'),
        data.get('phone'), data.get('status', 'Active'),
    )
    if not updated:
        return jsonify({'error': 'Organizer not found'}), 404
    return jsonify({'message': 'Organizer updated'}), 200


@organizer_bp.route('/<int:organizer_id>', methods=['DELETE'])
@admin_required
def remove_organizer(organizer_id):
    if not delete_organizer(organizer_id):
        return jsonify({'error': 'Organizer not found'}), 404
    return jsonify({'message': 'Organizer deleted'}), 200
