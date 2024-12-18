import React, { useContext, useEffect, useState } from "react";
import "./Hotels.css";

import { DataContext } from "../../context/DataContext";
import HotelCard from "../../components/hotelcard/HotelCard";

const Hotels = () => {
  const { hotels } = useContext(DataContext);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  return (
    <section className="hotels-container">
      <div className="hotels-container-header">
        <span>Find Popular hotels</span>
      </div>

      <div className="hotels-container__parent">
        {hotels.length > 0 ? (
          hotels.map((hotel) => {
            return <HotelCard key={hotel._id} hotel={hotel} />;
          })
        ) : (
          <span className="no-results">No hotels found</span>
        )}
      </div>
    </section>
  );
};

export default Hotels;
