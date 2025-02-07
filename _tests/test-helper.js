const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "generic_blog_test",
      waitForConnections: true,
      connectionLimit: 1, // Reduce to 1 for tests
      queueLimit: 0,
    });
  }
  return pool;
}

async function closePool() {
  if (pool) {
    const p = pool;
    pool = null; // Clear the pool reference first
    await p.end(); // Then end the pool
  }
}

async function setupTestDb() {
  const pool = await getPool();
  try {
    // Drop all tables first to ensure clean state
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");
    await pool.query("DROP TABLE IF EXISTS posts_categories");
    await pool.query("DROP TABLE IF EXISTS posts");
    await pool.query("DROP TABLE IF EXISTS categories");
    await pool.query("DROP TABLE IF EXISTS users");
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE
      )`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      )`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id CHAR(36) PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        content LONGTEXT NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts_categories (
        id CHAR(36) PRIMARY KEY,
        p_id VARCHAR(36) NOT NULL,
        c_id VARCHAR(36) NOT NULL,
        FOREIGN KEY (p_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (c_id) REFERENCES categories(id) ON DELETE CASCADE,
        UNIQUE(p_id, c_id)
      )`);
  } catch (error) {
    console.error("Error setting up test database:", error);
    throw error;
  }
}

async function clearTestData() {
  const pool = await getPool();
  try {
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");
    await pool.query("TRUNCATE TABLE posts_categories");
    await pool.query("TRUNCATE TABLE posts");
    await pool.query("TRUNCATE TABLE categories");
    await pool.query("TRUNCATE TABLE users");
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");
  } catch (error) {
    console.error("Error clearing test data:", error);
    throw error;
  }
}

module.exports = {
  getPool,
  setupTestDb,
  clearTestData,
  closePool,
};
