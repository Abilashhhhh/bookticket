"""
models/otp.py
-------------
Database queries related to OTP verification codes.
"""

import random
from datetime import datetime, timedelta, timezone
from models.db import get_connection


def generate_and_store_otp(email, purpose):
    """Creates a random 6-digit code, saves it with a 10-minute expiry."""
    otp_code = str(random.randint(100000, 999999))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO otp_verifications (email, otp_code, purpose, expires_at) VALUES (%s, %s, %s, %s)",
        (email, otp_code, purpose, expires_at),
    )
    conn.commit()
    cursor.close()
    conn.close()
    return otp_code


def verify_otp(email, otp_code, purpose):
    """Checks if this code is valid and unexpired. If so, marks it verified."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id FROM otp_verifications
        WHERE email = %s AND otp_code = %s AND purpose = %s
          AND expires_at > UTC_TIMESTAMP() AND verified = 0
        ORDER BY id DESC LIMIT 1
    """, (email, otp_code, purpose))
    row = cursor.fetchone()
    if not row:
        cursor.close()
        conn.close()
        return False

    cursor.execute("UPDATE otp_verifications SET verified = 1 WHERE id = %s", (row['id'],))
    conn.commit()
    cursor.close()
    conn.close()
    return True


def has_verified_otp(email, purpose):
    """Checks if there's a recently-verified OTP for this email+purpose (used right before register/reset)."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id FROM otp_verifications
        WHERE email = %s AND purpose = %s AND verified = 1
          AND expires_at > UTC_TIMESTAMP()
        ORDER BY id DESC LIMIT 1
    """, (email, purpose))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return row is not None