-- Create users table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Length of 255 to accommodate bcrypt hash
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Create posts table
DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL
);

-- Create categories table
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create posts_categories intersection table
DROP TABLE IF EXISTS posts_categories;
CREATE TABLE posts_categories (
    id VARCHAR(36) PRIMARY KEY,
    p_id VARCHAR(36) NOT NULL,
    c_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (p_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (c_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Add indexes for better query performance
CREATE INDEX idx_posts_title ON posts(title);
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_pc_pid ON posts_categories(p_id);
CREATE INDEX idx_pc_cid ON posts_categories(c_id);