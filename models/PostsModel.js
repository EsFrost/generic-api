const pool = require("../utils/db");

async function getAllPosts() {
  const [rows] = await pool.query(`SELECT * FROM posts`);
  return rows;
}

async function getPostById(id) {
  const [rows] = await pool.query(`SELECT * FROM posts WHERE id = ?`, [id]);
  return rows[0];
}

module.exports = {
  getAllPosts,
  getPostById,
};
