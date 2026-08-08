import React from "react";
import Hero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Explore from "./components/ExploreSection/ExploreSection";
import Footer from "./components/Footer/Footer";

const Welcome = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Explore />
      <Footer />
    </>
  );
};

export default Welcome;
