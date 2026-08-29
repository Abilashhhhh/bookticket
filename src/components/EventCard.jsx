import { Link } from 'react-router-dom';
import { currency } from '../data/mockData';
import './eventcard.css';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function EventCard({ event }) {
  const remaining = event.totalTickets - event.ticketsSold;
  const soldOut = remaining <= 0;

  return (
    <Link to={`/events/${event.id}`} className="event-card">
      <div className="event-card-media">
        <img src={event.image} alt={event.name} loading="lazy" />
        <span className="event-card-category">{event.category}</span>
        {soldOut && <span className="event-card-soldout">Sold Out</span>}
      </div>
      <div className="event-card-body">
        <h3>{event.name}</h3>
        <div className="event-card-meta">
          <span>📅 {formatDate(event.date)}</span>
          <span>📍 {event.city}</span>
        </div>
        <div className="event-card-footer">
          <span className="event-card-price">{currency(event.price)} <em>onwards</em></span>
          <span className="event-card-cta">View details →</span>
        </div>
      </div>
    </Link>
  );
}
