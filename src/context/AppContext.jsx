import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// AppContext — now talks to your real Flask + MySQL backend instead of
// browser storage. Every page still uses this same useApp() hook, so no
// page-level code needed to change except where noted in the pages
// themselves (Booking, Payment, MyTickets, ManageEvents, ManageBookings).
//
// If your backend runs somewhere other than http://localhost:5000, change
// API_BASE below to match.
// ---------------------------------------------------------------------------

const API_BASE = 'http://localhost:5000/api';

const AppContext = createContext(null);

async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export function AppProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]); // admin-only: ALL bookings
  const [users, setUsers] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('booktix_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('booktix_token') || null);

  // ---- load public events on first render, and whenever they might have changed ----
  const refreshEvents = useCallback(async () => {
    const data = await apiRequest('/events');
    setEvents(data);
  }, []);

  useEffect(() => {
    refreshEvents().catch((err) => console.error('Failed to load events:', err.message));
  }, [refreshEvents]);

  // ---- admin-only data: only fetched once an Admin is logged in ----
  const refreshAdminData = useCallback(async () => {
    if (!token || currentUser?.role !== 'Admin') return;
    try {
      const [allBookings, allUsers, allOrganizers] = await Promise.all([
        apiRequest('/bookings', { token }),
        apiRequest('/users', { token }),
        apiRequest('/organizers', { token }),
      ]);
      setBookings(allBookings);
      setUsers(allUsers);
      setOrganizers(allOrganizers);
    } catch (err) {
      console.error('Failed to load admin data:', err.message);
    }
  }, [token, currentUser]);

  useEffect(() => {
    refreshAdminData();
  }, [refreshAdminData]);

  // ---- auth ----
  const login = async ({ email, password }) => {
    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } });
      localStorage.setItem('booktix_token', data.token);
      localStorage.setItem('booktix_user', JSON.stringify(data.user));
      setToken(data.token);
      setCurrentUser(data.user);
      return { ok: true, user: data.user };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const register = async ({ name, email, password, phone }) => {
    try {
      const data = await apiRequest('/auth/register', { method: 'POST', body: { name, email, password, phone } });
      localStorage.setItem('booktix_token', data.token);
      localStorage.setItem('booktix_user', JSON.stringify(data.user));
      setToken(data.token);
      setCurrentUser(data.user);
      return { ok: true, user: data.user };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('booktix_token');
    localStorage.removeItem('booktix_user');
    setToken(null);
    setCurrentUser(null);
    setBookings([]);
    setUsers([]);
    setOrganizers([]);
  };

  // ---- events (admin CRUD) ----
  const addEvent = async (eventData) => {
    const created = await apiRequest('/events', { method: 'POST', body: eventData, token });
    await refreshEvents();
    return created.id;
  };

  const updateEvent = async (id, eventData) => {
    await apiRequest(`/events/${id}`, { method: 'PUT', body: eventData, token });
    await refreshEvents();
  };

  const deleteEvent = async (id) => {
    await apiRequest(`/events/${id}`, { method: 'DELETE', token });
    await refreshEvents();
  };

  // ---- bookings ----
  const addBooking = async (bookingData) => {
    const booking = await apiRequest('/bookings', { method: 'POST', body: bookingData });
    return booking; // includes booking.rawId (numeric) used for the payment URL
  };

  const getBookingById = async (rawId) => {
    return apiRequest(`/bookings/${rawId}`);
  };

  const confirmBookingPayment = async (rawId, outcome = 'Paid') => {
    const updated = await apiRequest(`/bookings/${rawId}/pay`, { method: 'PUT', body: { status: outcome } });
    await refreshEvents();      // ticketsSold changed
    await refreshAdminData();   // keep admin bookings list in sync
    return updated;
  };

  const myBookings = async (email) => {
    return apiRequest(`/bookings?email=${encodeURIComponent(email)}`);
  };

  const value = {
    events, addEvent, updateEvent, deleteEvent,
    bookings, addBooking, confirmBookingPayment, myBookings, getBookingById,
    users, organizers,
    currentUser, login, register, logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
