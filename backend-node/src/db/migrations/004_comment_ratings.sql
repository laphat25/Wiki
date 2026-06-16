-- Migration 004: Add rating, name, and email fields to comments table
ALTER TABLE comments ADD COLUMN rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));
ALTER TABLE comments ADD COLUMN name TEXT;
ALTER TABLE comments ADD COLUMN email TEXT;
