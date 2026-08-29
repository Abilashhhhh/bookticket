import { useApp } from '../../context/AppContext';
import { currency } from '../../data/mockData';
import './admin.css';

export default function Reports() {
  const { events, bookings } = useApp();

  const paidBookings = bookings.filter(b => b.paymentStatus === 'Paid');
  const totalRevenue = paidBookings.reduce((sum, b) => sum + b.amount, 0);
  const totalTicketsSold = events.reduce((sum, e) => sum + e.ticketsSold, 0);
  const avgOrderValue = paidBookings.length ? Math.round(totalRevenue / paidBookings.length) : 0;

  const byCategory = events.reduce((acc, e) => {
    acc[e.category] = acc[e.category] || { events: 0, sold: 0, revenue: 0 };
    acc[e.category].events += 1;
    acc[e.category].sold += e.ticketsSold;
    acc[e.category].revenue += e.ticketsSold * e.price;
    return acc;
  }, {});

  const topEvents = [...events].sort((a, b) => (b.ticketsSold * b.price) - (a.ticketsSold * a.price)).slice(0, 5);

  return (
    <div>
      <div className="grid-4">
        <div className="card stat-card"><span>Total Revenue</span><strong>{currency(totalRevenue)}</strong></div>
        <div className="card stat-card"><span>Tickets Sold</span><strong>{totalTicketsSold}</strong></div>
        <div className="card stat-card"><span>Paid Bookings</span><strong>{paidBookings.length}</strong></div>
        <div className="card stat-card"><span>Avg. Order Value</span><strong>{currency(avgOrderValue)}</strong></div>
      </div>

      <div className="admin-two-col">
        <div className="card admin-panel">
          <h3>Revenue by category</h3>
          <table>
            <thead>
              <tr><th>Category</th><th>Events</th><th>Tickets sold</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {Object.entries(byCategory).map(([cat, d]) => (
                <tr key={cat}>
                  <td>{cat}</td>
                  <td>{d.events}</td>
                  <td>{d.sold}</td>
                  <td>{currency(d.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card admin-panel">
          <h3>Top performing events</h3>
          <table>
            <thead><tr><th>Event</th><th>Revenue</th></tr></thead>
            <tbody>
              {topEvents.map(e => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{currency(e.ticketsSold * e.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
