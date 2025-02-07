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
      { id: "123", username: "test", email: "test@example.com" },
      process.env.JWT_SECRET
    );
    mockReq.cookies.token = token;

    authMiddleware(mockReq, mockRes, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user.id).toBe("123");
    expect(mockReq.user.username).toBe("test");
    expect(mockReq.user.email).toBe("test@example.com");
  });

  it("should return 401 when no token is provided", () => {
    authMiddleware(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "No token provided" });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return 401 when invalid token is provided", () => {
    mockReq.cookies.token = "invalid-token";

    authMiddleware(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid token" });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
