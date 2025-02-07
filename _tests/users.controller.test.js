const request = require("supertest");
const app = require("../index");
const { getPool, setupTestDb, clearTestData } = require("./test-helper");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

describe("UsersController", () => {
  let testUser;

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
  });

  afterAll(async () => {
    await clearTestData();
  });

  describe("POST /users/login", () => {
    it("should login successfully with valid credentials", async () => {
      const response = await request(app).post("/users/login").send({
        email: testUser.email,
        password: "testpass123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("token");
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should fail with invalid password", async () => {
      const response = await request(app).post("/users/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });

    it("should fail with non-existent email", async () => {
      const response = await request(app).post("/users/login").send({
        email: "nonexistent@example.com",
        password: "testpass123",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });

    it("should fail with invalid email format", async () => {
      const response = await request(app).post("/users/login").send({
        email: "invalid-email",
        password: "testpass123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Invalid data!");
    });

    it("should detect XSS attempts", async () => {
      const response = await request(app).post("/users/login").send({
        email: 'test@example.com<script>alert("xss")</script>',
        password: 'password<script>alert("xss")</script>',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Invalid data!");
    });
  });

  describe("POST /users/logout", () => {
    let authToken;

    beforeEach(async () => {
      const loginResponse = await request(app).post("/users/login").send({
        email: testUser.email,
        password: "testpass123",
      });
      authToken = loginResponse.body.token;
    });

    it("should logout successfully with valid token", async () => {
      const response = await request(app)
        .post("/users/logout")
        .set("Cookie", [`token=${authToken}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Logout successful");
      expect(response.headers["set-cookie"][0]).toContain("token=;");
    });

    it("should fail to logout without token", async () => {
      const response = await request(app).post("/users/logout");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "No token provided");
    });

    it("should fail to logout with invalid token", async () => {
      const response = await request(app)
        .post("/users/logout")
        .set("Cookie", ["token=invalid-token"]);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid token");
    });
  });
});
