"""
models/event.py
----------------
All database queries related to the `events` table.
"""

from models.db import get_connection
from models.organizer import get_or_create_organizer_id


def _row_to_dict(row):
    """Converts DB column names (snake_case) to the JSON shape the
    frontend expects (camelCase-ish, matching mockData.js)."""
    if not row:
        return None
    row = dict(row)
    return {

        'id': row['id'],
        'name': row['name'],
        'category': row['category'],
        'date': str(row['event_date']),
        'time': str(row['event_time']),
        'venue': row['venue'],
        'city': row['city'],
        'organizer': row.get('organizer_name') or '',
        'price': float(row['price']),
        'pricePremium': float(row['price_premium']) if row.get('price_premium') is not None else round(float(row['price']) * 1.6, 2),
        'priceVip': float(row['price_vip']) if row.get('price_vip') is not None else round(float(row['price']) * 2.2, 2),
        'totalTickets': row['total_tickets'],
        'ticketsSold': row['tickets_sold'],
        'status': row['status'],
        'image': row['image_url'],
        'description': row['description'],
    }


def get_all_events(category=None, city=None, search=None):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT e.*, o.name AS organizer_name
        FROM events e
        LEFT JOIN organizers o ON o.id = e.organizer_id
        WHERE 1=1
    """
    params = []
    if category and category != 'All':
        query += " AND e.category = ?"
        params.append(category)
    if city and city != 'All':
        query += " AND e.city = ?"
        params.append(city)
    if search:
        query += " AND (e.name LIKE ? OR e.city LIKE ? OR e.category LIKE ?)"
        like = f"%{search}%"
        params.extend([like, like, like])
    query += " ORDER BY e.event_date ASC"

    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return [_row_to_dict(r) for r in rows]


def get_event_by_id(event_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT e.*, o.name AS organizer_name
        FROM events e
        LEFT JOIN organizers o ON o.id = e.organizer_id
        WHERE e.id = ?
    """, (event_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return _row_to_dict(row)


def create_event(data):
    organizer_id = get_or_create_organizer_id(data.get('organizer'))
    price = data['price']
    price_premium = data.get('pricePremium') or round(float(price) * 1.6, 2)
    price_vip = data.get('priceVip') or round(float(price) * 2.2, 2)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO events
            (name, category, event_date, event_time, venue, city, organizer_id,
             price, price_premium, price_vip, total_tickets, tickets_sold, status, image_url, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'Active', ?, ?)
    """, (
        data['name'], data['category'], data['date'], data['time'],
        data['venue'], data['city'], organizer_id,
        price, price_premium, price_vip, data['totalTickets'], data.get('image'), data.get('description'),
    ))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return new_id


def update_event(event_id, data):
    organizer_id = get_or_create_organizer_id(data.get('organizer'))
    price = data['price']
    price_premium = data.get('pricePremium') or round(float(price) * 1.6, 2)
    price_vip = data.get('priceVip') or round(float(price) * 2.2, 2)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE events SET
            name = ?, category = ?, event_date = ?, event_time = ?,
            venue = ?, city = ?, organizer_id = ?,
            price = ?, price_premium = ?, price_vip = ?, total_tickets = ?,
            image_url = ?, description = ?
        WHERE id = ?
    """, (
        data['name'], data['category'], data['date'], data['time'],
        data['venue'], data['city'], organizer_id,
        price, price_premium, price_vip, data['totalTickets'],
        data.get('image'), data.get('description'), event_id,
    ))
    conn.commit()
    affected = cursor.rowcount
    cursor.close()
    conn.close()
    return affected > 0


def delete_event(event_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM events WHERE id = ?", (event_id,))
    conn.commit()
    affected = cursor.rowcount
    cursor.close()
    conn.close()
    return affected > 0


def increment_tickets_sold(event_id, quantity):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE events SET tickets_sold = tickets_sold + ? WHERE id = ?",
        (quantity, event_id),
    )
    conn.commit()
    cursor.close()
    conn.close()

