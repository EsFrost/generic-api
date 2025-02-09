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
    `INSERT INTO posts (id, title, content) VALUES (?, ?, ?)`,
    [id, title, content]
  );
}

async function editPost(title, content, image_url, id) {
  const [rows] = await pool.query(
    `UPDATE posts SET title = ?, content = ?, image_url = ? WHERE id = ?`,
    [title, content, image_url, id]
  );
}

async function deletePost(id) {
  const [rows] = await pool.query(`DELETE FROM posts WHERE id = ?`, [id]);
}

async function getPostCategories(postId) {
  const [rows] = await pool.query(
    `SELECT c.* FROM categories c 
     INNER JOIN posts_categories pc ON c.id = pc.c_id 
     WHERE pc.p_id = ?`,
    [postId]
  );
  return rows;
}

async function checkCategoryExists(postId, categoryId) {
  const [rows] = await pool.query(
    "SELECT * FROM posts_categories WHERE p_id = ? AND c_id = ?",
    [postId, categoryId]
  );
  return rows.length > 0;
}

async function addCategoryToPost(id, postId, categoryId) {
  const exists = await checkCategoryExists(postId, categoryId);
  if (exists) {
    throw new Error("DUPLICATE_CATEGORY");
  }

  const [rows] = await pool.query(
    `INSERT INTO posts_categories (id, p_id, c_id) VALUES (?, ?, ?)`,
    [id, postId, categoryId]
  );
  return rows;
}

async function removeCategoryFromPost(postId, categoryId) {
  const [rows] = await pool.query(
    `DELETE FROM posts_categories WHERE p_id = ? AND c_id = ?`,
    [postId, categoryId]
  );
  return rows;
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  editPost,
  deletePost,
  getPostCategories,
  checkCategoryExists,
  addCategoryToPost,
  removeCategoryFromPost,
};
