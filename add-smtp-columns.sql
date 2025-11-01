-- Add missing SMTP columns to admins table
ALTER TABLE admins ADD COLUMN smtp_email VARCHAR(255);
ALTER TABLE admins ADD COLUMN smtp_password VARCHAR(255);
