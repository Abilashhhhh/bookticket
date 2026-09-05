-- =============================================================
-- BookTix — MySQL Database Schema
-- =============================================================

CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone         VARCHAR(50) DEFAULT NULL,
    role          VARCHAR(20) NOT NULL DEFAULT 'Attendee',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS organizers (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    phone       VARCHAR(50) DEFAULT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'Active',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    category       VARCHAR(100) NOT NULL,
    event_date     VARCHAR(20) NOT NULL,
    event_time     VARCHAR(20) NOT NULL,
    venue          VARCHAR(255) NOT NULL,
    city           VARCHAR(100) NOT NULL,
    organizer_id   INT DEFAULT NULL,
    price          DECIMAL(10,2) NOT NULL,
    price_premium  DECIMAL(10,2) DEFAULT NULL,
    price_vip      DECIMAL(10,2) DEFAULT NULL,
    total_tickets  INT NOT NULL,
    tickets_sold   INT NOT NULL DEFAULT 0,
    status         VARCHAR(20) NOT NULL DEFAULT 'Active',
    image_url      TEXT DEFAULT NULL,
    description    TEXT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES organizers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    event_id        INT NOT NULL,
    user_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(50) NOT NULL,
    ticket_type     VARCHAR(50) NOT NULL DEFAULT 'General',
    quantity        INT NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'Pending',
    payment_status  VARCHAR(20) NOT NULL DEFAULT 'Pending',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_city ON events(city);