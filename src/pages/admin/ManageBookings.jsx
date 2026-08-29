import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { currency } from '../../data/mockData';
import './admin.css';

export default function ManageBookings() {
  const { bookings, confirmBookingPayment } = useApp();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = bookings.filter(b => {
    const matchesQuery = (b.id + b.eventName + b.userName + b.email).toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === 'All' || b.paymentStatus === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div>
      <div className="admin-toolbar">
        <input placeholder="Search by booking ID, event or customer…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All payment statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th><th>Event</th><th>Customer</th><th>Qty</th><th>Amount</th>
              <th>Booking Status</th><th>Payment</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.eventName}</td>
                <td>{b.userName}<br /><span className="muted" style={{ fontSize: 12 }}>{b.email}</span></td>
                <td>{b.quantity}</td>
                <td>{currency(b.amount)}</td>
                <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                <td><span className={`badge badge-${b.paymentStatus.toLowerCase()}`}>{b.paymentStatus}</span></td>
                <td>
                  {b.paymentStatus === 'Pending' ? (
                    <div className="table-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => confirmBookingPayment(b.rawId, 'Paid')}>Mark Paid</button>
                      <button className="btn btn-danger btn-sm" onClick={() => confirmBookingPayment(b.rawId, 'Failed')}>Mark Failed</button>
                    </div>
                  ) : (
                    <span className="muted" style={{ fontSize: 12.5 }}>No action needed</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="muted" style={{ textAlign: 'center', padding: 32 }}>No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
