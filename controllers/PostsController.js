const { v4: uuidv4 } = require("uuid");
const postsModel = require("../models/PostsModel");
const sanitizeHtml = require("sanitize-html");
const validator = require("validator");
require("dotenv").config();

// Configure sanitize-html options for TinyMCE content
const sanitizeOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "p",
    "a",
    "ul",
    "ol",
    "nl",
    "li",
    "b",
    "i",
    "strong",
    "em",
    "strike",
    "code",
    "hr",
    "br",
    "div",
    "table",
    "thead",
    "caption",
    "tbody",
    "tr",
    "th",
    "td",
    "pre",
    "span",
    "img",
    "sub",
    "sup",
  ],
  allowedAttributes: {
    a: ["href", "name", "target"],
    img: ["src", "alt", "height", "width"],
    "*": ["style", "class"], // Allow style and class attributes on all elements
  },
  allowedStyles: {
    "*": {
      // Allow color and text-related properties
      color: [
        /^#(0x)?[0-9a-f]+$/i,
        /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
      ],
      "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
      "font-size": [/^\d+(?:px|em|%)$/],
      "text-decoration": [/^underline$/, /^line-through$/],
      "font-weight": [/^bold$/, /^normal$/],
      "font-style": [/^italic$/],
      "background-color": [
        /^#(0x)?[0-9a-f]+$/i,
        /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
      ],
    },
  },
  allowedSchemes: ["http", "https", "ftp", "mailto"],
  allowProtocolRelative: true,
};

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

  // Sanitize title normally (no HTML needed)
  title = sanitizeHtml(title);
  // Sanitize content with TinyMCE-friendly options
  content = sanitizeHtml(content, sanitizeOptions);

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

  // Sanitize title normally (no HTML needed)
  title = sanitizeHtml(title);
  // Sanitize content with TinyMCE-friendly options
  content = sanitizeHtml(content, sanitizeOptions);

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

async function getPostCategories(req, res) {
  let postId = req.params.id;
  postId = sanitizeHtml(postId);

  if (validator.isUUID(postId)) {
    try {
      const categories = await postsModel.getPostCategories(postId);
      res.status(200).send(categories);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
  } else {
    res.status(400).json({ error: "Invalid post id!" });
  }
}

async function addCategoryToPost(req, res) {
  let { postId, categoryId } = req.body;
  const id = uuidv4();

  postId = sanitizeHtml(postId);
  categoryId = sanitizeHtml(categoryId);

  if (validator.isUUID(postId) && validator.isUUID(categoryId)) {
    try {
      await postsModel.addCategoryToPost(postId, categoryId);
      res.status(200).json({ message: "Category added to post!" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
  } else {
    res.status(400).json({ error: "Invalid data!" });
  }
}

async function removeCategoryFromPost(req, res) {
  let { postId, categoryId } = req.body;

  postId = sanitizeHtml(postId);
  categoryId = sanitizeHtml(categoryId);

  if (validator.isUUID(postId) && validator.isUUID(categoryId)) {
    try {
      await postsModel.removeCategoryFromPost(postId, categoryId);
      res.status(200).json({ message: "Category removed from post!" });
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
  getPostCategories,
  addCategoryToPost,
  removeCategoryFromPost,
};
