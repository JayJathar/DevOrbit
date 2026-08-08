import React, { useState, useRef } from "react";
import "./Resetpassword.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";

import { DarkMode, LightMode } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import BackgroundAnimation from "../Welcome/components/BackgroundAnimation/BackgroundAnimation";
import devlogo from "../../assets/devlogo.svg";

// ---------------- Validation Rules ----------------

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function validateField(name, value, formData) {
  const trimmed = typeof value === "string" ? value.trim() : value;

  switch (name) {
    case "password":
      if (!trimmed) return "Password is required";
      if (!PASSWORD_REGEX.test(trimmed))
        return "Min 8 characters, with letters & numbers";
      return "";

    case "confirmPassword":
      if (!trimmed) return "Please confirm your password";
      if (trimmed !== formData.password) return "Passwords do not match";
      return "";

    default:
      return "";
  }
}

function validateAll(formData) {
  const fields = ["password", "confirmPassword"];
  const errors = {};

  fields.forEach((field) => {
    const error = validateField(field, formData[field], formData);
    if (error) errors[field] = error;
  });

  return errors;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  // ---------------- Theme ----------------

  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode(!darkMode);

  // ---------------- Form ----------------

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const fieldRefs = useRef({});

  // ---------------- Password Visibility ----------------

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    setErrors((prev) => {
      const next = { ...prev };

      if (touched[name]) {
        next[name] = validateField(name, value, nextFormData);
      }

      if (name === "password" && touched.confirmPassword) {
        next.confirmPassword = validateField(
          "confirmPassword",
          nextFormData.confirmPassword,
          nextFormData,
        );
      }

      return next;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, formData),
    }));
  };

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // ---------------- Reset Password ----------------

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const newErrors = validateAll(formData);
    setErrors(newErrors);
    setTouched({ password: true, confirmPassword: true });

    const errorFields = Object.keys(newErrors);

    if (errorFields.length > 0) {
      showToast("Please fix all errors", "error");
      fieldRefs.current[errorFields[0]]?.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, "success");

        setFormData({ password: "", confirmPassword: "" });
        setErrors({});
        setTouched({});

        setTimeout(() => {
          navigate("/login");
        }, 1500);
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
            Set a New <span className="reset-title-accent">Password.</span>
          </Typography>
          <Typography className="reset-subtitle">
            Choose a strong new password to secure your account and continue
            building, sharing, and growing with a community that ships.
          </Typography>
        </Box>

        {/* Right Side */}

        <Box
          component="form"
          className="reset-card"
          onSubmit={handleResetPassword}
          noValidate
        >
          <div className="reset-card-accent" />

          <Typography className="reset-card-title">Reset Password</Typography>

          <Typography className="reset-card-subtitle">
            Enter a new password below to reset your account access.
          </Typography>

          {/* New Password */}

          <FormControl fullWidth margin="normal" error={!!errors.password}>
            <InputLabel>New Password</InputLabel>

            <OutlinedInput
              label="New Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              inputRef={(el) => (fieldRefs.current.password = el)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <FormHelperText>{errors.password}</FormHelperText>
          </FormControl>

          {/* Confirm Password */}
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
          >
            <InputLabel>Confirm Password</InputLabel>

            <OutlinedInput
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              inputRef={(el) => (fieldRefs.current.confirmPassword = el)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <FormHelperText>{errors.confirmPassword}</FormHelperText>
          </FormControl>

          {/* Reset Button */}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            className="reset-btn"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

          {/* Back to Login */}

          <Typography className="reset-footer-text">
            Remember your password?
            <span onClick={() => navigate("/login")}>Back to Login</span>
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
