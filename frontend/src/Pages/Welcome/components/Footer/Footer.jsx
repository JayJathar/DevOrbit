import React from "react";
import "./Footer.css";
import devlogo from "../../../../assets/devlogo.svg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-animation">
        <div className="footer-orbit footer-orbit-1">
          <span className="footer-dot footer-dot-1"></span>
        </div>

        <div className="footer-orbit footer-orbit-2">
          <span className="footer-dot footer-dot-2"></span>
        </div>
      </div>

      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img src={devlogo} alt="DevOrbit" className="footer-logo" />
            </Link>
          </div>

          <nav className="footer-links">
            <a href="/">Discover</a>
            <a href="/">Community</a>
            <a href="/">Guidelines</a>
            <a href="/">Privacy</a>
            <a href="/">Terms</a>
          </nav>

          <div className="footer-social">
            <a href="#">
              <i className="ri-github-fill"></i>
            </a>
            <a href="#">
              <i className="ri-linkedin-box-fill"></i>
            </a>
            <a href="#">
              <i className="ri-twitter-x-fill"></i>
            </a>
            <a href="#">
              <i className="ri-discord-fill"></i>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 DevOrbit</span>

          <span className="footer-status">
            <i className="footer-status-dot"></i>
            All systems normal
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
