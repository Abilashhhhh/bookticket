import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';
import './auth.css';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const adminRequired = location.state?.adminRequired;

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(result.user.role === 'Admin' ? '/admin' : '/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <Link to="/" className="auth-logo"><Logo /></Link>
        <h1>Welcome back</h1>
        <p className="muted" style={{ marginBottom: 20 }}>Log in to manage your bookings and tickets.</p>

        {adminRequired && <p className="auth-notice">Please log in with an admin account to access the Admin Panel.</p>}
        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Log In</button>
        </form>

        <p className="auth-hint">Demo tip: log in with an email containing "admin" (e.g. admin@booktix.com) to view the Admin Panel.</p>

        <p className="auth-switch">Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}
