// ---------------------------------------------------------------------------
// Shared constants + small formatting helpers used across the app.
// Actual data (events, bookings, users, organizers) now comes from the
// Flask + MySQL backend via src/context/AppContext.jsx — this file no
// longer holds any mock/sample data.
// ---------------------------------------------------------------------------

export const categories = ['Music', 'Technology', 'Sports', 'Business', 'Arts & Theatre', 'Food & Drink'];

// Ticket type prices now come directly from the event itself — the admin
// sets each price (General / Premium / VIP) individually when adding or
// editing an event, instead of them being auto-calculated.
export const ticketTypesFor = (event) => ([
  { type: 'General', price: Number(event.price) },
  { type: 'Premium', price: Number(event.pricePremium ?? Math.round(event.price * 1.6)) },
  { type: 'VIP', price: Number(event.priceVip ?? Math.round(event.price * 2.2)) },
]);

export const currency = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

