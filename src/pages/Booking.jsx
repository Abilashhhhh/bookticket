import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { currency, ticketTypesFor } from '../data/mockData';
import './booking.css';

export default function Booking() {
  const { id } = useParams();
  const { events, currentUser, addBooking } = useApp();
  const navigate = useNavigate();
  const event = events.find(e => String(e.id) === id);

  const ticketTypes = useMemo(() => (event ? ticketTypesFor(event) : []), [event]);

  const [form, setForm] = useState({
    ticketType: ticketTypes[0]?.type || 'General',
    quantity: 1,
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!event) {
    return (
      <div className="page container empty-state">
        <h3>Event not found</h3>
        <Link to="/events" className="btn btn-primary">Browse events</Link>
      </div>
    );
  }

  const remaining = event.totalTickets - event.ticketsSold;
  const selectedType = ticketTypes.find(t => t.type === form.ticketType) || ticketTypes[0];
  const total = (selectedType?.price || 0) * Number(form.quantity || 0);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number.';
    if (form.quantity < 1) e.quantity = 'Select at least 1 ticket.';
    if (form.quantity > remaining) e.quantity = `Only ${remaining} tickets left.`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const booking = await addBooking({
        eventId: event.id,
        ticketType: form.ticketType,
        quantity: Number(form.quantity),
        amount: total,
        userName: form.name,
        email: form.email,
        phone: form.phone,
      });
      navigate(`/payment/${booking.rawId}`);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong while booking. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="container booking-grid">
        <form className="card booking-form" onSubmit={handleSubmit} noValidate>
          <p className="section-eyebrow">Step 1 of 2 — Booking details</p>
          <h1>Book tickets</h1>
          <p className="muted" style={{ marginBottom: 24 }}>{event.name} · {event.venue}</p>

          <div className="field-row">
            <div className="field">
              <label htmlFor="ticketType">Ticket type</label>
              <select id="ticketType" value={form.ticketType} onChange={(e) => update('ticketType', e.target.value)}>
                {ticketTypes.map(t => (
                  <option key={t.type} value={t.type}>{t.type} — {currency(t.price)}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="quantity">Number of tickets</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={remaining}
                value={form.quantity}
                onChange={(e) => update('quantity', e.target.value)}
              />
              {errors.quantity && <p className="field-error">{errors.quantity}</p>}
              <p className="hint">{remaining} tickets available</p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" type="text" placeholder="Your full name" value={form.name} onChange={(e) => update('name', e.target.value)} />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>
            <div className="field">
              <label htmlFor="phone">Phone number</label>
              <input id="phone" type="tel" placeholder="+91 90000 00000" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Booking…' : 'Continue to Payment'}
          </button>
          {submitError && <p className="field-error" style={{ marginTop: 12, textAlign: 'center' }}>{submitError}</p>}
        </form>

        <aside className="card booking-summary">
          <h3>Order summary</h3>
          <div className="summary-row"><span>Event</span><strong>{event.name}</strong></div>
          <div className="summary-row"><span>Ticket type</span><strong>{form.ticketType}</strong></div>
          <div className="summary-row"><span>Price per ticket</span><strong>{currency(selectedType?.price || 0)}</strong></div>
          <div className="summary-row"><span>Quantity</span><strong>{form.quantity}</strong></div>
          <div className="summary-divider" />
          <div className="summary-row summary-total"><span>Total amount</span><strong>{currency(total)}</strong></div>
        </aside>
      </div>
    </div>
  );
}
