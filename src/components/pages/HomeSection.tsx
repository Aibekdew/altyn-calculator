import React from "react";
import Welcome from "./HomePage/Welcome";
import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";

const HomeSection = () => {
  return (
    <div>
      <Header/>
      <Welcome />
    </div>
  );
};

export default HomeSection;
