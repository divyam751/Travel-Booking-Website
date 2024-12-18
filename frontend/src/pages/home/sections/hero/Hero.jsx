import React from "react";
import "./Hero.css";
import img1 from "../../../../assets/images/home/hero-1.webp";
import img2 from "../../../../assets/images/home/hero-2.webp";
import { useNavigate } from "react-router";

const Hero = () => {
  const navigate = useNavigate();
  const handleNavigation = (e, sectionId) => {
    e.preventDefault();

    const scrollToSection = () => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (window.location.pathname === "/") {
      scrollToSection();
    } else {
      navigate("/");
      setTimeout(scrollToSection, 300);
    }
  };

  return (
    <section className="hero-container">
      <div className="hero-left">
        <img src={img1} alt="hero-img" className="hero-left-img" />
        <img src={img2} alt="hero-img" className="hero-left-img" />
      </div>
      <div className="hero-right">
        <span>Explore the beauty of Journey</span>
        <span>
          Join our community of travel enthusiasts and discover new places. meet
          new people, and make lasting memories. Book with us and experience the
          world like never before.
        </span>
        <button className="hero-button">
          <a href="#about" onClick={(e) => handleNavigation(e, "aboutus")}>
            Learn More
          </a>
        </button>
      </div>
    </section>
  );
};

export default Hero;
