CREATE SEQUENCE IF NOT EXISTS onboarding_sequence START WITH 1 INCREMENT BY 1;

CREATE TABLE onboarding_data (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_title VARCHAR(100),
    department VARCHAR(100),
    role_type VARCHAR(50) CHECK (role_type IN ('HR', 'employee')),
    team_size VARCHAR(50),
    total_hires INTEGER NOT NULL,
    salary_range VARCHAR(100),
    experience TEXT,
    goals TEXT[], -- PostgreSQL array
    notifications BOOLEAN NOT NULL DEFAULT FALSE,
    onboarding BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
