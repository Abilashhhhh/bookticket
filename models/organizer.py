"""
models/organizer.py
--------------------
All database queries related to the `organizers` table.
"""

from models.db import get_connection


def _row_to_dict(row):
    if not row:
        return None
    row = dict(row)
    return {

        'id': row['id'],
        'name': row['name'],
        'email': row['email'],
        'phone': row['phone'],
        'status': row['status'],
        'eventsManaged': row.get('events_managed', 0),
    }


def get_all_organizers():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT o.*, COUNT(e.id) AS events_managed
        FROM organizers o
        LEFT JOIN events e ON e.organizer_id = o.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
    """)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return [_row_to_dict(r) for r in rows]


def create_organizer(name, email, phone, status='Active'):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO organizers (name, email, phone, status) VALUES (?, ?, ?, ?)",
        (name, email, phone, status),
    )
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return new_id


def update_organizer(organizer_id, name, email, phone, status):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE organizers SET name=?, email=?, phone=?, status=? WHERE id=?",
        (name, email, phone, status, organizer_id),
    )
    conn.commit()
    affected = cursor.rowcount
    cursor.close()
    conn.close()
    return affected > 0


def delete_organizer(organizer_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM organizers WHERE id = ?", (organizer_id,))
    conn.commit()
    affected = cursor.rowcount
    cursor.close()
    conn.close()
    return affected > 0


def get_or_create_organizer_id(name):
    """
    Used when adding/editing an EVENT: the admin just types an organizer's
    NAME in a text box (matching the frontend form). This looks up whether
    an organizer with that name already exists — if so, reuses it; if not,
    creates a new organizer record automatically so the event can link to
    it via organizer_id (a foreign key).
    """
    if not name or not name.strip():
        return None
    name = name.strip()

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM organizers WHERE LOWER(name) = LOWER(?)", (name,))
    row = cursor.fetchone()
    if row:
        cursor.close()
        conn.close()
        return row['id']

    # Not found — create it with a generated placeholder email
    placeholder_email = f"{name.lower().replace(' ', '')}@auto.booktix"
    insert_cursor = conn.cursor()
    try:
        insert_cursor.execute(
            "INSERT INTO organizers (name, email, status) VALUES (?, ?, 'Active')",
            (name, placeholder_email),
        )
        conn.commit()
        new_id = insert_cursor.lastrowid
    except Exception:
        # Re-use existing row if email already exists
        conn.rollback()
        cursor.execute("SELECT id FROM organizers WHERE email = ?", (placeholder_email,))
        existing = cursor.fetchone()
        new_id = existing['id'] if existing else None
    insert_cursor.close()
    cursor.close()
    conn.close()
    return new_id

