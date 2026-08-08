import React from "react";
import "./ExploreCard.css";

const ExploreCard = ({ icon, title, description }) => {
  return (
    <div className="explore-card">
      <div className="explore-node-wrap">
        <span className="explore-ring"></span>
        <div className="explore-node">{icon}</div>
      </div>

      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ExploreCard;
