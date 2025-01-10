const { v4: uuidv4 } = require("uuid");
const postsModel = require("../models/PostsModel");
const sanitizeHtml = require("sanitize-html");
const validator = require("validator");

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

module.exports = {
  showAllPosts,
  showPost,
};
