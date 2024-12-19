import React from "react";
import { useNavigate } from "react-router";
import "./NotFound.css";
import titleImg from "../../assets/images/404.webp";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="not-found-container">
      <img src={titleImg} alt="404 Not Found" className="not-found-image" />
      <p className="not-found-message">
        Oops! The page you're looking for doesn't exist.
      </p>
      <button className="not-found-button" onClick={handleGoHome}>
        Go to Homepage
      </button>
    </div>
  );
};

export default NotFound;
