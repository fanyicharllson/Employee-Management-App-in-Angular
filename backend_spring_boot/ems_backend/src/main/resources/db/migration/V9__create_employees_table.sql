CREATE SEQUENCE IF NOT EXISTS employee_sequence START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS employees (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    occupation VARCHAR(100),
    role VARCHAR(100),
    department VARCHAR(100),
    company_name VARCHAR(255) NOT NULL,
    added_by_user_id BIGSERIAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_added_by FOREIGN KEY (added_by_user_id)
    REFERENCES users(id) ON DELETE CASCADE
    );
