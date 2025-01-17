const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/authMiddleware");

describe("AuthMiddleware", () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      cookies: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should call next() when valid token is provided", () => {
    const token = jwt.sign(
      { id: "123", username: "test" },
      process.env.JWT_SECRET
    );
    mockReq.cookies.token = token;

    authMiddleware(mockReq, mockRes, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user.id).toBe("123");
    expect(mockReq.user.username).toBe("test");
  });
});
