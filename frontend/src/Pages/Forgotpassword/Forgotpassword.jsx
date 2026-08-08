import React, { useState, useRef } from "react";
import "./Forgotpassword.css";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import BackgroundAnimation from "../Welcome/components/BackgroundAnimation/BackgroundAnimation";
import devlogo from "../../assets/devlogo.svg";

// ---------------- Validation Rules ----------------

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function validateField(name, value) {
  const trimmed = typeof value === "string" ? value.trim() : value;

  switch (name) {
    case "email":
      if (!trimmed) return "Email is required";
      if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email";
      return "";

    default:
      return "";
  }
}

function validateAll(formData) {
  const fields = ["email"];
  const errors = {};

  fields.forEach((field) => {
    const error = validateField(field, formData[field]);
    if (error) errors[field] = error;
  });

  return errors;
}

export default function ForgotPassword() {
  const navigate = useNavigate();

  // ---------------- Theme ----------------

  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode(!darkMode);

  // ---------------- Form ----------------

  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const fieldRefs = useRef({});

  // ---------------- Loading ----------------

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ---------------- Input Change ----------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    const nextFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(nextFormData);

    setErrors((prev) => {
      const next = { ...prev };

      if (touched[name]) {
        next[name] = validateField(name, value);
      }

      return next;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // ---------------- Forgot Password Submit ----------------

  const handleSendResetLink = async (e) => {
    e.preventDefault();

    const newErrors = validateAll(formData);

    setErrors(newErrors);
    setTouched({
      email: true,
    });

    const errorFields = Object.keys(newErrors);

    if (errorFields.length > 0) {
      showToast("Please fix all errors", "error");

      const firstField = errorFields[0];
      fieldRefs.current[firstField]?.focus();

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, "success");

        setFormData({
          email: "",
        });

        setErrors({});
        setTouched({
          email: false,
        });
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Server is not responding. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "reset-page dark" : "reset-page light"}>
      <BackgroundAnimation />

      {/* Signature orbit mark */}
      <div className="reset-orbit-mark" aria-hidden="true">
        <div className="reset-orbit-core"></div>
        <div className="reset-orbit-ring reset-orbit-ring--outer" />
        <div className="reset-orbit-ring reset-orbit-ring--inner" />
        <div className="reset-orbit-tick reset-orbit-tick--top" />
        <div className="reset-orbit-tick reset-orbit-tick--right" />
        <div className="reset-orbit-tick reset-orbit-tick--bottom" />
        <div className="reset-orbit-tick reset-orbit-tick--left" />
      </div>

      {/* Theme Toggle */}
      <div className="reset-theme-toggle">
        <IconButton onClick={toggleTheme}>
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>
      </div>

      <Box className="reset-container">
        {/* Left Side */}

        <Box className="reset-left">
          <img src={devlogo} alt="DevOrbit" className="reset-logo" />

          <div className="reset-eyebrow">
            <span className="reset-eyebrow-dot" />
            The New Standard for Creators
          </div>

          <Typography className="reset-title">
            Find Your Way <span className="reset-title-accent">Back.</span>
          </Typography>
          <Typography className="reset-subtitle">
            Enter your email to recover your account and get back to building,
            sharing, and exploring the DevOrbit community.
          </Typography>
        </Box>

        {/* Right Side */}

        <Box
          component="form"
          className="reset-card"
          onSubmit={handleSendResetLink}
          noValidate
        >
          <div className="reset-card-accent" />

          <Typography className="reset-card-title">Forgot Password</Typography>

          <Typography className="reset-card-subtitle">
            Enter your email address to receive a password reset link.
          </Typography>

          {/* Email */}

          <TextField
            fullWidth
            margin="normal"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            inputRef={(el) => (fieldRefs.current.email = el)}
            error={!!errors.email}
            helperText={errors.email}
          />

          {/* Send Reset Link Button */}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            className="reset-btn"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          {/* Back to Login */}

          <Typography className="reset-footer-text">
            Remember your password?
            <span onClick={() => navigate("/Login")}>Back to Login</span>
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          className="reset-alert"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
