const express = require("express");
const categoriesRouter = express.Router();
const categoriesController = require("../controllers/CategoriesController");
const { authMiddleware } = require("../middleware/authMiddleware");

/* Public routes */
categoriesRouter.get("/", categoriesController.showAllCategories);
categoriesRouter.get("/:id", categoriesController.showCategory);

/* Protected routes */
categoriesRouter.post("/", authMiddleware, categoriesController.newCategory);
categoriesRouter.put("/:id", authMiddleware, categoriesController.editCategory);
categoriesRouter.delete(
  "/:id",
  authMiddleware,
  categoriesController.deleteCategory
);

module.exports = categoriesRouter;
