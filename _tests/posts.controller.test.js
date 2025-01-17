const request = require("supertest");
const app = require("../index");
const pool = require("../utils/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

describe("PostsController", () => {
  let testUser;
  let testPost;
  let authToken;

  beforeAll(async () => {
    // Create test user
    const hashedPassword = await bcrypt.hash("testpass123", 12);
    testUser = {
      id: uuidv4(),
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
    };

    await pool.query(
      "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)",
      [testUser.id, testUser.username, testUser.email, testUser.password]
    );

    // Login to get token
    const loginResponse = await request(app).post("/users/login").send({
      email: testUser.email,
      password: "testpass123",
    });

    authToken = loginResponse.body.token;

    // Create test post
    testPost = {
      id: uuidv4(),
      title: "Test Post",
      content: "Test Content",
    };

    await pool.query(
      "INSERT INTO posts (id, title, content) VALUES (?, ?, ?)",
      [testPost.id, testPost.title, testPost.content]
    );
  });

  afterAll(async () => {
    // Clean up test data
    await pool.query("DELETE FROM posts WHERE id = ?", [testPost.id]);
    await pool.query("DELETE FROM users WHERE id = ?", [testUser.id]);
    await pool.end();
  });

  describe("GET /posts", () => {
    it("should return all posts", async () => {
      const response = await request(app).get("/posts");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      expect(
        response.body.find((post) => post.id === testPost.id)
      ).toBeTruthy();
    });
  });

  describe("GET /posts/:id", () => {
    it("should return a specific post", async () => {
      const response = await request(app).get(`/posts/${testPost.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", testPost.id);
      expect(response.body).toHaveProperty("title", testPost.title);
      expect(response.body).toHaveProperty("content", testPost.content);
    });

    it("should return 400 for invalid UUID", async () => {
      const response = await request(app).get("/posts/invalid-uuid");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Invalid post id!");
    });
  });

  describe("POST /posts", () => {
    it("should create a new post when authenticated", async () => {
      const newPost = {
        title: "New Test Post",
        content: "New Test Content",
      };

      const response = await request(app)
        .post("/posts")
        .set("Cookie", [`token=${authToken}`])
        .send(newPost);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Post created successfully!"
      );

      // Clean up
      const posts = await pool.query("SELECT * FROM posts WHERE title = ?", [
        newPost.title,
      ]);
      await pool.query("DELETE FROM posts WHERE id = ?", [posts[0][0].id]);
    });

    it("should fail to create post without authentication", async () => {
      const newPost = {
        title: "New Test Post",
        content: "New Test Content",
      };

      const response = await request(app).post("/posts").send(newPost);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "No token provided");
    });
  });

  describe("PUT /posts/:id", () => {
    it("should update a post when authenticated", async () => {
      const updatedData = {
        title: "Updated Test Post",
        content: "Updated Test Content",
      };

      const response = await request(app)
        .put(`/posts/${testPost.id}`)
        .set("Cookie", [`token=${authToken}`])
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Post edited successfully!"
      );

      // Verify update
      const [updatedPost] = await pool.query(
        "SELECT * FROM posts WHERE id = ?",
        [testPost.id]
      );
      expect(updatedPost[0].title).toBe(updatedData.title);
      expect(updatedPost[0].content).toBe(updatedData.content);
    });

    it("should fail to update post without authentication", async () => {
      const updatedData = {
        title: "Updated Test Post",
        content: "Updated Test Content",
      };

      const response = await request(app)
        .put(`/posts/${testPost.id}`)
        .send(updatedData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "No token provided");
    });
  });

  describe("DELETE /posts/:id", () => {
    let tempPost;

    beforeEach(async () => {
      tempPost = {
        id: uuidv4(),
        title: "Temp Test Post",
        content: "Temp Test Content",
      };

      await pool.query(
        "INSERT INTO posts (id, title, content) VALUES (?, ?, ?)",
        [tempPost.id, tempPost.title, tempPost.content]
      );
    });

    it("should delete a post when authenticated", async () => {
      const response = await request(app)
        .delete(`/posts/${tempPost.id}`)
        .set("Cookie", [`token=${authToken}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Post deleted successfully!"
      );

      // Verify deletion
      const [posts] = await pool.query("SELECT * FROM posts WHERE id = ?", [
        tempPost.id,
      ]);
      expect(posts.length).toBe(0);
    });

    it("should fail to delete post without authentication", async () => {
      const response = await request(app).delete(`/posts/${tempPost.id}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "No token provided");
    });
  });
});
