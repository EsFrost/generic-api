const express = require("express");
const postsRouter = express.Router();
const postsController = require("../controllers/PostsController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

/* Public routes */
postsRouter.get("/", postsController.showAllPosts);

module.exports = postsRouter;
