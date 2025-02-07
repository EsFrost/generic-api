const express = require("express");
const postsRouter = express.Router();
const postsController = require("../controllers/PostsController");
const { authMiddleware } = require("../middleware/authMiddleware");

/* Public routes */
postsRouter.get("/", postsController.showAllPosts);
postsRouter.get("/:id", postsController.showPost);
postsRouter.get("/:postId/categories", postsController.getPostCategories);

/* Protected routes */
postsRouter.post("/", authMiddleware, postsController.newPost);
postsRouter.put("/:id", authMiddleware, postsController.editPost);
postsRouter.delete("/:id", authMiddleware, postsController.deletePost);
postsRouter.post(
  "/:postId/categories/:categoryId",
  authMiddleware,
  postsController.addCategoryToPost
);
postsRouter.delete(
  "/:postId/categories/:categoryId",
  authMiddleware,
  postsController.removeCategoryFromPost
);

module.exports = postsRouter;
