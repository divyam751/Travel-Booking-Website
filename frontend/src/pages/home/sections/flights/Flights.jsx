import React from "react";
import "./Flights.css";
import airplane from "../../../../assets/images/home/airplane.webp";
import cabincrew from "../../../../assets/images/home/cabincrew.webp";
import travel from "../../../../assets/images/home/travel.webp";

const Flights = () => {
  return (
    <section className="flights-container">
      <div className="flights-container-header">
        <span>Best and comfortable flights experience</span>
        <span>
          From the moment you step on board, our dedicated team is committed to
          providing a smooth and unforgettable experience, ensuring your flight
          is nothing short of extraordinary.
        </span>
      </div>
      <div className="flights-container__parent">
        <div className="flights-box">
          <img src={airplane} alt="airplan" />
        </div>
        <div className="flights-box">
          <img src={cabincrew} alt="cabincrew" />
        </div>
        <div className="flights-box">
          <img src={travel} alt="traveler" />
        </div>
      </div>
    </section>
  );
};

export default Flights;
