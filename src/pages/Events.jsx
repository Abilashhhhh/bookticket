import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { categories } from '../data/mockData';
import EventCard from '../components/EventCard';
import './events.css';

export default function Events() {
  const { events } = useApp();
  const [params, setParams] = useSearchParams();

  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [city, setCity] = useState('All');
  const [sort, setSort] = useState('date');

  const cities = useMemo(() => ['All', ...new Set(events.map(e => e.city))], [events]);

  const filtered = useMemo(() => {
    let list = events.filter(e => {
      const matchesQuery = (e.name + e.city + e.category).toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || e.category === category;
      const matchesCity = city === 'All' || e.city === city;
      return matchesQuery && matchesCategory && matchesCity;
    });
    if (sort === 'date') list = list.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === 'price-low') list = list.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list = list.sort((a, b) => b.price - a.price);
    return list;
  }, [events, query, category, city, sort]);

  const applyCategory = (cat) => {
    setCategory(cat);
    setParams(cat === 'All' ? {} : { category: cat });
  };

  return (
    <div className="page">
      <div className="container">
        <p className="section-eyebrow">All events</p>
        <h1 style={{ marginBottom: 4 }}>Find your next event</h1>
        <p className="muted" style={{ marginBottom: 28 }}>{filtered.length} event{filtered.length !== 1 ? 's' : ''} matching your filters</p>

        <div className="events-toolbar card">
          <input
            type="text"
            placeholder="Search by event, city or category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={category} onChange={(e) => applyCategory(e.target.value)}>
            <option value="All">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            {cities.map(c => <option key={c} value={c}>{c === 'All' ? 'All cities' : c}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="date">Sort: Date (soonest)</option>
            <option value="price-low">Sort: Price (low to high)</option>
            <option value="price-high">Sort: Price (high to low)</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No events found</h3>
            <p>Try a different search term, category or city.</p>
          </div>
        ) : (
          <div className="grid-3" style={{ marginTop: 28 }}>
            {filtered.map(ev => <EventCard key={ev.id} event={ev} />)}
          </div>
        )}
      </div>
    </div>
  );
}
