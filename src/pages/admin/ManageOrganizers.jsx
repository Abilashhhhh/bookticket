import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './admin.css';

export default function ManageOrganizers() {
  const { organizers, updateOrganizer } = useApp();
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'Active' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const filtered = organizers.filter(o => (o.name + o.email).toLowerCase().includes(query.toLowerCase()));

  const openEdit = (o) => {
    setForm({ name: o.name, email: o.email, phone: o.phone || '', status: o.status });
    setEditingId(o.id);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await updateOrganizer(editingId, form);
      setEditingId(null);
    } catch (err) {
      setFormError(err.message || 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <input placeholder="Search organizers…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Organizer ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Events managed</th><th>Status</th><th>Actions</th>
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
                <td><button className="btn btn-outline btn-sm" onClick={() => openEdit(o)}>Edit</button></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="muted" style={{ textAlign: 'center', padding: 32 }}>No organizers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editingId && (
        <div className="modal-overlay" onClick={() => !saving && setEditingId(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Edit organizer</h3>
            {formError && <p className="field-error" style={{ marginBottom: 14 }}>{formError}</p>}
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field">
                <label>Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="field">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline btn-block" onClick={() => setEditingId(null)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
