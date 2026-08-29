import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { currency } from '../data/mockData';
import './payment.css';

export default function Payment() {
  const { id } = useParams(); // this is the numeric booking id (rawId)
  const { getBookingById, confirmBookingPayment } = useApp();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getBookingById(id)
      .then((data) => { if (!cancelled) setBooking(data); })
      .catch((err) => { if (!cancelled) setLoadError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, getBookingById]);

  const [method, setMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState('');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  if (loading) {
    return <div className="page container empty-state"><h3>Loading your booking…</h3></div>;
  }

  if (loadError || !booking) {
    return (
      <div className="page container empty-state">
        <h3>Booking not found</h3>
        {loadError && <p className="muted">{loadError}</p>}
        <Link to="/events" className="btn btn-primary">Browse events</Link>
      </div>
    );
  }

  if (booking.paymentStatus !== 'Pending') {
    return (
      <div className="page container empty-state">
        <h3>This booking has already been processed</h3>
        <p>Status: {booking.paymentStatus}</p>
        <Link to="/my-tickets" className="btn btn-primary">Go to My Tickets</Link>
      </div>
    );
  }

  const handlePay = async (e) => {
    e.preventDefault();
    setPayError('');
    setProcessing(true);
    try {
      // Simulated demo payment gateway — replace this whole block with a
      // real gateway callback (Razorpay/Stripe/etc.) when you're ready.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await confirmBookingPayment(booking.rawId, 'Paid');
      navigate('/my-tickets', { state: { justBooked: booking.id } });
    } catch (err) {
      setPayError(err.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="page">
      <div className="container payment-grid">
        <div className="card payment-form">
          <p className="section-eyebrow">Step 2 of 2 — Payment</p>
          <h1>Complete your payment</h1>
          <p className="muted" style={{ marginBottom: 24 }}>This is a demo payment flow — no real transaction is made.</p>

          <div className="payment-methods">
            {['card', 'upi', 'netbanking'].map(m => (
              <button
                type="button"
                key={m}
                className={'payment-method' + (method === m ? ' active' : '')}
                onClick={() => setMethod(m)}
              >
                {m === 'card' ? '💳 Card' : m === 'upi' ? '📱 UPI' : '🏦 Net Banking'}
              </button>
            ))}
          </div>

          <form onSubmit={handlePay}>
            {method === 'card' && (
              <>
                <div className="field">
                  <label>Card number</label>
                  <input required maxLength={19} placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
                </div>
                <div className="field">
                  <label>Name on card</label>
                  <input required placeholder="As printed on card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Expiry</label>
                    <input required placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>CVV</label>
                    <input required maxLength={3} placeholder="•••" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
                  </div>
                </div>
              </>
            )}
            {method === 'upi' && (
              <div className="field">
                <label>UPI ID</label>
                <input required placeholder="yourname@upi" />
              </div>
            )}
            {method === 'netbanking' && (
              <div className="field">
                <label>Select bank</label>
                <select required defaultValue="">
                  <option value="" disabled>Choose your bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={processing}>
              {processing ? 'Processing payment…' : `Pay ${currency(booking.amount)}`}
            </button>
            {payError && <p className="field-error" style={{ marginTop: 10, textAlign: 'center' }}>{payError}</p>}
            <p className="payment-secure-note">🔒 Payments are simulated for demo purposes. No card data is stored or transmitted.</p>
          </form>
        </div>

        <aside className="card payment-summary">
          <h3>Booking summary</h3>
          <div className="summary-row"><span>Booking ID</span><strong>{booking.id}</strong></div>
          <div className="summary-row"><span>Event</span><strong>{booking.eventName}</strong></div>
          <div className="summary-row"><span>Ticket type</span><strong>{booking.ticketType}</strong></div>
          <div className="summary-row"><span>Quantity</span><strong>{booking.quantity}</strong></div>
          <div className="summary-divider" />
          <div className="summary-row summary-total"><span>Amount payable</span><strong>{currency(booking.amount)}</strong></div>
        </aside>
      </div>
    </div>
  );
}
