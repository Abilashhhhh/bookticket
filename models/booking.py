"""
models/booking.py
------------------
All database queries related to the `bookings` table.
"""

from models.db import get_connection


def _row_to_dict(row):
    if not row:
        return None
    row = dict(row)
    return {
        'id': f"BKG-{row['id']:05d}",
        'rawId': row['id'],
        'eventId': row['event_id'],
        'eventName': row.get('event_name'),
        'userName': row['user_name'],
        'email': row['email'],
        'phone': row['phone'],
        'ticketType': row['ticket_type'],
        'quantity': row['quantity'],
        'amount': float(row['amount']),
        'status': row['status'],
        'paymentStatus': row['payment_status'],
        'date': str(row['created_at']),
    }


def create_booking(data):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO bookings
            (event_id, user_name, email, phone, ticket_type, quantity, amount, status, payment_status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, 'Pending', 'Pending')
    """, (
        data['eventId'], data['userName'], data['email'], data['phone'],
        data['ticketType'], data['quantity'], data['amount'],
    ))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return get_booking_by_raw_id(new_id)


def get_booking_by_raw_id(booking_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT b.*, e.name AS event_name
        FROM bookings b
        JOIN events e ON e.id = b.event_id
        WHERE b.id = %s
    """, (booking_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return _row_to_dict(row)


def get_bookings_by_email(email):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT b.*, e.name AS event_name
        FROM bookings b
        JOIN events e ON e.id = b.event_id
        WHERE b.email = %s
        ORDER BY b.created_at DESC
    """, (email,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return [_row_to_dict(r) for r in rows]


def get_all_bookings():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT b.*, e.name AS event_name
        FROM bookings b
        JOIN events e ON e.id = b.event_id
        ORDER BY b.created_at DESC
    """)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return [_row_to_dict(r) for r in rows]


def update_payment_status(booking_id, payment_status):
    booking_status = 'Confirmed' if payment_status == 'Paid' else 'Cancelled'
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE bookings SET payment_status = %s, status = %s WHERE id = %s",
        (payment_status, booking_status, booking_id),
    )
    conn.commit()
    affected = cursor.rowcount
    cursor.close()
    conn.close()
    return affected > 0
