const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ======================================================
// MAIL TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Check Mail Server
transporter.verify((error, success) => {
  if (error) {
    console.log("Mail Error:", error);
  } else {
    console.log("Mail Server Ready");
  }
});

// ======================================================
// REGISTER USER CONTROLLER
// ======================================================

const registerUser = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body || {};
    if (!fullname || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (fullname.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 3 characters",
      });
    }

    // ======================================================
    // USERNAME VALIDATION
    // ======================================================

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

    // ======================================================
    // EMAIL VALIDATION
    // ======================================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // ======================================================
    // PASSWORD VALIDATION
    // ======================================================

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // ======================================================
    // CHECK EMAIL
    // ======================================================

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // ======================================================
    // CHECK USERNAME
    // ======================================================

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // ======================================================
    // HASH PASSWORD
    // ======================================================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ======================================================
    // CREATE USER
    // ======================================================

    const user = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    // ======================================================
    // USER DATA WITHOUT PASSWORD
    // ======================================================

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
    };

    // ======================================================
    // SUCCESS RESPONSE
    // ======================================================

    return res.status(201).json({
      success: true,
      message: "Account created successfully! Welcome to DevOrbit",
      user: userData,
    });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Registration Failed",
      error: error.message,
    });
  }
};

// ======================================================
// LOGIN USER CONTROLLER
// ======================================================

const loginUser = async (req, res) => {
  try {
    // ======================================================
    // DEBUG LOGIN REQUEST
    // ======================================================

    console.log("=================================");
    console.log("LOGIN REQUEST");
    console.log("REQ BODY:", req.body);
    console.log("CONTENT TYPE:", req.headers["content-type"]);
    console.log("=================================");
    const { email, password } = req.body || {};

    // ======================================================
    // CHECK LOGIN DATA
    // ======================================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ======================================================
    // FIND USER BY EMAIL
    // ======================================================

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================================================
    // COMPARE PASSWORD
    // ======================================================

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // ======================================================
    // GENERATE JWT TOKEN
    // ======================================================

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

    // ======================================================
    // USER DATA WITHOUT PASSWORD
    // ======================================================

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
    };

    // ======================================================
    // LOGIN SUCCESS
    // ======================================================

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login Failed",
      error: error.message,
    });
  }
};

// ======================================================
// GET PROFILE CONTROLLER
// ======================================================

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("USER FROM MONGODB:", user);

    return res.status(200).json({
      success: true,
      message: "Profile Fetched Successfully",
      user,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to Fetch Profile",
      error: error.message,
    });
  }
};

// ======================================================
// FORGOT PASSWORD CONTROLLER
// ======================================================

const forgotPassword = async (req, res) => {
  try {
    console.log("=================================");
    console.log("FORGOT PASSWORD REQUEST");
    console.log("BODY:", req.body);
    console.log("HEADERS:", req.headers);
    console.log("=================================");
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // ======================================================
    // FIND USER
    // ======================================================

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // ======================================================
    // CREATE RESET TOKEN
    // ======================================================

    const resetToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    // ======================================================
    // RESET LINK
    // ======================================================

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // ======================================================
    // SEND EMAIL
    // ======================================================

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

    // ======================================================
    // SUCCESS
    // ======================================================

    return res.status(200).json({
      success: true,
      message: "Reset link sent successfully",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Forgot Password Failed",
      error: error.message,
    });
  }
};

// ======================================================
// RESET PASSWORD CONTROLLER
// ======================================================

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body || {};
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, {
      password: hashedPassword,
    });

    // ======================================================
    // SUCCESS
    // ======================================================

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Reset Password Failed",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
};
