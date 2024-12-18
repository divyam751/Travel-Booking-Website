import React from "react";
import "./Footer.css";
import { FaFacebookSquare, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router";

const Footer = () => {
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
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-header">
          <div
            className="footer-title"
            onClick={(e) => handleNavigation(e, "hero")}
          >
            Voyagers
          </div>
          <div className="footer-header__links">
            <a href="https://www.instagram.com/" target="_blank">
              <FaInstagram className="footer-header__link" />
            </a>
            <a href="https://www.linkedin.com/in/divyam751/" target="_blank">
              <FaLinkedin className="footer-header__link" />
            </a>
            <a href="https://www.facebook.com/" target="_blank">
              <FaFacebookSquare className="footer-header__link" />
            </a>
          </div>
          <p className="footer-header__text">
            Voyawander is the gateway to new horizons, where each step leads to
            a world of wonder waiting to be explored.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
