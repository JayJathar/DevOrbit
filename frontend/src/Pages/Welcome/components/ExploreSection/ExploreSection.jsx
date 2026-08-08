import React from "react";
import "./ExploreSection.css";
import Button from "@mui/material/Button";
import BackgroundAnimation from "../BackgroundAnimation/BackgroundAnimation";
import { useNavigate } from "react-router-dom";

const items = [
  {
    icon: "📷",
    title: "Posts",
    description: "See what creators are sharing and building right now.",
  },
  {
    icon: "💻",
    title: "Code",
    description: "Browse snippets, repos, and tools shared by the community.",
  },
  {
    icon: "📁",
    title: "Projects",
    description: "Explore full builds, portfolios, and works in progress.",
  },
  {
    icon: "💬",
    title: "Discussions",
    description: "Join conversations, ask questions, and share ideas.",
  },
  {
    icon: "❤️",
    title: "Community",
    description: "Connect with creators, developers, and innovators worldwide.",
  },
  {
    icon: "📌",
    title: "Collections",
    description: "Save and organize the projects and posts that inspire you.",
  },
];

const Explore = () => {
  const navigate = useNavigate();
  return (
    <section className="explore">
      <BackgroundAnimation subtle />

      <div className="section-header">
        <span className="section-tag">Explore</span>
        <h2>Explore the Ecosystem</h2>
        <p>
          Everything you need to discover, build, and connect — all in one
          orbit.
        </p>
      </div>

      <div className="explore-grid">
        {items.map((item) => (
          <div className="explore-card" key={item.title}>
            <div className="explore-node-wrap">
              <span className="explore-ring"></span>
              <div className="explore-node">{item.icon}</div>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <div className="explore-buttons">
        <Button className="enter-button" onClick={() => navigate("/login")}>
          Enter Your Space
        </Button>
      </div>
    </section>
  );
};

export default Explore;
