const usersModel = require("../models/UsersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const sanitizeHtml = require("sanitize-html");
const validator = require("validator");

// Token generation
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    secret,
    { expiresIn: "30d" }
  );
}

async function loginUser(req, res) {
  let { email, password } = req.body;
  email = sanitizeHtml(email);
  password = sanitizeHtml(password);

  if (validator.isEmail(email) && validator.isAlphanumeric(password)) {
    try {
      const user = await usersModel.getUserByEmail(email);
      if (user.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user[0].password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user);

      // secure: process.env.NODE_ENV === "production"
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "lax", // Added security measure
        domain: "localhost",
        path: "/",
      });

      res.status(200).json({
        message: "Login successful",
        token: token,
      });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(400).json({ error: "Invalid data!" });
  }
}

async function showAllUsers(req, res) {
  try {
    const result = await usersModel.getAllUsers();
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  loginUser,
  showAllUsers,
};
