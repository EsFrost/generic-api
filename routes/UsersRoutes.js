const express = require("express");
const usersRouter = express.Router();
const usersController = require("../controllers/UsersController");
const { authMiddleware } = require("../middleware/authMiddleware");

/* Public routes */
usersRouter.post("/login", usersController.loginUser);

/* Protected routes */
usersRouter.post("/logout", authMiddleware, usersController.logoutUser);

module.exports = usersRouter;
