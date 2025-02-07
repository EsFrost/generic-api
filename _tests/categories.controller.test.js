const request = require("supertest");
const app = require("../index");
const { getPool, setupTestDb, clearTestData } = require("./test-helper");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

describe("CategoriesController", () => {
  let testUser;
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
  });

  afterAll(async () => {
    await clearTestData();
  });

  describe("GET /categories", () => {
    it("should return all categories", async () => {
      const response = await request(app).get("/categories");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      expect(
        response.body.find((category) => category.id === testCategory.id)
      ).toBeTruthy();
    });
  });

  describe("GET /categories/:id", () => {
    it("should return a specific category", async () => {
      const response = await request(app).get(`/categories/${testCategory.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", testCategory.id);
      expect(response.body).toHaveProperty("name", testCategory.name);
    });

    it("should return 404 for non-existent category", async () => {
      const nonExistentId = uuidv4();
      const response = await request(app).get(`/categories/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Category not found");
    });

    it("should return 400 for invalid UUID", async () => {
      const response = await request(app).get("/categories/invalid-uuid");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Invalid category id!");
    });
  });

  describe("POST /categories", () => {
    it("should create a new category when authenticated", async () => {
      const newCategory = {
        name: "New Test Category",
      };

      const response = await request(app)
        .post("/categories")
        .set("Cookie", [`token=${authToken}`])
        .send(newCategory);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Category created successfully!"
      );

      // Clean up
      const [categories] = await pool.query(
        "SELECT * FROM categories WHERE name = ?",
        [newCategory.name]
      );
      await pool.query("DELETE FROM categories WHERE id = ?", [
        categories[0].id,
      ]);
    });

    it("should fail to create category without authentication", async () => {
      const newCategory = {
        name: "New Test Category",
      };

      const response = await request(app).post("/categories").send(newCategory);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "No token provided");
    });

    it("should fail to create duplicate category", async () => {
      const duplicateCategory = {
        name: testCategory.name,
      };

      const response = await request(app)
        .post("/categories")
        .set("Cookie", [`token=${authToken}`])
        .send(duplicateCategory);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Category already exists");
    });
  });

  describe("PUT /categories/:id", () => {
    it("should update a category when authenticated", async () => {
      const updatedData = {
        name: "Updated Test Category",
      };

      const response = await request(app)
        .put(`/categories/${testCategory.id}`)
        .set("Cookie", [`token=${authToken}`])
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Category updated successfully!"
      );

      // Verify update
      const [categories] = await pool.query(
        "SELECT * FROM categories WHERE id = ?",
        [testCategory.id]
      );
      expect(categories[0].name).toBe(updatedData.name);

      // Reset the category name for other tests
      await pool.query("UPDATE categories SET name = ? WHERE id = ?", [
        testCategory.name,
        testCategory.id,
      ]);
    });

    it("should fail to update category without authentication", async () => {
      const updatedData = {
        name: "Updated Test Category",
      };

      const response = await request(app)
        .put(`/categories/${testCategory.id}`)
        .send(updatedData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "No token provided");
    });
  });

  describe("DELETE /categories/:id", () => {
    it("should delete a category when authenticated", async () => {
      // Create a temporary category to delete
      const tempCategory = {
        id: uuidv4(),
        name: "Temp Test Category",
      };

      await pool.query("INSERT INTO categories (id, name) VALUES (?, ?)", [
        tempCategory.id,
        tempCategory.name,
      ]);

      const response = await request(app)
        .delete(`/categories/${tempCategory.id}`)
        .set("Cookie", [`token=${authToken}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Category deleted successfully!"
      );

      // Verify deletion
      const [categories] = await pool.query(
        "SELECT * FROM categories WHERE id = ?",
        [tempCategory.id]
      );
      expect(categories.length).toBe(0);
    });

    it("should fail to delete category without authentication", async () => {
      const response = await request(app).delete(
        `/categories/${testCategory.id}`
      );

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "No token provided");
    });

    it("should return 404 when trying to delete non-existent category", async () => {
      const nonExistentId = uuidv4();
      const response = await request(app)
        .delete(`/categories/${nonExistentId}`)
        .set("Cookie", [`token=${authToken}`]);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Category not found");
    });
  });
});
