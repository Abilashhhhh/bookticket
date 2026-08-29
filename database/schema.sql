-- =============================================================
-- BookTix — SQLite3 Database Schema
-- =============================================================

-- ---------------------------------------------------------------
-- USERS  (attendees + admins)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone         TEXT DEFAULT NULL,
    role          TEXT NOT NULL DEFAULT 'Attendee' CHECK(role IN ('Attendee', 'Admin')),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------
-- ORGANIZERS  (companies/people who run events)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organizers (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    phone       TEXT DEFAULT NULL,
    status      TEXT NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Pending', 'Suspended')),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------
-- EVENTS
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT NOT NULL,
    category       TEXT NOT NULL,
    event_date     TEXT NOT NULL,
    event_time     TEXT NOT NULL,
    venue          TEXT NOT NULL,
    city           TEXT NOT NULL,
    organizer_id   INTEGER DEFAULT NULL,
    price          REAL NOT NULL,
    price_premium  REAL DEFAULT NULL,
    price_vip      REAL DEFAULT NULL,
    total_tickets  INTEGER NOT NULL,
    tickets_sold   INTEGER NOT NULL DEFAULT 0,
    status         TEXT NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Cancelled', 'Completed')),
    image_url      TEXT DEFAULT NULL,
    description    TEXT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES organizers(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------
-- BOOKINGS
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id        INTEGER NOT NULL,
    user_name       TEXT NOT NULL,
    email           TEXT NOT NULL,
    phone           TEXT NOT NULL,
    ticket_type     TEXT NOT NULL DEFAULT 'General',
    quantity        INTEGER NOT NULL,
    amount          REAL NOT NULL,
    status          TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'Confirmed', 'Cancelled')),
    payment_status  TEXT NOT NULL DEFAULT 'Pending' CHECK(payment_status IN ('Pending', 'Paid', 'Failed')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Helpful indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);

