import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { categories, currency } from '../../data/mockData';
import './admin.css';

const emptyForm = {
  name: '', category: categories[0], date: '', time: '', venue: '', city: '',
  organizer: '', price: '', pricePremium: '', priceVip: '', totalTickets: '',
  image: '', description: '',
};

export default function ManageEvents() {
  const { events, addEvent, updateEvent, deleteEvent } = useApp();
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState('');

  const filtered = events.filter(e => (e.name + e.city + e.category).toLowerCase().includes(query.toLowerCase()));

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setFormError(''); setModalOpen(true); };
  const openEdit = (event) => {
    setForm({
      name: event.name, category: event.category, date: event.date, time: event.time,
      venue: event.venue, city: event.city, organizer: event.organizer,
      price: event.price, pricePremium: event.pricePremium ?? '', priceVip: event.priceVip ?? '',
      totalTickets: event.totalTickets, image: event.image, description: event.description,
    });
    setEditingId(event.id);
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      pricePremium: form.pricePremium === '' ? null : Number(form.pricePremium),
      priceVip: form.priceVip === '' ? null : Number(form.priceVip),
      totalTickets: Number(form.totalTickets),
      image: form.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
    };
    try {
      if (editingId) {
        await updateEvent(editingId, payload);
      } else {
        await addEvent(payload);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Something went wrong while saving this event.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEvent(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch (err) {
      setFormError(err.message || 'Could not delete this event.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <input placeholder="Search events…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn btn-primary" onClick={openAdd}>+ Add New Event</button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Event</th><th>Date</th><th>City</th>
              <th>General</th><th>Premium</th><th>VIP</th>
              <th>Sold / Total</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ev => (
              <tr key={ev.id}>
                <td>{ev.name}</td>
                <td>{new Date(ev.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                <td>{ev.city}</td>
                <td>{currency(ev.price)}</td>
                <td>{currency(ev.pricePremium)}</td>
                <td>{currency(ev.priceVip)}</td>
                <td>{ev.ticketsSold} / {ev.totalTickets}</td>
                <td><span className={`badge badge-${ev.status.toLowerCase()}`}>{ev.status}</span></td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(ev)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDeleteId(ev.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="muted" style={{ textAlign: 'center', padding: 32 }}>No events found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => !saving && setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit event' : 'Add new event'}</h3>
            {formError && <p className="field-error" style={{ marginBottom: 14 }}>{formError}</p>}
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Event name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>City</label>
                  <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Date</label>
                  <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="field">
                  <label>Time</label>
                  <input required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
              <div className="field">
                <label>Venue</label>
                <input required value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
              </div>
              <div className="field">
                <label>Organizer</label>
                <input required value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} />
                <p className="hint">Just type the organizer's name — it's created automatically if it doesn't exist yet.</p>
              </div>

              <p className="section-eyebrow" style={{ marginTop: 4 }}>Ticket prices</p>
              <div className="field-row">
                <div className="field">
                  <label>General price (₹)</label>
                  <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="field">
                  <label>Premium price (₹)</label>
                  <input type="number" min="0" placeholder="auto if left blank" value={form.pricePremium} onChange={(e) => setForm({ ...form, pricePremium: e.target.value })} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>VIP price (₹)</label>
                  <input type="number" min="0" placeholder="auto if left blank" value={form.priceVip} onChange={(e) => setForm({ ...form, priceVip: e.target.value })} />
                </div>
                <div className="field">
                  <label>Total tickets</label>
                  <input required type="number" min="1" value={form.totalTickets} onChange={(e) => setForm({ ...form, totalTickets: e.target.value })} />
                </div>
              </div>

              <div className="field">
                <label>Image URL</label>
                <input placeholder="https://…" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline btn-block" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="modal-overlay" onClick={() => !deleting && setConfirmDeleteId(null)}>
          <div className="modal-card" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <h3>Delete this event?</h3>
            <p className="muted">This action can't be undone. The event and its listing will be permanently removed.</p>
            <div className="modal-actions">
              <button className="btn btn-outline btn-block" onClick={() => setConfirmDeleteId(null)} disabled={deleting}>Cancel</button>
              <button className="btn btn-danger btn-block" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
