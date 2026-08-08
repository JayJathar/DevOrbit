import React from "react";
import "./HowItWorks.css";
import BackgroundAnimation from "../BackgroundAnimation/BackgroundAnimation";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Explore projects, code, designs, and inspiring creators from around the world.",
  },
  {
    number: "02",
    title: "Create",
    description:
      "Build your profile, showcase your portfolio, and express your ideas.",
  },
  {
    number: "03",
    title: "Share",
    description:
      "Publish projects, code snippets, tutorials, and creative work with the community.",
  },
  {
    number: "04",
    title: "Connect",
    description:
      "Follow creators, collaborate on projects, join discussions, and grow together.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <BackgroundAnimation subtle />

      <div className="section-header">
        <span className="section-tag">How It Works</span>
        <h2>How DevOrbit Works</h2>
        <p>
          From discovering inspiration to building meaningful connections,
          DevOrbit brings creators, developers, and innovators together in one
          collaborative platform.
        </p>
      </div>

      <div className="timeline">
        <div className="timeline-line"></div>

        {steps.map((step) => (
          <div className="timeline-step" key={step.number}>
            <div className="timeline-node-wrap">
              <span className="timeline-ring"></span>
              <div className="timeline-node">{step.number}</div>
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
