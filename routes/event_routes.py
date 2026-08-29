"""
routes/event_routes.py
------------------------
GET    /api/events            -> public list (supports ?category=&city=&q=)
GET    /api/events/<id>       -> public single event
POST   /api/events            -> admin: create event
PUT    /api/events/<id>       -> admin: edit event
DELETE /api/events/<id>       -> admin: delete event
"""

from flask import Blueprint, request, jsonify

from models.event import (
    get_all_events, get_event_by_id, create_event, update_event, delete_event,
)
from utils.auth import admin_required

event_bp = Blueprint('events', __name__, url_prefix='/api/events')


@event_bp.route('', methods=['GET'])
def list_events():
    category = request.args.get('category')
    city = request.args.get('city')
    search = request.args.get('q')
    events = get_all_events(category=category, city=city, search=search)
    return jsonify(events), 200


@event_bp.route('/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = get_event_by_id(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    return jsonify(event), 200


@event_bp.route('', methods=['POST'])
@admin_required
def add_event():
    data = request.get_json(silent=True) or {}
    required = ['name', 'category', 'date', 'time', 'venue', 'city', 'price', 'totalTickets']
    missing = [f for f in required if not data.get(f) and data.get(f) != 0]
    if missing:
        return jsonify({'error': f"Missing required fields: {', '.join(missing)}"}), 400

    new_id = create_event(data)
    return jsonify(get_event_by_id(new_id)), 201


@event_bp.route('/<int:event_id>', methods=['PUT'])
@admin_required
def edit_event(event_id):
    if not get_event_by_id(event_id):
        return jsonify({'error': 'Event not found'}), 404

    data = request.get_json(silent=True) or {}
    updated = update_event(event_id, data)
    if not updated:
        return jsonify({'error': 'Nothing was updated'}), 400
    return jsonify(get_event_by_id(event_id)), 200


@event_bp.route('/<int:event_id>', methods=['DELETE'])
@admin_required
def remove_event(event_id):
    if not get_event_by_id(event_id):
        return jsonify({'error': 'Event not found'}), 404
    delete_event(event_id)
    return jsonify({'message': 'Event deleted'}), 200
