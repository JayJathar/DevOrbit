const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// 1. Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. Import routes BEFORE registering them
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const musicRoutes = require("./routes/musicRoutes");
const storyRoutes = require("./routes/storyRoutes");

// 4. Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevOrbit Backend is running",
  });
});

// 5. Register API routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/stories", storyRoutes);

// 6. Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 7. Handle server errors
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = app;
