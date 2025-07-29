-- Migration to add status column to users table
-- This addresses the missing status column issue in user management

ALTER TABLE users ADD COLUMN status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif' AFTER role;

-- Update existing users to have 'Aktif' status
UPDATE users SET status = 'Aktif' WHERE status IS NULL;