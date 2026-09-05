"""
models/user.py
--------------
All database queries related to the `users` table.
"""

from models.db import get_connection


def create_user(name, email, password_hash, phone=None, role='Attendee'):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (name, email, password_hash, phone, role) VALUES (%s, %s, %s, %s, %s)",
        (name, email, password_hash, phone, role),
    )
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return new_id


def get_user_by_email(email):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return dict(row) if row else None


def get_all_users():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at AS joined,
               COUNT(b.id) AS bookings
        FROM users u
        LEFT JOIN bookings b ON b.email = u.email
        GROUP BY u.id
        ORDER BY u.created_at DESC
    """)
    rows = cursor.fetchall()
    users = []
    for r in rows:
        u = dict(r)
        u['joined'] = str(u['joined'])
        users.append(u)
    cursor.close()
    conn.close()
    return users
