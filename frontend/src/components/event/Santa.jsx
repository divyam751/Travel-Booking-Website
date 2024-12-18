import React, { useState, useEffect } from "react";
import Snowfall from "react-snowfall";
import santa from "../../assets/images/santa.png";
import tree from "../../assets/images/tree.png";
import runningSanta from "../../assets/images/runningSanta.webp";
import "./Santa.css";

const Santa = () => {
  const [showSnowfall, setShowSnowfall] = useState(false);
  const [animateSanta, setAnimateSanta] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null); // To store the timeout ID

  useEffect(() => {
    // Clear the previous timeout if showSnowfall changes
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (showSnowfall) {
      setAnimateSanta(true);

      // Set a timeout to stop the animation after 10 seconds
      const id = setTimeout(() => {
        setAnimateSanta(false);
      }, 7000);

      setTimeoutId(id); // Store the timeout ID to clear it if showSnowfall changes
    } else {
      setAnimateSanta(false);
    }

    // Cleanup: Clear the timeout when the component unmounts or before running the effect again
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showSnowfall]);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "0vh",
        backgroundColor: "black",
      }}
    >
      {/* Toggle Snowfall */}
      {showSnowfall && (
        <Snowfall
          style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            zIndex: 2,
            pointerEvents: "none",
          }}
          snowflakeCount={200} // Customize the number of snowflakes
        />
      )}

      {/* Button */}
      <button
        onClick={() => setShowSnowfall(!showSnowfall)}
        className="santa-showButton"
      >
        {showSnowfall ? (
          <img className="santa-button__img" src={tree} alt="tree" />
        ) : (
          <img className="santa-button__img" src={santa} alt="santa" />
        )}
      </button>

      {/* Running Santa Animation */}
      {showSnowfall && animateSanta && (
        <img src={runningSanta} alt="Running Santa" className="running-santa" />
      )}
    </div>
  );
};

export default Santa;
