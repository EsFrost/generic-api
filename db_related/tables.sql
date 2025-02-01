DROP TABLE IF EXISTS posts_categories;

-- Create users table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Length of 255 to accommodate bcrypt hash
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Create posts table
DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content LONGTEXT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create categories table
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create posts_categories intersection table
CREATE TABLE posts_categories (
    id CHAR(36) PRIMARY KEY,
    p_id VARCHAR(36) NOT NULL,
    c_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (p_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (c_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(p_id, c_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_posts_title ON posts(title);
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_pc_pid ON posts_categories(p_id);
CREATE INDEX idx_pc_cid ON posts_categories(c_id);