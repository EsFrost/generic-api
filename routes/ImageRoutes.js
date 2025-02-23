const express = require("express");
const imageRouter = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authMiddleware } = require("../middleware/authMiddleware");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
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

// Upload new image
imageRouter.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({
        message: "File uploaded successfully",
        url: imageUrl,
      });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error uploading file", details: err.message });
    }
  }
);

// Get list of all images
imageRouter.get("/list", authMiddleware, (req, res) => {
  const uploadDir = path.join(__dirname, "../public/uploads");

  try {
    if (!fs.existsSync(uploadDir)) {
      return res.status(200).json({ files: [] });
    }

    const files = fs
      .readdirSync(uploadDir)
      .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map((file) => ({
        name: file,
        url: `/uploads/${file}`,
        date: fs.statSync(path.join(uploadDir, file)).mtime,
      }))
      .sort((a, b) => b.date - a.date);

    res.status(200).json({ files });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error reading files", details: err.message });
  }
});

// Delete image
imageRouter.delete("/:filename", authMiddleware, (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "../public/uploads", filename);

  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.status(200).json({ message: "File deleted successfully" });
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error deleting file", details: err.message });
  }
});

module.exports = imageRouter;
