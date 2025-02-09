const { v4: uuidv4 } = require("uuid");
const categoriesModel = require("../models/CategoriesModel");
const sanitizeHtml = require("sanitize-html");
const validator = require("validator");
require("dotenv").config();

async function showAllCategories(req, res) {
  try {
    const result = await categoriesModel.getAllCategories();
    res.status(200).send(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

async function showCategory(req, res) {
  try {
    let id = req.params.id;
    id = sanitizeHtml(id);

    if (validator.isUUID(id)) {
      const result = await categoriesModel.getCategoryById(id);
      if (!result) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).send(result);
    } else {
      res.status(400).json({ error: "Invalid category id!" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

async function newCategory(req, res) {
  let { name } = req.body;
  const id = uuidv4();

  name = sanitizeHtml(name);

  if (!name || name.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid data! Category name is required" });
  }

  try {
    // Check if category already exists
    const existingCategory = await categoriesModel.getCategoryByName(name);
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    await categoriesModel.createCategory(id, name);
    res.status(200).json({ message: "Category created successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

async function editCategory(req, res) {
  let { name } = req.body;
  let id = req.params.id;

  name = sanitizeHtml(name);
  id = sanitizeHtml(id);

  if (!validator.isUUID(id)) {
    return res.status(400).json({ error: "Invalid category id!" });
  }

  if (!name || name.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid data! Category name is required" });
  }

  try {
    // Check if category exists
    const existingCategory = await categoriesModel.getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check if new name conflicts with another category
    const categoryWithName = await categoriesModel.getCategoryByName(name);
    if (categoryWithName && categoryWithName.id !== id) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    await categoriesModel.editCategory(name, id);
    res.status(200).json({ message: "Category updated successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

async function deleteCategory(req, res) {
  let id = req.params.id;
  id = sanitizeHtml(id);

  if (!validator.isUUID(id)) {
    return res.status(400).json({ error: "Invalid category id!" });
  }

  try {
    // Check if category exists
    const existingCategory = await categoriesModel.getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    await categoriesModel.deleteCategory(id);
    res.status(200).json({ message: "Category deleted successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = {
  showAllCategories,
  showCategory,
  newCategory,
  editCategory,
  deleteCategory,
};
