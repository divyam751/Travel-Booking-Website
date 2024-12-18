import React from "react";
import "./Hotels.css";
import map from "../../../../assets/images/home/map.webp";

const Hotels = () => {
  return (
    <section className="hotels-container">
      <div className="hotels-container-header">
        <span>Great Locations across the World</span>
        <span>
          Travel to the most breathtaking and exotic location across the globe
          with us. From the majestic mountains of Patagonia to the pristine
          beaches of Bali. we'll take you there.
        </span>
      </div>
      <div className="hotels-map">
        <img src={map} alt="world-map" />
      </div>
    </section>
  );
};

export default Hotels;
