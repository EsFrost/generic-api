const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const postsRouter = require("./routes/PostsRoutes");
const usersRouter = require("./routes/UsersRoutes");
const categoriesRouter = require("./routes/CategoriesRoutes");
const imageRouter = require("./routes/ImageRoutes");
const path = require("path");
require("dotenv").config();

app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "data:", "blob:"],
        imgSrc: ["'self'", "data:", "blob:", "http://localhost:3000"],
      },
    },
  })
);
// app.use(
//   cors({
//     origin: [
//       "http://localhost:4200",
//       /^http:\/\/192\.168\.1\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]+)?$/,
//     ],
//     credentials: true, // Allows cookies with CORS
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Accept"],
//     exposedHeaders: ["Content-Disposition"], // Expose headers for downloads
//   })
// );
app.use(
  cors({
    origin: ["http://localhost:4200"], // Ensure frontend is allowed
    credentials: true, // Allow cookies/sessions
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"], // Allow frontend to access headers
  })
);

app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

const limiter = rateLimit({
  windowsMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to x requests per `window` (here, per 15 minutes) // originally 100 which is reasonable
});

app.use(limiter);

app.use("/posts", postsRouter);
app.use("/images", imageRouter);
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "image/*"); // Ensures browser recognizes images
    next();
  },
  express.static(path.join(__dirname, "public/uploads"))
);

app.use("/users", usersRouter);
app.use("/categories", categoriesRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

module.exports = app;
