-- Initialize ScribeArena Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create the main database (already created by POSTGRES_DB env var)
-- Just ensure proper permissions are set

-- Grant necessary permissions to the user
GRANT ALL PRIVILEGES ON DATABASE scribearena TO scribearena_user;

-- Connect to the scribearena database
\c scribearena;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO scribearena_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO scribearena_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO scribearena_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO scribearena_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO scribearena_user;

-- Create a simple health check table
CREATE TABLE IF NOT EXISTS health_check (
    id SERIAL PRIMARY KEY,
    status TEXT DEFAULT 'healthy',
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO health_check (status) VALUES ('database_initialized');