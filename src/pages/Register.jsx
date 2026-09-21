import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';
import './auth.css';
import PasswordInput from '../components/PasswordInput';

export default function Register() {
  const { register, sendOtp, verifyOtp } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = enter details, 2 = enter OTP + password
  const [form, setForm] = useState({ name: '', email: '', otp: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSending(true);
    const result = await sendOtp(form.email, 'register');
    setSending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setStep(2);
  };

  const handleVerifyAndCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    const otpResult = await verifyOtp(form.email, form.otp, 'register');
    if (!otpResult.ok) {
      setSubmitting(false);
      setError(otpResult.message);
      return;
    }
    const result = await register(form);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <Link to="/" className="auth-logo"><Logo /></Link>
        <h1>Create your account</h1>
        <p className="muted" style={{ marginBottom: 20 }}>Register to book tickets and track your events in one place.</p>

        {error && <p className="auth-error">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" type="text" required placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
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
          <form onSubmit={handleVerifyAndCreate}>
            <p className="hint" style={{ marginBottom: 16 }}>
              We sent a 6-digit code to <strong>{form.email}</strong>. Enter it below to verify your email.
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
                <label htmlFor="password">Password</label>
                <PasswordInput id="password" required placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="confirm">Confirm password</label>
                <PasswordInput id="confirm" required placeholder="••••••••" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Verify & Create Account'}
            </button>
            <button
              type="button"
              className="btn btn-outline btn-block"
              style={{ marginTop: 10 }}
              onClick={() => setStep(1)}
              disabled={submitting}
            >
              Back
            </button>
          </form>
        )}

        <p className="auth-switch" style={{ marginTop: 20 }}>Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}