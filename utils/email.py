"""
utils/email.py
---------------
Sends emails using Brevo's HTTP API (works on hosts like Render that
block outbound SMTP connections — regular web requests are used instead).
"""

import os
import requests

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def _send_email(to_email: str, subject: str, html_body: str):
    api_key = os.environ.get('BREVO_API_KEY')
    sender_email = os.environ.get('BREVO_SENDER_EMAIL')

    payload = {
        "sender": {"name": "BookTix", "email": sender_email},
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_body,
    }
    headers = {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json",
    }

    response = requests.post(BREVO_API_URL, json=payload, headers=headers, timeout=15)
    if response.status_code >= 300:
        raise Exception(f"Brevo email failed: {response.status_code} {response.text}")


def send_otp_email(to_email: str, otp_code: str, purpose: str):
    """Sends a 6-digit OTP to the given email address."""
    subject = "Your BookTix verification code"
    if purpose == 'reset-password':
        subject = "Your BookTix password reset code"

    body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
        <h2 style="color: #ff6a00;">BookTix</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 6px;">{otp_code}</h1>
        <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
    </div>
    """
    _send_email(to_email, subject, body)


def send_ticket_email(to_email: str, booking: dict, event: dict):
    """Sends a booking confirmation with ticket details after successful payment."""
    subject = f"Your BookTix ticket — {event['name']}"

    body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #ff6a00;">BookTix</h2>
        <p>Hi {booking['userName']}, your booking is confirmed!</p>
        <div style="border: 1px solid #eee; border-radius: 10px; padding: 20px; margin-top: 16px;">
            <h3 style="margin: 0 0 12px;">{event['name']}</h3>
            <p style="margin: 4px 0;"><strong>Date:</strong> {event['date']} at {event['time']}</p>
            <p style="margin: 4px 0;"><strong>Venue:</strong> {event['venue']}, {event['city']}</p>
            <p style="margin: 4px 0;"><strong>Ticket type:</strong> {booking['ticketType']}</p>
            <p style="margin: 4px 0;"><strong>Quantity:</strong> {booking['quantity']}</p>
            <p style="margin: 4px 0;"><strong>Booking ID:</strong> {booking['id']}</p>
            <p style="margin: 4px 0;"><strong>Amount paid:</strong> Rs.{booking['amount']}</p>
        </div>
        <p style="margin-top: 16px; color: #666; font-size: 13px;">
            Show this email or your Booking ID at the venue entrance. See you there!
        </p>
    </div>
    """
    _send_email(to_email, subject, body)