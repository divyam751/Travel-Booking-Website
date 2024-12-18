import React, { useContext } from "react";
import "./HotelCard.css";
import { IoStarSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { BsCupHotFill } from "react-icons/bs";
import { useNavigate } from "react-router";
import { BookingContext } from "../../context/BookingContext";
import { UserContext } from "../../context/UserContext";

const HotelCard = ({ hotel }) => {
  const starIcons = [];
  for (let i = 0; i < hotel.hotelStars; i++) {
    starIcons.push(<IoStarSharp key={i} />);
  }

  const navigate = useNavigate();
  const { updateBooking } = useContext(BookingContext);
  const { user } = useContext(UserContext);
  const handleClick = (hotel) => {
    updateBooking({ hotel: hotel._id });
    navigate("/flights");
  };

  return (
    <div className="hotelCard-container">
      <div className="hotelCard-left">
        <img src={hotel.hotelImage} alt="hotel_img" width={300} height={300} />
      </div>
      <div className="hotelCard-mid">
        <div className="hotelCard-mid__header">
          <div className="hotelCard-mid__ratingBox">
            <div className="Box__flex">
              <div className="ratingBox__stars">
                {starIcons.map((icon, index) => (
                  <span key={index}>{icon}</span>
                ))}
              </div>
              <div className="ratingBox__tag">RESORT</div>
            </div>
            <div className="Box__flex">
              <span className="ratingBox__hotelRating">
                {hotel.hotelRating}
              </span>
              <span>{hotel.reviewRating} Ratings</span>
            </div>
          </div>
          <div className="hotelCard-mid__hotelDetails">
            <h3>{hotel.hotelName}</h3>
            <p className="Box__flex">
              <FaLocationDot />
              <span>{user.location}</span>
            </p>
            <p>{hotel.hotelLocation}</p>
          </div>
        </div>
        <div className="hotelCard-mid__hotelDescription">
          <p>{hotel.hotelDescription}</p>
        </div>
      </div>
      <div className="hotelCard-right">
        <span className="hotelCard-right__price">$ {hotel.hotelPrice}</span>
        <p className="hotelCard-right__tax">
          + $ {hotel.hotelTax} TAXES & FEES{" "}
        </p>
        <p className="hotelCard-right__perNight">1 room per night</p>
        <p className="hotelCard-right__breakfast">
          <BsCupHotFill />
          INCL OF FREE BREAKFAST
        </p>
        <button
          className="hotelCard-right__BookBTN"
          onClick={() => handleClick(hotel)}
        >
          BOOK NOW
        </button>
      </div>
    </div>
  );
};

export default HotelCard;
