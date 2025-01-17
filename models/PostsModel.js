const pool = require("../utils/db");

async function getAllPosts() {
  const [rows] = await pool.query(`SELECT * FROM posts`);
  return rows;
}

async function getPostById(id) {
  const [rows] = await pool.query(`SELECT * FROM posts WHERE id = ?`, [id]);
  return rows[0];
}

async function createPost(id, title, content) {
  const [rows] = await pool.query(
    `INSERT INTO posts (title, content) VALUES (?, ?, ?)`,
    [id, title, content]
  );
}

async function editPost(title, content) {
  const [rows] = await pool.query(
    `UPDATE posts SET title = ?, content = ? WHERE id = ?`,
    [title, content]
  );
}

async function deletePost(id) {
  const [rows] = await pool.query(`DELETE FROM posts WHERE id = ?`, [id]);
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  editPost,
  deletePost,
};
