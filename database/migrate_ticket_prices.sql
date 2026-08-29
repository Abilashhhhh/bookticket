-- =============================================================
-- BookTix — Migration: add custom Premium / VIP ticket prices
-- =============================================================
-- Run this AFTER schema.sql if you already created your database.
-- It adds two new columns to the existing `events` table so admins
-- can set their own Premium and VIP prices (instead of them being
-- auto-calculated from the General price).
--
-- HOW TO RUN: open the MySQL Command Line Client and run:
--   SOURCE C:/path/to/booktix-backend/database/migrate_ticket_prices.sql;
-- =============================================================

USE booktix_db;

ALTER TABLE events
    ADD COLUMN IF NOT EXISTS price_premium DECIMAL(10,2) DEFAULT NULL AFTER price,
    ADD COLUMN IF NOT EXISTS price_vip DECIMAL(10,2) DEFAULT NULL AFTER price_premium;

-- Fill in sensible starting values for any existing events so the
-- Premium/VIP prices aren't blank until you edit them:
UPDATE events
SET price_premium = ROUND(price * 1.6, 2)
WHERE price_premium IS NULL;

UPDATE events
SET price_vip = ROUND(price * 2.2, 2)
WHERE price_vip IS NULL;

SELECT id, name, price AS general, price_premium, price_vip FROM events;
