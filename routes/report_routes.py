"""
routes/report_routes.py
--------------------------
GET /api/reports/summary   -> admin: revenue, tickets sold, category breakdown
"""

from flask import Blueprint, jsonify

from models.db import get_connection
from utils.auth import admin_required

report_bp = Blueprint('reports', __name__, url_prefix='/api/reports')


@report_bp.route('/summary', methods=['GET'])
@admin_required
def summary():
    conn = get_connection()
    cursor = conn.cursor()


    cursor.execute("""
        SELECT COALESCE(SUM(amount), 0) AS total_revenue, COUNT(*) AS paid_bookings
        FROM bookings WHERE payment_status = 'Paid'
    """)
    totals = cursor.fetchone()

    cursor.execute("SELECT COALESCE(SUM(tickets_sold), 0) AS tickets_sold FROM events")
    tickets = cursor.fetchone()

    cursor.execute("""
        SELECT category,
               COUNT(*) AS events,
               COALESCE(SUM(tickets_sold), 0) AS sold,
               COALESCE(SUM(tickets_sold * price), 0) AS revenue
        FROM events
        GROUP BY category
    """)
    by_category = cursor.fetchall()

    cursor.execute("""
        SELECT name, (tickets_sold * price) AS revenue
        FROM events
        ORDER BY revenue DESC
        LIMIT 5
    """)
    top_events = cursor.fetchall()

    cursor.close()
    conn.close()

    paid_bookings = totals['paid_bookings'] or 0
    total_revenue = float(totals['total_revenue'] or 0)
    avg_order_value = round(total_revenue / paid_bookings, 2) if paid_bookings else 0

    return jsonify({
        'totalRevenue': total_revenue,
        'ticketsSold': int(tickets['tickets_sold']),
        'paidBookings': paid_bookings,
        'avgOrderValue': avg_order_value,
        'byCategory': [
            {
                'category': row['category'],
                'events': row['events'],
                'sold': int(row['sold']),
                'revenue': float(row['revenue']),
            } for row in by_category
        ],
        'topEvents': [
            {'name': row['name'], 'revenue': float(row['revenue'])} for row in top_events
        ],
    }), 200
