import React from "react";
import "./Hero.css";
import devlogo from "../../../../assets/devlogo.svg";
import Button from "@mui/material/Button";
import BackgroundAnimation from "../BackgroundAnimation/BackgroundAnimation";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="welcome">
      <BackgroundAnimation />

      <div className="logo">
        <img src={devlogo} alt="DevOrbit Logo" className="logo-img" />
      </div>

      <div className="welcome-content">
        <div className="welcome-tagline">The New Standard for Creators</div>

        <h1 className="welcome-title">
          The Social Orbit for Everyone Who Builds.
        </h1>

        <p className="welcome-description">
          Discover ideas, share projects, publish code, showcase your work, and
          connect with creators, designers, developers, and innovators in one
          collaborative community.
        </p>
      </div>

      <div className="welcome-buttons">
        <Button
          className="join-btn"
          sx={{ color: "#fff" }}
          onClick={() => navigate("/register")}
        >
          Create Your Space
        </Button>

        <Button className="explore-btn" onClick={() => navigate("/login")}>
          Enter Your Space
        </Button>
      </div>
    </div>
  );
};

export default Hero;
