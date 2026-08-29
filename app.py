"""
app.py
------
This is the file you run to start the backend server.

    python app.py

It creates the Flask app, turns on CORS (so your React frontend running on
a different port can talk to it), and registers every group of routes
(auth, events, bookings, users, organizers, reports).
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load variables from .env into the environment BEFORE config.py reads them
load_dotenv()

from routes.auth_routes import auth_bp
from routes.event_routes import event_bp
from routes.booking_routes import booking_bp
from routes.user_routes import user_bp
from routes.organizer_routes import organizer_bp
from routes.report_routes import report_bp
from models.db import init_db


def create_app():
    app = Flask(__name__)

    # Auto-initialize database & seed data if needed
    init_db()

    # Allow requests from your React dev server (Vite runs on :5173 by default)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.register_blueprint(auth_bp)
    app.register_blueprint(event_bp)
    app.register_blueprint(booking_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(organizer_bp)
    app.register_blueprint(report_bp)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Quick way to check the server + JSON responses are working:
        visit http://localhost:5000/api/health in your browser."""
        return jsonify({'status': 'ok', 'message': 'BookTix backend is running'}), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Route not found'}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

    return app


app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
