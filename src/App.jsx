import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import SiteLayout from './components/SiteLayout';
import AdminLayout from './components/AdminLayout';
import RequireAdmin from './components/RequireAdmin';

import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import MyTickets from './pages/MyTickets';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';
import ManageOrganizers from './pages/admin/ManageOrganizers';
import Reports from './pages/admin/Reports';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / attendee-facing site */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/book/:id" element={<Booking />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Admin console */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="organizers" element={<ManageOrganizers />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
