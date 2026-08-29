import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { currency } from '../data/mockData';
import './mytickets.css';

export default function MyTickets() {
  const { currentUser, myBookings } = useApp();
  const location = useLocation();
  const justBooked = location.state?.justBooked;
  const [lookupEmail, setLookupEmail] = useState(currentUser?.email || '');
  const [searched, setSearched] = useState(!!currentUser);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!searched || !lookupEmail) return;
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    myBookings(lookupEmail)
      .then((data) => { if (!cancelled) setBookings(data); })
      .catch((err) => { if (!cancelled) setLoadError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searched, lookupEmail]);

  const handleLookup = (e) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="page container">
      <p className="section-eyebrow">Your bookings</p>
      <h1>My Tickets</h1>

      {!currentUser && (
        <form className="card ticket-lookup" onSubmit={handleLookup}>
          <p className="muted" style={{ marginBottom: 12 }}>Not logged in? Enter the email you used while booking to look up your tickets.</p>
          <div className="ticket-lookup-row">
            <input type="email" required placeholder="you@example.com" value={lookupEmail} onChange={(e) => setLookupEmail(e.target.value)} />
            <button className="btn btn-primary" type="submit">Find my tickets</button>
          </div>
        </form>
      )}

      {loading && <p className="muted">Loading your bookings…</p>}
      {loadError && <p className="field-error">{loadError}</p>}

      {searched && !loading && bookings.length === 0 && (
        <div className="empty-state">
          <h3>No bookings found</h3>
          <p>We couldn't find any tickets for this email address.</p>
          <Link to="/events" className="btn btn-primary">Browse events</Link>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="ticket-list">
          {bookings.map(b => (
            <div key={b.id} className={'card ticket-item' + (justBooked === b.id ? ' just-booked' : '')}>
              <div className="ticket-item-main">
                <div className="flex-between">
                  <h3>{b.eventName}</h3>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                </div>
                <div className="ticket-item-grid">
                  <div><span>Booking ID</span><strong>{b.id}</strong></div>
                  <div><span>Ticket type</span><strong>{b.ticketType}</strong></div>
                  <div><span>Quantity</span><strong>{b.quantity}</strong></div>
                  <div><span>Booked on</span><strong>{new Date(b.date).toLocaleDateString('en-IN')}</strong></div>
                  <div><span>Amount</span><strong>{currency(b.amount)}</strong></div>
                  <div><span>Payment</span><strong className={`pay-${b.paymentStatus.toLowerCase()}`}>{b.paymentStatus}</strong></div>
                </div>
              </div>
              {b.paymentStatus === 'Pending' && (
                <Link to={`/payment/${b.rawId}`} className="btn btn-primary btn-sm">Complete Payment</Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
