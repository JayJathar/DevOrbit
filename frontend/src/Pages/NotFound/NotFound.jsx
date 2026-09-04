import React, { useState } from "react";
import "./NotFound.css";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { ArrowForward, Home } from "@mui/icons-material";
import BackgroundAnimation from "../Welcome/components/BackgroundAnimation/BackgroundAnimation";
import devlogo from "../../assets/devlogo.svg";

export default function NotFound() {
  const navigate = useNavigate();
  const [darkMode] = useState(true);
  return (
    <div className={darkMode ? "login-page dark notfound-page" : "login-page light notfound-page"}>
      <BackgroundAnimation />

      {/* Background Blur */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-glow glow-3"></div>

      {/* Starfield */}
      <div className="star-field" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
            }}
          />
        ))}
      </div>

      <Box className="notfound-container">
        <img src={devlogo} alt="DevOrbit" className="left-logo notfound-logo" />
        
        <div className="astronaut-orbit" aria-hidden="true">
          <div className="astronaut-orbit-ring astronaut-orbit-ring--outer" />
          <div className="astronaut-orbit-ring astronaut-orbit-ring--mid" />
          <div className="astronaut-orbit-ring astronaut-orbit-ring--inner" />
          <div className="orbit-satellite orbit-satellite--a" />
          <div className="orbit-satellite orbit-satellite--b" />
          <div className="astronaut-float">
            <svg
              viewBox="0 0 200 220"
              className="astronaut-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* tether line */}
              <path
                d="M100 40 C 60 70, 40 110, 55 150"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 6"
              />

              {/* backpack */}
              <rect x="78" y="95" width="44" height="55" rx="14" fill="#d9d9d9" />
              <rect x="86" y="103" width="10" height="14" rx="3" fill="#8a8a8a" />
              <rect x="104" y="103" width="10" height="14" rx="3" fill="#8a8a8a" />

              {/* body suit */}
              <ellipse cx="100" cy="120" rx="38" ry="46" fill="#f4f4f4" />
              <ellipse cx="100" cy="150" rx="30" ry="20" fill="#e2e2e2" />

              {/* chest panel */}
              <rect x="84" y="108" width="32" height="20" rx="5" fill="#bfbfbf" />
              <circle cx="91" cy="118" r="3" fill="#ff5252" />
              <circle cx="100" cy="118" r="3" fill="#ffd54f" />
              <circle cx="109" cy="118" r="3" fill="#69f0ae" />

              {/* left arm bent up (waving) */}
              <path
                d="M66 108 C 42 100, 30 78, 38 58"
                stroke="#f4f4f4"
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="38" cy="58" r="13" fill="#e2e2e2" />

              {/* right arm resting */}
              <path
                d="M134 112 C 152 122, 158 142, 148 160"
                stroke="#f4f4f4"
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="148" cy="160" r="13" fill="#e2e2e2" />

              {/* legs */}
              <path
                d="M86 168 C 80 190, 78 205, 82 216"
                stroke="#f4f4f4"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M114 168 C 122 190, 126 205, 120 216"
                stroke="#f4f4f4"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <ellipse cx="81" cy="217" rx="12" ry="7" fill="#cfcfcf" />
              <ellipse cx="121" cy="217" rx="12" ry="7" fill="#cfcfcf" />

              {/* helmet */}
              <circle cx="100" cy="62" r="40" fill="#f8f8f8" />
              <circle cx="100" cy="62" r="40" fill="url(#visorRing)" fillOpacity="0.4" />
              <circle cx="102" cy="64" r="30" fill="#0b0b12" />
              <ellipse cx="90" cy="52" rx="9" ry="6" fill="rgba(255,255,255,0.55)" />

              {/* reflection in visor: tiny orbit ring + planet */}
              <circle cx="104" cy="66" r="7" fill="#8fd3ff" opacity="0.85" />
              <ellipse
                cx="104"
                cy="66"
                rx="13"
                ry="4"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.4"
              />

              <defs>
                <radialGradient id="visorRing" cx="50%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>

        <Typography className="notfound-code">404</Typography>

        <Typography className="notfound-title">
          Off Course. <span className="title-accent">Way Off.</span>
        </Typography>

        <Typography className="notfound-subtitle">
          Looks like this page drifted out of orbit. It may have been moved,
          renamed, or never existed on DevOrbit's map to begin with.
        </Typography>

        <div className="notfound-actions">
          <Button
            variant="contained"
            className="login-btn notfound-btn"
            startIcon={<Home />}
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>

          <Button
            variant="text"
            className="notfound-link-btn"
            endIcon={<ArrowForward />}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </div>
      </Box>
    </div>
  );
}