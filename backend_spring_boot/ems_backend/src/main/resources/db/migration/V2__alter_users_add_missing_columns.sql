-- Rename existing `terms` column to match entity field
ALTER TABLE users RENAME COLUMN terms TO terms_accepted;

-- Add missing enum column (store as STRING)
ALTER TABLE users ADD COLUMN user_role VARCHAR(50);

-- Add locked and enabled fields
ALTER TABLE users ADD COLUMN locked BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN enabled BOOLEAN DEFAULT TRUE;
