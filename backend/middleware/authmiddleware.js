// Import jsonwebtoken
const jwt = require("jsonwebtoken");

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  try {
    // Get token from request headers
    const token = req.header("Authorization");

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided",
      });
    }

    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store decoded user information in request
    req.user = decoded;

    // Continue to the next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

// Export Middleware
module.exports = authMiddleware;
