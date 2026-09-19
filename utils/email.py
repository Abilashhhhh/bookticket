"""
utils/email.py
---------------
Sends OTP emails using Gmail's SMTP server.
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os


def send_otp_email(to_email: str, otp_code: str, purpose: str):
    """Sends a 6-digit OTP to the given email address."""
    gmail_address = os.environ.get('GMAIL_ADDRESS')
    gmail_app_password = os.environ.get('GMAIL_APP_PASSWORD')

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

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = gmail_address
    msg['To'] = to_email
    msg.attach(MIMEText(body, 'html'))

    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(gmail_address, gmail_app_password)
        server.sendmail(gmail_address, to_email, msg.as_string())
        
        