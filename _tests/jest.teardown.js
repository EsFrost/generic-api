const { closePool } = require("./test-helper");

module.exports = async () => {
  try {
    await closePool();
  } catch (error) {
    console.error("Error in teardown:", error);
    throw error;
  }
};
