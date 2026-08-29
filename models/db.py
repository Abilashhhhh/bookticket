"""
models/db.py
------------
Shared helper for SQLite3 database connections. Provides get_connection()
and init_db() to automatically initialize tables and seed data.
"""

import os
import sqlite3
from config import Config


def get_connection():
    """
    Opens and returns a new SQLite3 connection using Config.DATABASE_PATH.
    Enables foreign keys and uses sqlite3.Row for dictionary-like column access.
    """
    db_path = Config.DATABASE_PATH
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_db():
    """
    Checks if database tables exist; if not, runs schema.sql and seed.sql.
    Runs automatically on app startup.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
    table_exists = cursor.fetchone()

    if not table_exists:
        base_dir = Config.BASE_DIR
        schema_path = os.path.join(base_dir, 'database', 'schema.sql')
        seed_path = os.path.join(base_dir, 'database', 'seed.sql')

        if os.path.exists(schema_path):
            with open(schema_path, 'r', encoding='utf-8') as f:
                cursor.executescript(f.read())

        if os.path.exists(seed_path):
            with open(seed_path, 'r', encoding='utf-8') as f:
                cursor.executescript(f.read())

        conn.commit()

    cursor.close()
    conn.close()

