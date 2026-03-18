/*
For adding reminders to database -
DATE format: '2026-12-25'
TIME format: '14:30:00'

*/

CREATE TABLE reminders(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(250),
    due_date DATE,
    due_time TIME,
    created_at TIMESTAMP DEFAULT NOW()
);


