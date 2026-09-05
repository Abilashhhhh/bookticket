"""
config.py
---------
Central place for all settings. Values are read from environment variables
(so real passwords never get hard-coded or committed to git) with safe
local-development fallbacks.
"""

import os

class Config:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    # ---- MySQL connection settings ----
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '')
    MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE', 'booktix_db')

    # ---- JWT (login token) settings ----
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'change-this-secret-key-in-production')
    JWT_EXPIRY_HOURS = int(os.environ.get('JWT_EXPIRY_HOURS', 24))

    # ---- Flask ----
    DEBUG = os.environ.get('FLASK_DEBUG', 'True') == 'True'