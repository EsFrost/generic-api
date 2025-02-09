const pool = require("../utils/db");

async function getAllCategories() {
  const [rows] = await pool.query(`SELECT * FROM categories`);
  return rows;
}

async function getCategoryById(id) {
  const [rows] = await pool.query(`SELECT * FROM categories WHERE id = ?`, [
    id,
  ]);
  return rows[0];
}

async function getCategoryByName(name) {
  const [rows] = await pool.query(`SELECT * FROM categories WHERE name = ?`, [
    name,
  ]);
  return rows[0];
}

async function createCategory(id, name) {
  const [rows] = await pool.query(
    `INSERT INTO categories (id, name) VALUES (?, ?)`,
    [id, name]
  );
}

async function editCategory(name, id) {
  const [rows] = await pool.query(
    `UPDATE categories SET name = ? WHERE id = ?`,
    [name, id]
  );
}

async function deleteCategory(id) {
  const [rows] = await pool.query(`DELETE FROM categories WHERE id = ?`, [id]);
}

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  createCategory,
  editCategory,
  deleteCategory,
};
