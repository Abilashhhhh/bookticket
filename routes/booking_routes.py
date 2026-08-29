"""
routes/booking_routes.py
--------------------------
POST /api/bookings                 -> create a booking (Booking page)
GET  /api/bookings?email=...       -> a user's own bookings (My Tickets page)
GET  /api/bookings                 -> admin: ALL bookings
PUT  /api/bookings/<id>/pay        -> mark a booking paid/failed (Payment page + admin)
"""

from flask import Blueprint, request, jsonify

from models.event import get_event_by_id, increment_tickets_sold
from models.booking import (
    create_booking, get_bookings_by_email, get_all_bookings,
    update_payment_status, get_booking_by_raw_id,
)
from utils.auth import decode_token

booking_bp = Blueprint('bookings', __name__, url_prefix='/api/bookings')


@booking_bp.route('', methods=['POST'])
def add_booking():
    data = request.get_json(silent=True) or {}
    required = ['eventId', 'userName', 'email', 'phone', 'ticketType', 'quantity', 'amount']
    missing = [f for f in required if data.get(f) in (None, '')]
    if missing:
        return jsonify({'error': f"Missing required fields: {', '.join(missing)}"}), 400

    event = get_event_by_id(data['eventId'])
    if not event:
        return jsonify({'error': 'Event not found'}), 404

    remaining = event['totalTickets'] - event['ticketsSold']
    if int(data['quantity']) > remaining:
        return jsonify({'error': f"Only {remaining} tickets left for this event"}), 409

    booking = create_booking(data)
    return jsonify(booking), 201


@booking_bp.route('', methods=['GET'])
def list_bookings():
    email = request.args.get('email')
    if email:
        # "My Tickets" page: anyone can look up bookings by their own email
        return jsonify(get_bookings_by_email(email)), 200

    # No email given -> this is the admin "view ALL bookings" request,
    # so it must include a valid admin token
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(' ', 1)[1] if auth_header.startswith('Bearer ') else None
    payload = decode_token(token) if token else None
    if not payload or payload.get('role') != 'Admin':
        return jsonify({'error': 'Admin access required, or pass ?email= to look up your own bookings'}), 403

    return jsonify(get_all_bookings()), 200


@booking_bp.route('/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    """Used by the Payment page to look up one booking's details."""
    booking = get_booking_by_raw_id(booking_id)
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    return jsonify(booking), 200


@booking_bp.route('/<int:booking_id>/pay', methods=['PUT'])
def pay_booking(booking_id):
    data = request.get_json(silent=True) or {}
    outcome = data.get('status', 'Paid')  # 'Paid' or 'Failed'
    if outcome not in ('Paid', 'Failed'):
        return jsonify({'error': "status must be 'Paid' or 'Failed'"}), 400

    booking = get_booking_by_raw_id(booking_id)
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    if booking['paymentStatus'] != 'Pending':
        return jsonify({'error': 'This booking has already been processed'}), 409

    update_payment_status(booking_id, outcome)
    if outcome == 'Paid':
        increment_tickets_sold(booking['eventId'], booking['quantity'])

    return jsonify(get_booking_by_raw_id(booking_id)), 200
