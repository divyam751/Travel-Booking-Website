import React, { useContext, useEffect, useState } from "react";
import "./FlightCard.css";
import { ImSpoonKnife } from "react-icons/im";
import { useNavigate } from "react-router";
import { BookingContext } from "../../context/BookingContext";
import { UserContext } from "../../context/UserContext";

const FlightCard = ({ flight }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    updateBooking({ flight: flight._id });
    navigate("/register");
  };

  const { updateBooking } = useContext(BookingContext);
  const { user } = useContext(UserContext);

  return (
    <div className="flightContianer">
      <div className="section1">
        <div className="sectionLeft">
          <button className="deal">DEAL</button>
          <p>
            Christmas Day Sale is live, Flat 14% Off (up to Rs. 2,017) on using
            American Express Cards and RBL Bank Credit Cards. TnC apply
          </p>
        </div>
      </div>
      <div className="section2">
        <div className="devider1">
          <div className="flightDetails">
            <div className="flightLogo">
              <img src={flight.flightLogo} alt="logo" />
            </div>
            <div className="flightName">
              <p>{flight.flightName}</p>
              <p>{flight.flightNumber}</p>
            </div>
          </div>
          <div className="timeSection">
            <div className="timeBox">
              <p>{flight.departureTime}</p>
              <p>{flight.departureDestination}</p>
            </div>
            <div className="line"></div>
            <div className="timeBox">
              <p>{flight.arrivalTime}</p>
              {/* <p>{country}</p> */}
              <p>{user.location}</p>
            </div>
          </div>
        </div>
        <div className="devider2">
          <div className="totalTime">
            <p>{flight.totalTime}</p>
            <p>Non Stop</p>
          </div>
          <div className="flightPrice">
            <p>$ {flight.flightPrice}</p>
            <button
              className="flightBookNowBtn"
              onClick={() => {
                handleBookNow(flight);
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
      <div className="section3">
        <div>
          <select>
            <option>Flight Details</option>
          </select>
        </div>
        <div className="flightFooter">
          <div className="mealSection">
            <ImSpoonKnife />
            <p>Free Meal</p>
          </div>
          <div className="emissions">
            <p>Emissions: 142 Kg CO2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
