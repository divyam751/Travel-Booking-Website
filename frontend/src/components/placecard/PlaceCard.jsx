import React, { useContext } from "react";
import "./PlaceCard.css";
import { useNavigate } from "react-router";
import { BookingContext } from "../../context/BookingContext";
import { UserContext } from "../../context/UserContext";
const PlaceCard = ({ place }) => {
  const { updateBooking } = useContext(BookingContext);
  const { updateUser } = useContext(UserContext);

  const handleClick = () => {
    updateBooking({ place: place._id });
    updateUser({ location: place.placeName.trim().split(" ").pop() });
    navigate("/hotels");
  };
  const navigate = useNavigate();
  return (
    <div key={place._id} className="placecard-box">
      {/* Include width and height attributes to reserve space */}
      <img
        src={place.imageURL}
        alt="place-image"
        width="380" // Matches container width
        height="260" // Matches height in CSS
      />
      <span className="placecard-box__title">{place.placeName}</span>
      <span className="placecard-box__duration">{place.tripDuration}</span>

      <div className="placecard-box_price">
        <div className="placecard-box_priceTag">
          <span>Starts from</span>
          <span>${place.price}/person</span>
        </div>

        <button onClick={handleClick}>Book</button>
      </div>
    </div>
  );
};

export default PlaceCard;
