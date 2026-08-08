import React, { useState, useRef } from "react";
import "../Register/Register.css";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  InputLabel,
  OutlinedInput,
  FormControl,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google,
  DarkMode,
  LightMode,
  ArrowForward,
} from "@mui/icons-material";
import BackgroundAnimation from "../Welcome/components/BackgroundAnimation/BackgroundAnimation";
import devlogo from "../../assets/devlogo.svg";

// ---------------- Validation Rules ----------------

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const NAME_REGEX = /^[a-zA-Z\s'-]{2,}$/;

function getPasswordStrength(value) {
  if (!value) return { score: 0, label: "" };

  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
  return { score, label: labels[score] };
}

function validateField(name, value, formData = {}) {
  const trimmed = typeof value === "string" ? value.trim() : value;

  switch (name) {
    case "fullname":
      if (!trimmed) {
        return "Full name is required.";
      }

      if (trimmed.length < 3) {
        return "Full name must be at least 3 characters.";
      }

      if (trimmed.length > 50) {
        return "Full name cannot exceed 50 characters.";
      }

      if (!/^[A-Za-z\s'-]+$/.test(trimmed)) {
        return "Only letters, spaces, apostrophes and hyphens are allowed.";
      }

      return "";

    case "username":
      if (!trimmed) {
        return "Username is required.";
      }

      if (trimmed.length < 3) {
        return "Username must be between 3 and 20 characters.";
      }

      if (trimmed.length > 20) {
        return "Username must be between 3 and 20 characters.";
      }

      if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
        return "Only letters, numbers and underscores are allowed.";
      }

      return "";

    case "email":
      if (!trimmed) {
        return "Email address is required.";
      }

      if (trimmed.length > 254) {
        return "Email address is too long.";
      }

      if (!EMAIL_REGEX.test(trimmed)) {
        return "Please enter a valid email address (e.g. john@example.com).";
      }

      return "";

    case "password":
      if (!value) {
        return "Password is required.";
      }

      if (value.length < 8) {
        return "Password must be at least 8 characters.";
      }

      if (!/[A-Z]/.test(value)) {
        return "Password must contain at least one uppercase letter.";
      }

      if (!/[a-z]/.test(value)) {
        return "Password must contain at least one lowercase letter.";
      }

      if (!/[0-9]/.test(value)) {
        return "Password must contain at least one number.";
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return "Password must contain at least one special character.";
      }

      return "";

    case "confirmPassword":
      if (!value) {
        return "Please confirm your password.";
      }

      if (value !== formData.password) {
        return "Passwords do not match.";
      }

      return "";

    case "agree":
      if (!value) {
        return "Please accept the Terms of Service and Privacy Policy.";
      }

      return "";

    default:
      return "";
  }
}

function validateAll(formData) {
  const fields = [
    "fullname",
    "username",
    "email",
    "password",
    "confirmPassword",
    "agree",
  ];
  const errors = {};

  fields.forEach((field) => {
    const error = validateField(field, formData[field], formData);
    if (error) errors[field] = error;
  });

  return errors;
}

export default function Register() {
  const navigate = useNavigate();

  // ---------------- Theme ----------------

  const [darkMode] = useState(true);

  // ---------------- Form ----------------

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    fullname: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    agree: false,
  });
  const fieldRefs = useRef({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const strength = getPasswordStrength(formData.password);

  // ---------------- Handlers ----------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    setErrors((prev) => {
      const next = { ...prev };
      if (touched[name]) {
        next[name] = validateField(name, value, nextFormData);
      }
      // Re-check confirm password whenever password changes
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

  const handleAgreeChange = (e) => {
    const checked = e.target.checked;
    const nextFormData = { ...formData, agree: checked };
    setFormData(nextFormData);
    setTouched((prev) => ({ ...prev, agree: true }));
    setErrors((prev) => ({
      ...prev,
      agree: validateField("agree", checked, nextFormData),
    }));
  };

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = validateAll(formData);

    setErrors(newErrors);

    setTouched({
      fullname: true,
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      agree: true,
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
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        showToast(data.message || "Account created successfully!", "success");

        setFormData({
          fullname: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          agree: false,
        });

        setErrors({});
        setTouched({
          fullname: false,
          username: false,
          email: false,
          password: false,
          confirmPassword: false,
          agree: false,
        });

        setShowPassword(false);
        setShowConfirmPassword(false);

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showToast(data.message || "Registration failed", "error");
      }
    } catch (error) {
      console.error("Register Error:", error);
      showToast("Server is not responding. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }; // <-- IMPORTANT: handleRegister ends here

  return (
    <div className={darkMode ? "login-page dark" : "login-page light"}>
      <BackgroundAnimation />

      {/* Ambient mesh-gradient orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <span className="bg-orb bg-orb--1" />
        <span className="bg-orb bg-orb--2" />
        <span className="bg-orb bg-orb--3" />
      </div>
      <div className="bg-noise" aria-hidden="true" />

      <div className="orbit-mark" aria-hidden="true">
        <div className="orbit-core">
          <span></span>
        </div>
        <div className="orbit-ring orbit-ring--outer" />
        <div className="orbit-ring orbit-ring--inner" />
        <div className="orbit-tick orbit-tick--top" />
        <div className="orbit-tick orbit-tick--right" />
        <div className="orbit-tick orbit-tick--bottom" />
        <div className="orbit-tick orbit-tick--left" />
      </div>
      {/* 
        <div className="theme-toggle">
          <IconButton onClick={toggleTheme}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </div> */}

      <Box className="login-container">
        {/* Left Side */}

        <Box className="login-left">
          <img src={devlogo} alt="DevOrbit" className="left-logo" />

          <div className="left-eyebrow">
            <span className="eyebrow-dot" />
            The New Standard for Creators
          </div>

          <Typography className="left-title">
            Join the <span className="title-accent">orbit today.</span>
          </Typography>

          <Typography className="left-subtitle">
            Create your account in seconds and start building, sharing, and
            growing with a community that ships.
          </Typography>
        </Box>

        {/* Right Side */}

        <Box
          component="form"
          className="login-card"
          onSubmit={handleRegister}
          noValidate
        >
          <div className="login-card-accent" />

          <Typography className="card-title">Create Account</Typography>

          <Typography className="card-subtitle">
            Let's get you set up. It only takes a minute.
          </Typography>

          {/* Full Name */}

          <TextField
            fullWidth
            margin="normal"
            name="fullname"
            type="text"
            label="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            onBlur={handleBlur}
            inputRef={(el) => (fieldRefs.current.fullname = el)}
            error={!!errors.fullname}
            helperText={errors.fullname}
          />

          <TextField
            fullWidth
            margin="normal"
            name="username"
            type="text"
            label="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            inputRef={(el) => (fieldRefs.current.username = el)}
            error={touched.username && !!errors.username}
            helperText={touched.username ? errors.username : ""}
          />

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

          {/* Password */}

          <FormControl fullWidth margin="normal" error={!!errors.password}>
            <InputLabel>Password</InputLabel>

            <OutlinedInput
              label="Password"
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

            {formData.password && (
              <div className="password-strength">
                <div className="password-strength-track">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={`password-strength-bar ${
                        i < strength.score ? `filled s${strength.score}` : ""
                      }`}
                    />
                  ))}
                </div>
                <span className="password-strength-label">
                  {strength.label}
                </span>
              </div>
            )}

            <Typography
              color="error"
              variant="caption"
              sx={{ ml: 1.8, mt: 0.5 }}
            >
              {errors.password}
            </Typography>
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

            <Typography
              color="error"
              variant="caption"
              sx={{ ml: 1.8, mt: 0.5 }}
            >
              {errors.confirmPassword}
            </Typography>
          </FormControl>

          {/* Terms */}

          <Box className="terms-options">
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agree}
                  onChange={handleAgreeChange}
                  size="small"
                />
              }
              label={
                <>
                  I agree to the{" "}
                  <span className="inline-link">Terms of Service</span> and{" "}
                  <span className="inline-link">Privacy Policy</span>
                </>
              }
            />
          </Box>

          {errors.agree && (
            <Typography
              color="error"
              variant="caption"
              sx={{ ml: 5, mt: 0.5, display: "block" }}
            >
              {errors.agree}
            </Typography>
          )}

          {/* Register Button */}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            className="login-btn"
            disabled={loading}
            endIcon={!loading && <ArrowForward />}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          {/* Divider */}

          <div className="or-divider">
            <span className="or-line" />
            <span className="or-text">OR</span>
            <span className="or-line" />
          </div>

          {/* Google */}

          {/* <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            className="google-btn"
            onClick={handleGoogle}
          >
            Continue with Google
          </Button> */}

          {/* Sign In */}

          <Typography className="register-text">
            Already have an account?
            <span onClick={() => navigate("/login")}>Sign in</span>
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
          className="app-alert"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
