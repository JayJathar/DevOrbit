import React from "react";
import "./Explore.css";
import BackgroundAnimation from "../BackgroundAnimation/BackgroundAnimation";

const exploreItems = [
  {
    icon: "01",
    title: "Projects",
    description:
      "Discover creative projects, applications, experiments, and innovative ideas built by developers and creators.",
  },
  {
    icon: "02",
    title: "Code",
    description:
      "Explore useful code snippets, development techniques, open-source work, and practical solutions.",
  },
  {
    icon: "03",
    title: "Design",
    description:
      "Find inspiring interfaces, visual concepts, UI experiments, and creative design work from the community.",
  },
  {
    icon: "04",
    title: "Creators",
    description:
      "Discover talented developers, designers, and creators while exploring the work they share on DevOrbit.",
  },
  {
    icon: "05",
    title: "Tutorials",
    description:
      "Learn from tutorials, technical guides, development tips, and experiences shared by the community.",
  },
  {
    icon: "06",
    title: "Community",
    description:
      "Connect with people who share your interests, collaborate on ideas, and grow together.",
  },
];

const Explore = () => {
  return (
    <section className="explore">
      {/* Same background system as How It Works */}
      <BackgroundAnimation subtle />

      {/* Background glow */}
      <div className="explore-background-glow" />

      {/* Header */}
      <div className="explore-header">
        <span className="explore-tag">Explore DevOrbit</span>

        <h2>Discover Something New</h2>

        <p>
          Explore projects, code, designs, creators, and ideas from a growing
          community of developers and innovators.
        </p>
      </div>

      {/* Cards */}
      {/* Cards */}
      <div className="explore-grid">
        {exploreItems.map((item) => (
          <article className="explore-card" key={item.icon}>
            <div className="explore-node-wrap">
              <span className="explore-ring" />
              <div className="explore-node">{item.icon}</div>
            </div>

            <h3>{item.title}</h3>

            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Explore;
