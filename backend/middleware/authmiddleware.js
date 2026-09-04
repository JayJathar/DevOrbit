const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    // No Authorization header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided",
      });
    }
    // Authorization must be:
    // Bearer TOKEN
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authorization Format",
      });
    }
    // Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No Token Provided",
      });
    }
    console.log("TOKEN RECEIVED BY MIDDLEWARE:", token);
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    console.log("DECODED USER:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};
module.exports = authMiddleware;