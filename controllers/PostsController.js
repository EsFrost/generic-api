const { v4: uuidv4 } = require("uuid");
const postsModel = require("../models/PostsModel");
const sanitizeHtml = require("sanitize-html");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

async function showAllPosts(req, res) {
  try {
    const result = await postsModel.getAllPosts();
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
  }
}

async function showPost(req, res) {
  try {
    let id = req.params.id;
    id = sanitizeHtml(id);

    if (validator.isUUID(id)) {
      const result = await postsModel.getPostById(id);
      res.status(200).send(result);
    } else {
      res.status(400).json({ error: "Invalid post id!" });
    }
  } catch (err) {
    console.log(err);
  }
}

async function newPost(req, res) {
  let { title, content } = req.body;
  const id = uuidv4();

  title = sanitizeHtml(title);
  content = sanitizeHtml(content);

  if (validator.isUUID(id)) {
    try {
      await postsModel.createPost(id, title, content);
      res.status(200).json({ message: "Post created successfully!" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
  } else {
    res.status(400).json({ error: "Invalid data!" });
  }
}

async function editPost(req, res) {
  let { title, content } = req.body;
  const id = req.params.id;

  title = sanitizeHtml(title);
  content = sanitizeHtml(content);

  if (validator.isUUID(id)) {
    try {
      await postsModel.editPost(title, content, id);
      res.status(200).json({ message: "Post edited successfully!" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
  } else {
    res.status(400).json({ error: "Invalid data!" });
  }
}

async function deletePost(req, res) {
  const id = req.params.id;

  if (validator.isUUID(id)) {
    try {
      await postsModel.deletePost(id);
      res.status(200).json({ message: "Post deleted successfully!" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
  } else {
    res.status(400).json({ error: "Invalid data!" });
  }
}

module.exports = {
  showAllPosts,
  showPost,
  newPost,
  editPost,
  deletePost,
};
