import React, { useContext, useEffect, useState } from "react";
import "./Flights.css";

import { DataContext } from "../../context/DataContext";
import HotelCard from "../../components/hotelcard/HotelCard";
import FlightCard from "../../components/flightcard/FlightCard";
// import PlaceCard from "../../components/placecard/PlaceCard";

const Flights = () => {
  const { flights } = useContext(DataContext);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  return (
    <section className="flights-container">
      <div className="flights-container-header">
        <span>Available Flights...</span>
      </div>

      <div className="flights-container__parentBox">
        {flights?.length > 0 ? (
          flights?.map((flight) => {
            return <FlightCard key={flight._id} flight={flight} />;
          })
        ) : (
          <span className="no-results">No flights found</span>
        )}
      </div>
    </section>
  );
};

export default Flights;
