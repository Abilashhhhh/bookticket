import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './admin.css';

export default function ManageOrganizers() {
  const { organizers } = useApp();
  const [query, setQuery] = useState('');

  const filtered = organizers.filter(o => (o.name + o.email).toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="admin-toolbar">
        <input placeholder="Search organizers…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Organizer ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Events managed</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.name}</td>
                <td>{o.email}</td>
                <td>{o.phone}</td>
                <td>{o.eventsManaged}</td>
                <td><span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="muted" style={{ textAlign: 'center', padding: 32 }}>No organizers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
