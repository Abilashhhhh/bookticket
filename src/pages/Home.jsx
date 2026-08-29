import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/mockData';
import EventCard from '../components/EventCard';
import './home.css';

export default function Home() {
  const { events } = useApp();
  const [query, setQuery] = useState('');
  const navigateTo = useNavigate();
  const navigate = (q) => navigateTo(q ? `/events?q=${encodeURIComponent(q)}` : '/events');

  const upcoming = [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
  const popular = [...events].sort((a, b) => b.ticketsSold - a.ticketsSold).slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query);
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <p className="section-eyebrow" style={{ color: 'var(--orange-400)' }}>Event management &amp; ticketing, done right</p>
          <h1>Book events.<br />Live moments.</h1>
          <p className="hero-sub">
            Discover concerts, conferences, matches and shows near you — and book verified tickets
            in a few clicks, with a booking record you can always look up.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search events, cities or categories…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search Events</button>
          </form>

          <div className="hero-stats">
            <div><strong>{events.length}+</strong><span>Live events</span></div>
            <div><strong>12k+</strong><span>Tickets booked</span></div>
            <div><strong>98%</strong><span>On-time entry rate</span></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container section">
        <p className="section-eyebrow">Browse by category</p>
        <div className="category-row">
          {categories.map(cat => (
            <Link key={cat} to={`/events?category=${encodeURIComponent(cat)}`} className="category-chip">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section className="container section">
        <div className="flex-between">
          <div>
            <p className="section-eyebrow">Don't miss out</p>
            <h2>Upcoming Events</h2>
          </div>
          <Link to="/events" className="btn btn-outline btn-sm">View all events</Link>
        </div>
        <div className="grid-3" style={{ marginTop: 24 }}>
          {upcoming.map(ev => <EventCard key={ev.id} event={ev} />)}
        </div>
      </section>

      {/* Popular */}
      <section className="container section">
        <p className="section-eyebrow">Trending now</p>
        <h2>Popular Events</h2>
        <div className="grid-3" style={{ marginTop: 24 }}>
          {popular.map(ev => <EventCard key={ev.id} event={ev} />)}
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="container cta-band-inner">
          <div>
            <h2>Organizing an event?</h2>
            <p>Get in touch to list your event on BookTix and reach thousands of verified attendees.</p>
          </div>
          <Link to="/register" className="btn btn-navy">Get Started</Link>
        </div>
      </section>
    </div>
  );
}
