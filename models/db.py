"""
models/db.py
------------
Shared helper for MySQL database connections (via PyMySQL). Provides
get_connection() and init_db() to automatically create tables the first
time the app runs against a fresh database.
"""

import os
import pymysql
import pymysql.cursors
from config import Config


def get_connection():
    """Opens and returns a new MySQL connection. Rows come back as
    dictionaries, same as sqlite3.Row did before."""
    return pymysql.connect(
        host=Config.MYSQL_HOST,
        port=Config.MYSQL_PORT,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DATABASE,
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False,
    )


def _run_sql_file(cursor, path):
    """Splits a .sql file into individual statements and runs each one."""
    with open(path, 'r', encoding='utf-8') as f:
        sql = f.read()
    for statement in sql.split(';'):
        statement = statement.strip()
        if statement:
            cursor.execute(statement)


def init_db():
    """Checks if tables exist; if not, runs schema.sql and seed.sql."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT TABLE_NAME FROM information_schema.tables
        WHERE table_schema = %s AND table_name = 'users'
    """, (Config.MYSQL_DATABASE,))
    table_exists = cursor.fetchone()

    if not table_exists:
        schema_path = os.path.join(Config.BASE_DIR, 'database', 'schema.sql')
        seed_path = os.path.join(Config.BASE_DIR, 'database', 'seed.sql')

        if os.path.exists(schema_path):
            _run_sql_file(cursor, schema_path)
        if os.path.exists(seed_path):
            _run_sql_file(cursor, seed_path)

        conn.commit()

    cursor.close()
    conn.close()