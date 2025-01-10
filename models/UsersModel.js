const pool = require("../utils/db");

async function getAllUsers() {
  const [rows] = await pool.query(`SELECT id, username,email FROM users`);
  return rows;
}

async function getUserByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);
  return rows;
}

module.exports = {
  getAllUsers,
  getUserByEmail,
};
