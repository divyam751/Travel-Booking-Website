import React, { useContext } from "react";
import "./Details.css";
import { DataContext } from "../../context/DataContext";
import { BookingContext } from "../../context/BookingContext";
import { useNavigate } from "react-router";

const Details = () => {
  const { booking } = useContext(BookingContext);
  const { places, hotels, flights } = useContext(DataContext);
  const navigate = useNavigate();

  // Find data using IDs stored in booking
  const placeDetails = places.find((place) => place._id === booking.place);
  const hotelDetails = hotels.find((hotel) => hotel._id === booking.hotel);
  const flightDetails = flights.find((flight) => flight._id === booking.flight);

  //   console.log({ booking, placeDetails, hotelDetails, flightDetails });

  const handleProceedToPay = () => {
    // alert("Proceeding to Payment...");
    navigate("/checkout");
  };

  return (
    <div className="details-container">
      <h2 className="section-heading">Booking Confirmation</h2>

      {/* Traveller Details */}
      <div className="details-section">
        <h3>Traveller Details</h3>
        <div className="details-row">
          <span>Name:</span>
          <span>{booking.fullName || "N/A"}</span>
        </div>
        <div className="details-row">
          <span>Age:</span>
          <span>{booking.age || "N/A"}</span>
        </div>
        <div className="details-row">
          <span>Gender:</span>
          <span>{booking.gender || "N/A"}</span>
        </div>
        <div className="details-row">
          <span>Address:</span>
          <span>{booking.address || "N/A"}</span>
        </div>
      </div>

      {/* Holiday Details */}
      <div className="details-section">
        <h3>Holiday Details</h3>
        <div className="details-row">
          <span>Place:</span>
          <span>{placeDetails?.placeName || "N/A"}</span>
        </div>
        <div className="details-row">
          <span>Hotel Name:</span>
          <span>{hotelDetails?.hotelName || "N/A"}</span>
        </div>
        <div className="details-row">
          <span>Flight Name:</span>
          <span>{flightDetails?.flightName || "N/A"}</span>
        </div>
        <div className="details-row">
          <span>Departure Time:</span>
          <span>{flightDetails?.departureTime || "N/A"}</span>
        </div>
        <div className="details-row">
          <span>Arrival Time:</span>
          <span>{flightDetails?.arrivalTime || "N/A"}</span>
        </div>
      </div>

      {/* Payment Details */}
      <div className="details-section">
        <h3>Payment Details</h3>
        <div className="details-row">
          <span>Trip Amount:</span>
          <span>${placeDetails?.price || "0"}</span>
        </div>
        <div className="details-row">
          <span>Hotel Amount:</span>
          <span>${hotelDetails?.hotelPrice || "0"}</span>
        </div>
        <div className="details-row">
          <span>Flight Amount:</span>
          <span>${flightDetails?.flightPrice || "0"}</span>
        </div>
        <div className="details-row">
          <span>No. of Passengers:</span>
          <span>{booking?.numOfTickets || "N/A"}</span>
        </div>
        <div className="details-row total">
          <span>Total Amount:</span>
          {/* <span>${booking?.totalAmount || "0"}</span> */}
          <span>
            $
            {(placeDetails?.price +
              hotelDetails?.hotelPrice +
              flightDetails?.flightPrice) *
              booking?.numOfTickets || "0"}
          </span>
        </div>
      </div>

      {/* Proceed to Pay Button */}
      <div className="button-container">
        <button className="proceed-button" onClick={handleProceedToPay}>
          Proceed to Pay
        </button>
      </div>
    </div>
  );
};

export default Details;
