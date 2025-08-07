ALTER TABLE employees ADD COLUMN user_id BIGINT;
ALTER TABLE employees ADD CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES users(id);