const pool = require("../utils/db");

async function getAllPosts() {
  const [rows] = await pool.query(`SELECT * FROM posts`);
  return rows;
}

module.exports = {
  getAllPosts,
};
