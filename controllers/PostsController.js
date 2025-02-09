const { v4: uuidv4 } = require("uuid");
const postsModel = require("../models/PostsModel");
const categoriesModel = require("../models/CategoriesModel");
const sanitizeHtml = require("sanitize-html");
const validator = require("validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
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
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

async function showPost(req, res) {
  try {
    let id = req.params.id;
    id = sanitizeHtml(id);

    if (validator.isUUID(id)) {
      const result = await postsModel.getPostById(id);
      if (!result) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.status(200).send(result);
    } else {
      res.status(400).json({ error: "Invalid post id!" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

async function newPost(req, res) {
  let { title, content } = req.body;
  const id = uuidv4();

  title = sanitizeHtml(title);
  content = sanitizeHtml(content, sanitizeOptions);

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required!" });
  }

  try {
    await postsModel.createPost(id, title, content);
    res.status(200).json({ message: "Post created successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

async function editPost(req, res) {
  let { title, content, image_url } = req.body;
  const id = req.params.id;

  title = sanitizeHtml(title);
  content = sanitizeHtml(content, sanitizeOptions);
  image_url = sanitizeHtml(image_url);

  if (!validator.isUUID(id)) {
    return res.status(400).json({ error: "Invalid post id!" });
  }

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required!" });
  }

  try {
    const post = await postsModel.getPostById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await postsModel.editPost(title, content, image_url, id);
    res.status(200).json({ message: "Post edited successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

async function deletePost(req, res) {
  const id = req.params.id;

  if (!validator.isUUID(id)) {
    return res.status(400).json({ error: "Invalid post id!" });
  }

  try {
    const post = await postsModel.getPostById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await postsModel.deletePost(id);
    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

async function getPostCategories(req, res) {
  const postId = req.params.postId;

  if (!validator.isUUID(postId)) {
    return res.status(400).json({ error: "Invalid post id!" });
  }

  try {
    const post = await postsModel.getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const categories = await postsModel.getPostCategories(postId);
    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

async function addCategoryToPost(req, res) {
  const { postId, categoryId } = req.params;

  if (!validator.isUUID(postId) || !validator.isUUID(categoryId)) {
    return res.status(400).json({ error: "Invalid id format!" });
  }

  try {
    const post = await postsModel.getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const category = await categoriesModel.getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await postsModel.addCategoryToPost(uuidv4(), postId, categoryId);
    res.status(200).json({ message: "Category added to post!" });
  } catch (err) {
    if (err.message === "DUPLICATE_CATEGORY") {
      return res
        .status(400)
        .json({ error: "Category already added to this post" });
    }
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

async function removeCategoryFromPost(req, res) {
  const { postId, categoryId } = req.params;

  if (!validator.isUUID(postId) || !validator.isUUID(categoryId)) {
    return res.status(400).json({ error: "Invalid id format!" });
  }

  try {
    const post = await postsModel.getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const category = await categoriesModel.getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await postsModel.removeCategoryFromPost(postId, categoryId);
    res.status(200).json({ message: "Category removed from post!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "public/uploads";
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Add this new function to handle file uploads
async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Return the file path that can be stored in the database
    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({
      message: "File uploaded successfully",
      path: filePath,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error uploading file",
      details: err.message,
    });
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
  uploadImage,
  uploadMiddleware: upload.single("image"),
};
