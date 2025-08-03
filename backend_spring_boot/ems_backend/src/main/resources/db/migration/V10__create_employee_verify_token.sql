CREATE SEQUENCE IF NOT EXISTS employee_token_sequence START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS employee_invitation_tokens (
    id BIGINT PRIMARY KEY DEFAULT nextval('employee_token_sequence'),
    token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL,
    expired_at TIMESTAMP NOT NULL,
    employee_id BIGINT NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMP,

    CONSTRAINT fk_employee_invitation FOREIGN KEY (employee_id)
    REFERENCES employees(id) ON DELETE CASCADE
    );
