const { setupTestDb } = require("./_tests/test-helper");

process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";
process.env.DB_HOST = "localhost";
process.env.DB_USER = "root"; // Update with your MySQL username
process.env.DB_PASSWORD = ""; // Update with your MySQL password
process.env.DB_NAME = "generic_blog_test";

module.exports = async () => {
  await setupTestDb();
};
