const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    console.log("AUTHORIZATION HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided",
      });
    }

    // ==========================================
    // CHECK BEARER FORMAT
    // ==========================================

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authorization Format",
      });
    }

    // ==========================================
    // EXTRACT TOKEN
    // ==========================================

    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No Token Provided",
      });
    }

    // ==========================================
    // TOKEN RECEIVED
    // ==========================================

    console.log("=================================");
    console.log("AUTH MIDDLEWARE");
    console.log("TOKEN RECEIVED");
    console.log("=================================");

    // ==========================================
    // CHECK JWT SECRET
    // ==========================================

    if (!process.env.JWT_SECRET) {  
      console.error("JWT_SECRET is missing in .env");

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error",
      });
    }

    // ==========================================
    // VERIFY JWT
    // ==========================================

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED USER:", decoded);

    // ==========================================
    // ATTACH USER TO REQUEST
    // ==========================================

    req.user = decoded;

    // ==========================================
    // CONTINUE TO CONTROLLER
    // ==========================================

    next();
  } catch (error) {
    console.error("=================================");
    console.error("JWT ERROR:", error.message);
    console.error("=================================");

    // ==========================================
    // TOKEN EXPIRED
    // ==========================================

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again",
      });
    }

    // ==========================================
    // INVALID TOKEN
    // ==========================================

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    // ==========================================
    // OTHER AUTHENTICATION ERROR
    // ==========================================

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

module.exports = authMiddleware;
