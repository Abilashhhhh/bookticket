import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';
import './auth.css';

export default function ForgotPassword() {
  const { sendOtp, verifyOtp, resetPassword } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP + new password
  const [form, setForm] = useState({ email: '', otp: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSending(true);
    const result = await sendOtp(form.email, 'reset-password');
    setSending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setStep(2);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    const otpResult = await verifyOtp(form.email, form.otp, 'reset-password');
    if (!otpResult.ok) {
      setSubmitting(false);
      setError(otpResult.message);
      return;
    }
    const result = await resetPassword(form.email, form.password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <Link to="/" className="auth-logo"><Logo /></Link>
        <h1>Reset your password</h1>
        <p className="muted" style={{ marginBottom: 20 }}>We'll email you a code to verify it's really you.</p>

        {error && <p className="auth-error">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
              {sending ? 'Sending code…' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset}>
            <p className="hint" style={{ marginBottom: 16 }}>
              We sent a 6-digit code to <strong>{form.email}</strong>.
            </p>
            <div className="field">
              <label htmlFor="otp">Verification code</label>
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/[^0-9]/g, '') })}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="password">New password</label>
                <input id="password" type="password" required placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="confirm">Confirm new password</label>
                <input id="confirm" type="password" required placeholder="••••••••" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="auth-switch" style={{ marginTop: 20 }}>Remembered it? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}