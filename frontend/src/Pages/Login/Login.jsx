import React, { useState, useRef } from "react";
import "../Login/Login.css";
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
  ArrowForward,
} from "@mui/icons-material";
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

    case "password":
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      return "";

    default:
      return "";
  }
}

function validateAll(formData) {
  const fields = ["email", "password"];
  const errors = {};

  fields.forEach((field) => {
    const error = validateField(field, formData[field]);
    if (error) errors[field] = error;
  });

  return errors;
}

export default function Login() {
  const navigate = useNavigate();

  // ---------------- Form ----------------

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const fieldRefs = useRef({});

  const [rememberMe, setRememberMe] = useState(false);

  // ---------------- Password Visibility ----------------

  const [showPassword, setShowPassword] = useState(false);

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
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // ---------------- Login ----------------

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = validateAll(formData);
    setErrors(newErrors);
    setTouched({ email: true, password: true });

    const errorFields = Object.keys(newErrors);

    if (errorFields.length > 0) {
      showToast("Please fix all errors", "error");
      fieldRefs.current[errorFields[0]]?.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, "success");

        // Save token
        localStorage.setItem("token", data.token);

        // Save user
        localStorage.setItem("user", JSON.stringify(data.user));

        // Clear form
        setFormData({
          email: "",
          password: "",
        });

        setErrors({});
        setTouched({});

        setTimeout(() => {
          navigate("/Home");
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

  // ---------------- Google ----------------

  const handleGoogle = () => {
    alert("Google Sign In");
  };

  return (
    <div className="login-page dark">
      <BackgroundAnimation />

      {/* Signature orbit mark */}
      <div className="orbit-mark" aria-hidden="true">
        <div className="orbit-core"></div>
        <div className="orbit-ring orbit-ring--outer" />
        <div className="orbit-ring orbit-ring--inner" />
        <div className="orbit-tick orbit-tick--top" />
        <div className="orbit-tick orbit-tick--right" />
        <div className="orbit-tick orbit-tick--bottom" />
        <div className="orbit-tick orbit-tick--left" />
      </div>

      {/* Theme Toggle */}

      <Box className="login-container">
        {/* Left Side */}

        <Box className="login-left">
          <img src={devlogo} alt="DevOrbit" className="left-logo" />

          <div className="left-eyebrow">
            <span className="eyebrow-dot" />
            The New Standard for Creators
          </div>

          <Typography className="left-title">
            Welcome <span className="title-accent">Back.</span>
          </Typography>
          <Typography className="left-subtitle">
            Sign in to your account and continue building, sharing, and growing
            with a community that ships.
          </Typography>
        </Box>

        {/* Right Side */}

        <Box
          component="form"
          className="login-card"
          onSubmit={handleLogin}
          noValidate
        >
          <div className="login-card-accent" />

          <Typography className="card-title">Welcome Back</Typography>

          <Typography className="card-subtitle">
            Sign in to your account and continue building, sharing, and growing
            with a community that ships.
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

            <Typography
              color="error"
              variant="caption"
              sx={{ ml: 1.8, mt: 0.5 }}
            >
              {errors.password}
            </Typography>
          </FormControl>

          {/* Remember Me / Forgot Password */}

          <Box className="login-options">
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  size="small"
                />
              }
              label="Remember me"
            />

            <Typography
              className="forgot-text"
              onClick={() => navigate("/Forgotpassword")}
            >
              Forgot password?
            </Typography>
          </Box>

          {/* Login Button */}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            className="login-btn"
            disabled={loading}
            endIcon={!loading && <ArrowForward />}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {/* Divider */}

          <div className="or-divider">
            <span className="or-line" />
            <span className="or-text">OR</span>
            <span className="or-line" />
          </div>

          {/* Google */}

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            className="google-btn"
            onClick={handleGoogle}
          >
            Continue with Google
          </Button>

          {/* Register */}

          <Typography className="register-text">
            Don't have an account?
            <span onClick={() => navigate("/register")}>Create one</span>
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
