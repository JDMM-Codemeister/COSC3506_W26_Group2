CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    pdf_path VARCHAR(250),
    pdf_filename VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);