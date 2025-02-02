const express = require("express");
const categoriesRouter = express.Router();
const categoriesController = require("../controllers/CategoriesController");
const { authMiddleware } = require("../middleware/authMiddleware");

/* Public routes */
categoriesRouter.get("/", categoriesController.showAllCategories);

/* Protected routes */

module.exports = categoriesRouter;
