import React, { useContext, useEffect, useState } from "react";
import "./Destinations.css";

import InputBox from "../../components/inputbox/InputBox";
import PlaceCard from "../../components/placecard/PlaceCard";
import { DataContext } from "../../context/DataContext";

const Destinations = () => {
  const [query, setQuery] = useState("");
  const { places } = useContext(DataContext);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  // Filter places based on the query
  const filteredPlaces = places.filter((place) =>
    place.placeName.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  return (
    <section className="destinations-container">
      <div className="destinations-container-header">
        <span>Find Popular Destinations</span>
        <InputBox
          type="text"
          label="Search Places"
          value={query}
          onChange={handleChange}
          width="500px"
        />
      </div>

      <div className="destinations-container__parent">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => {
            return <PlaceCard key={place._id} place={place} />;
          })
        ) : (
          <span className="no-results">No destinations found</span>
        )}
      </div>
    </section>
  );
};

export default Destinations;
