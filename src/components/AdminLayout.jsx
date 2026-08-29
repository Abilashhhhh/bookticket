import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useApp } from '../context/AppContext';
import './adminlayout.css';

const items = [
  { to: '/admin', label: 'Dashboard', end: true, icon: '▤' },
  { to: '/admin/events', label: 'Manage Events', icon: '🎫' },
  { to: '/admin/bookings', label: 'Bookings & Payments', icon: '🧾' },
  { to: '/admin/users', label: 'Registered Users', icon: '👤' },
  { to: '/admin/organizers', label: 'Organizers', icon: '🏷️' },
  { to: '/admin/reports', label: 'Reports', icon: '📊' },
];

export default function AdminLayout() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-sidebar-brand"><Logo variant="light" /></Link>
        <nav>
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 'admin-nav-item' + (isActive ? ' active' : '')}
            >
              <span className="admin-nav-icon">{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item">↩ Back to site</Link>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar-eyebrow">Admin Console</p>
            <h2>Welcome back, {currentUser?.name || 'Admin'}</h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
        </header>
        <div className="admin-page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
