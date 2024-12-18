import React, { useContext } from "react";
import "./Holidays.css";
import { DataContext } from "../../../../context/DataContext";

import { useNavigate } from "react-router";
import { BookingContext } from "../../../../context/BookingContext";
import { UserContext } from "../../../../context/UserContext";

const Holidays = () => {
  const { places } = useContext(DataContext);
  const { updateBooking } = useContext(BookingContext);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <section className="holidays-container">
      <div className="holidays-container-header">
        <span>Find Popular Destinations</span>
        <span>
          Escape the ordinary and explore the extraordinary - with our
          handpicked selection of destinatations and travel deails. you will be
          able to create the trip of your dreams.
        </span>
      </div>
      <button
        className="holidays-exploreBtn"
        onClick={() => {
          navigate("/destinations");
        }}
      >
        Explore More
      </button>
      <div className="holidays-container__parent">
        {console.log({ places })}
        {places.slice(0, 3).map((place) => {
          return (
            <div key={place._id} className="holidays-box">
              <img src={place.imageURL} alt="place-image" />
              <span className="holidays-box__title">{place.placeName}</span>
              <span className="holidays-box__duration">
                {place.tripDuration}
              </span>

              <div className="holidays-box_price">
                <div className="holidays-box_priceTag">
                  <span>Starts from</span>
                  <span>${place.price}/person</span>
                </div>

                <button
                  onClick={() => {
                    updateBooking({
                      place: place._id,
                    });
                    updateUser({
                      location: place.placeName.trim().split(" ").pop(),
                    });
                    navigate("/hotels");
                  }}
                >
                  Book
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Holidays;
