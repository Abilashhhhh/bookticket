-- =============================================================
-- BookTix — Sample data (optional, for testing/demo)
-- =============================================================


-- One ready-made admin account: email = admin@booktix.com / password = admin123
-- (the password_hash below is a real, working werkzeug hash for "admin123" —
-- tested and confirmed to work with the /api/auth/login endpoint)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@booktix.com', 'scrypt:32768:8:1$QtkxIIiaidwuhTwm$fd31cc8359e0a3a6b7ca2b2d76dc90845a89df1d9aba87ae5f19734f3af987fd245e42a3232d109ebd183a6b074648d6d7a76494e6f32febe3221e385d1bbeef', 'Admin');
-- Unlike the demo frontend (where any email containing "admin" was treated
-- as an admin), the REAL backend decides admin access from the `role`
-- column in the database — much safer. To make any OTHER account an admin,
-- register normally through /api/auth/register, then run:
--   UPDATE users SET role = 'Admin' WHERE email = 'youremail@example.com';

INSERT INTO organizers (name, email, phone, status) VALUES
('Echo Live Entertainment', 'contact@echolive.example', '+91 98765 10001', 'Active'),
('DevSphere Community', 'hello@devsphere.example', '+91 98765 10002', 'Active'),
('TN Premier League', 'ops@tnpl.example', '+91 98765 10003', 'Active');

INSERT INTO events (name, category, event_date, event_time, venue, city, organizer_id, price, total_tickets, tickets_sold, status, image_url, description) VALUES
('Music Fest 2026', 'Music', '2026-08-25', '18:00:00', 'YMCA Grounds, Chennai', 'Chennai', 1, 500.00, 500, 340, 'Active', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3', 'A night of live performances from top independent artists.'),
('Tech Conference 2026', 'Technology', '2026-08-30', '09:30:00', 'Nova Convention Centre, Trichy', 'Trichy', 2, 300.00, 300, 110, 'Active', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', 'A full-day conference on cloud, AI and startup engineering.'),
('Cricket Match: Titans vs Warriors', 'Sports', '2026-09-05', '14:00:00', 'MA Chidambaram Stadium, Chennai', 'Chennai', 3, 800.00, 1000, 860, 'Active', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da', 'A high-stakes league fixture between two top franchises.');
