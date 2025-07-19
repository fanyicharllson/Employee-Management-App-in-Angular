CREATE SEQUENCE IF NOT EXISTS Confirmation_token_sequence START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS confirmation_token (
    id BIGINT PRIMARY KEY DEFAULT nextval('Confirmation_token_sequence'),
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    expired_at TIMESTAMP NOT NULL,
    user_id BIGINT NOT NULL,
    
    CONSTRAINT fk_user_token FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE
);
