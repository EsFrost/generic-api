const request = require("supertest");
const app = require("../index");
const { getPool, setupTestDb, clearTestData } = require("./test-helper");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

describe("PostsController", () => {
  let testUser;
  let testPost;
  let testCategory;
  let authToken;

  beforeAll(async () => {
    pool = await getPool();
    await setupTestDb();

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

    // Create test category
    testCategory = {
      id: uuidv4(),
      name: "Test Category",
    };

    await pool.query("INSERT INTO categories (id, name) VALUES (?, ?)", [
      testCategory.id,
      testCategory.name,
    ]);

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

    // Link the test post and category
    await pool.query(
      "INSERT INTO posts_categories (id, p_id, c_id) VALUES (?, ?, ?)",
      [uuidv4(), testPost.id, testCategory.id]
    );
  });

  afterAll(async () => {
    await clearTestData();
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
    });

    it("should sanitize HTML content", async () => {
      const newPost = {
        title: "Test HTML Sanitization",
        content: '<p>Safe content</p><script>alert("unsafe")</script>',
      };

      const response = await request(app)
        .post("/posts")
        .set("Cookie", [`token=${authToken}`])
        .send(newPost);

      expect(response.status).toBe(200);
    });
  });

  describe("POST /posts/:postId/categories/:categoryId", () => {
    it("should add a category to a post when authenticated", async () => {
      const newCategory = {
        id: uuidv4(),
        name: `Test Category ${Date.now()}`,
      };

      await pool.query("INSERT INTO categories (id, name) VALUES (?, ?)", [
        newCategory.id,
        newCategory.name,
      ]);

      const response = await request(app)
        .post(`/posts/${testPost.id}/categories/${newCategory.id}`)
        .set("Cookie", [`token=${authToken}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Category added to post!"
      );

      // Clean up
      await pool.query("DELETE FROM posts_categories WHERE c_id = ?", [
        newCategory.id,
      ]);
      await pool.query("DELETE FROM categories WHERE id = ?", [newCategory.id]);
    });

    it("should fail to add duplicate category to post", async () => {
      const response = await request(app)
        .post(`/posts/${testPost.id}/categories/${testCategory.id}`)
        .set("Cookie", [`token=${authToken}`]);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Category already added to this post"
      );
    });

    it("should fail with invalid category id", async () => {
      const response = await request(app)
        .post(`/posts/${testPost.id}/categories/invalid-id`)
        .set("Cookie", [`token=${authToken}`]);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Invalid id format!");
    });

    it("should fail with non-existent category", async () => {
      const nonExistentId = uuidv4();
      const response = await request(app)
        .post(`/posts/${testPost.id}/categories/${nonExistentId}`)
        .set("Cookie", [`token=${authToken}`]);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Category not found");
    });
  });
});
