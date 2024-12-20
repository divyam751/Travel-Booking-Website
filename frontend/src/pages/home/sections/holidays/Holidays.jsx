import React, { useContext, useState, useEffect } from "react";
import "./Holidays.css";
import { DataContext } from "../../../../context/DataContext";
import { useNavigate } from "react-router";
import { BookingContext } from "../../../../context/BookingContext";
import { UserContext } from "../../../../context/UserContext";
import ToolTip from "../../../../components/tooltip/ToolTip";

const Holidays = () => {
  const { places } = useContext(DataContext); // Fetch places from context
  const { updateBooking } = useContext(BookingContext);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true); // Local loading state

  useEffect(() => {
    // Check when `places` is ready
    if (places && places.length > 0) {
      setIsLoading(false); // Stop loading when data is available
    }
  }, [places]);

  return (
    <section className="holidays-container">
      <div className="holidays-container-header">
        <span>Find Popular Destinations</span>
        <span>
          Escape the ordinary and explore the extraordinary - with our
          handpicked selection of destinations and travel deals. You will be
          able to create the trip of your dreams.
        </span>
      </div>{" "}
      {isLoading ? (
        <ToolTip message="Please wait a moment.">
          <button
            disabled={isLoading}
            className="holidays-exploreBtn"
            onClick={() => {
              navigate("/destinations");
            }}
          >
            Explore More
          </button>
        </ToolTip>
      ) : (
        <button
          disabled={isLoading}
          className="holidays-exploreBtn"
          onClick={() => {
            navigate("/destinations");
          }}
        >
          Explore More
        </button>
      )}
      <div className="holidays-container__parent">
        {isLoading
          ? // Render placeholders while loading
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="holidays-placeholder">
                <div className="holidays-placeholder__image" />
                <div className="holidays-placeholder__text1" />
                <div className="holidays-placeholder__text2" />
                <div className="holidays-placeholder__flex">
                  <div className="holidays-placeholder__text3" />
                  <div className="holidays-placeholder__text3" />
                </div>
              </div>
            ))
          : // Render actual places once loaded
            places.slice(0, 3).map((place) => (
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
            ))}
      </div>
    </section>
  );
};

export default Holidays;
