"""
config.py
---------
Central place for all settings. Values are read from environment variables
(so real passwords never get hard-coded or committed to git) with safe
local-development fallbacks.

These are loaded from a ".env" file automatically (see app.py) using
python-dotenv, so you only need to edit ".env" — not this file.
"""

import os

class Config:
    # ---- Database settings (SQLite3) ----
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATABASE_PATH = os.environ.get('DATABASE_PATH', os.path.join(BASE_DIR, 'database', 'booktix.db'))

    # ---- JWT (login token) settings ----
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'change-this-secret-key-in-production')
    JWT_EXPIRY_HOURS = int(os.environ.get('JWT_EXPIRY_HOURS', 24))

    # ---- Flask ----
    DEBUG = os.environ.get('FLASK_DEBUG', 'True') == 'True'
