import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { currency } from '../data/mockData';
import './eventdetails.css';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

export default function EventDetails() {
  const { id } = useParams();
  const { events } = useApp();
  const navigate = useNavigate();
  const event = events.find(e => String(e.id) === id);

  if (!event) {
    return (
      <div className="page container empty-state">
        <h3>Event not found</h3>
        <p>The event you're looking for may have been removed.</p>
        <Link to="/events" className="btn btn-primary">Browse events</Link>
      </div>
    );
  }

  const remaining = event.totalTickets - event.ticketsSold;
  const soldOut = remaining <= 0;
  const almostSoldOut = !soldOut && remaining <= event.totalTickets * 0.1;

  return (
    <div className="page">
      <div className="container event-details">
        <div className="event-details-media">
          <img src={event.image} alt={event.name} />
        </div>

        <div className="event-details-grid">
          <div className="event-details-main">
            <span className="badge badge-active">{event.category}</span>
            <h1>{event.name}</h1>
            <p className="event-details-desc">{event.description}</p>

            <div className="event-info-list">
              <div><span>📅 Date</span><strong>{formatDate(event.date)}</strong></div>
              <div><span>🕒 Time</span><strong>{event.time}</strong></div>
              <div><span>📍 Venue</span><strong>{event.venue}</strong></div>
              <div><span>🏷️ Organizer</span><strong>{event.organizer}</strong></div>
            </div>
          </div>

          <aside className="event-booking-card card">
            <p className="event-booking-price">{currency(event.price)} <span>starting price</span></p>

            <div className="event-availability">
              {soldOut ? (
                <span className="badge badge-cancelled">Sold out</span>
              ) : almostSoldOut ? (
                <span className="badge badge-pending">Only {remaining} tickets left</span>
              ) : (
                <span className="badge badge-confirmed">{remaining} tickets available</span>
              )}
            </div>

            <button
              className="btn btn-primary btn-block"
              disabled={soldOut}
              onClick={() => navigate(`/book/${event.id}`)}
            >
              {soldOut ? 'Sold Out' : 'Book Now'}
            </button>

            <ul className="event-booking-notes">
              <li>Instant booking confirmation</li>
              <li>E-ticket with unique booking ID</li>
              <li>Secure demo checkout</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
