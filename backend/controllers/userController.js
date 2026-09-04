const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
// Import User Model
const User = require("../models/User");
// Import Jwt token
const jwt = require("jsonwebtoken");
// Register User Controller

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Mail Error:", error);
  } else {
    console.log("Mail Server Ready");
  }
});

const registerUser = async (req, res) => {
  try {
    // Get data from Postman/React
    const { fullname, username, email, password } = req.body;
    // Check required fields
    if (!fullname || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // Full Name Validation
    if (fullname.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 3 characters",
      });
    }
    // Username Validation
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 3 and 20 characters",
      });
    }
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        success: false,
        message:
          "Username can only contain letters, numbers, underscore (_), hyphen (-), and dot (.)",
      });
    }
    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Password Validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create User
    const user = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    // User data without password
    const userData = {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
    };

    // Success Response
    res.status(201).json({
      success: true,
      message: "Account created successfully! Welcome to DevOrbit ",
      user: userData,
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      success: false,
      message: "Registration Failed",
      error: error.message,
    });
  }
};
// Login User Controller
const loginUser = async (req, res) => {
  try {
    // Get email and password
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    // Check password
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // User data without password
    const userData = {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
    };

    // Login Success
    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login Failed",
      error: error.message,
    });
  }
};

// Get Profile Controller
const getProfile = async (req, res) => {
  try {
    // Get logged-in user's ID from JWT
    const userId = req.user.id;
    // Find the actual user in MongoDB
    const user = await User.findById(userId).select("-password");
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("USER FROM MONGODB:", user);
    res.status(200).json({
      success: true,
      message: "Profile Fetched Successfully",
      user: user,
    });
  } catch (error) {
    console.error("❌ Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to Fetch Profile",
      error: error.message,
    });
  }
};

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("Headers:", req.headers);
    // Check if body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const { email } = req.body;

    // Check email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // For now (before adding email service)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "DevOrbit Password Reset",
      html: `
    <h2>DevOrbit Password Reset</h2>

    <p>Hello ${user.fullname},</p>

    <p>You requested to reset your password.</p>

    <a href="${resetLink}">
      Click here to reset password
    </a>

    <p>If you did not request this, ignore this email.</p>
  `,
    });
    return res.status(200).json({
      success: true,
      message: "Reset link sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Forgot Password Failed",
      error: error.message,
    });
  }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, {
      password: hashedPassword,
    });
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Reset Password Failed",
      error: error.message,
    });
  }
};

// Export Controllers
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
};
