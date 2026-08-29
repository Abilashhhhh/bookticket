import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './admin.css';

export default function ManageUsers() {
  const { users } = useApp();
  const [query, setQuery] = useState('');

  const filtered = users.filter(u => (u.name + u.email).toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="admin-toolbar">
        <input placeholder="Search registered users…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>User ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Bookings</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{new Date(u.joined).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td>{u.bookings}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="muted" style={{ textAlign: 'center', padding: 32 }}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
