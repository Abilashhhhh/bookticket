import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useApp } from '../context/AppContext';
import './navbar.css';

export default function Navbar() {
  const { currentUser, logout } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/my-tickets', label: 'My Tickets' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <div className={`navbar-menu ${open ? 'is-open' : ''}`}>
          <nav className="navbar-links">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            {currentUser?.role === 'Admin' && (
              <NavLink to="/admin" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} onClick={() => setOpen(false)}>
                Admin Panel
              </NavLink>
            )}
          </nav>

          <div className="navbar-actions">
            {currentUser ? (
              <div className="navbar-user">
                <span className="navbar-user-name">Hi, {currentUser.name}</span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>

        <button className="navbar-toggle" aria-label="Toggle menu" onClick={() => setOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
