import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { currency } from '../../data/mockData';
import './admin.css';

export default function AdminDashboard() {
  const { events, bookings, users, organizers } = useApp();

  const totalRevenue = bookings.filter(b => b.paymentStatus === 'Paid').reduce((sum, b) => sum + b.amount, 0);
  const ticketsSold = events.reduce((sum, e) => sum + e.ticketsSold, 0);
  const ticketsAvailable = events.reduce((sum, e) => sum + (e.totalTickets - e.ticketsSold), 0);
  const pendingPayments = bookings.filter(b => b.paymentStatus === 'Pending').length;

  const stats = [
    { label: 'Total Events', value: events.length, to: '/admin/events' },
    { label: 'Registered Users', value: users.length, to: '/admin/users' },
    { label: 'Tickets Sold', value: ticketsSold, to: '/admin/bookings' },
    { label: 'Total Revenue', value: currency(totalRevenue), to: '/admin/reports' },
  ];

  return (
    <div>
      <div className="grid-4">
        {stats.map(s => (
          <Link to={s.to} key={s.label} className="card stat-card">
            <span>{s.label}</span>
            <strong>{s.value}</strong>
          </Link>
        ))}
      </div>

      <div className="admin-two-col">
        <div className="card admin-panel">
          <div className="flex-between">
            <h3>Ticket availability by event</h3>
            <Link to="/admin/events" className="btn btn-outline btn-sm">Manage events</Link>
          </div>
          <table>
            <thead>
              <tr><th>Event</th><th>Sold</th><th>Available</th><th>Status</th></tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.ticketsSold}</td>
                  <td>{e.totalTickets - e.ticketsSold}</td>
                  <td><span className={`badge badge-${e.status.toLowerCase()}`}>{e.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-side-col">
          <div className="card admin-panel">
            <h3>Payments needing attention</h3>
            <p className="muted" style={{ marginBottom: 12 }}>{pendingPayments} booking(s) awaiting payment confirmation.</p>
            <Link to="/admin/bookings" className="btn btn-navy btn-block btn-sm">Review bookings</Link>
          </div>
          <div className="card admin-panel">
            <h3>Organizers</h3>
            <p className="muted" style={{ marginBottom: 12 }}>{organizers.length} organizer accounts on the platform.</p>
            <Link to="/admin/organizers" className="btn btn-outline btn-block btn-sm">Manage organizers</Link>
          </div>
          <div className="card admin-panel">
            <h3>Tickets remaining</h3>
            <p className="muted" style={{ marginBottom: 0 }}>{ticketsAvailable} tickets still available across all live events.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
