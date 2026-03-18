/*
*/
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    pdf_path VARCHAR(500) NOT NULL,
    pdf_filename VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);