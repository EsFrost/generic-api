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

module.exports = {
  showAllCategories,
};
