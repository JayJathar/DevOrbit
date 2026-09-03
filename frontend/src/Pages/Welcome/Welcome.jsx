import React from "react";
import Hero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Explore from "./components/Explore/Explore";
// import Footer from "./components/Footer/Footer";

const Welcome = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Explore />
    </>
  );
};

export default Welcome;
