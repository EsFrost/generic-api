const { v4: uuidv4 } = require("uuid");
const postModel = require("../models/PostsModel");
const sanitizeHtml = require("sanitize-html");
const validator = require("validator");

async function showAllPosts(req, res) {
  try {
    const result = await postModel.getAllPosts();
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  showAllPosts,
};
