import React, { createContext, useState, useEffect } from "react";
import { API_URL } from "../constant";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchData = async (endpoint, stateSetter, storageKey) => {
      const cachedData = sessionStorage.getItem(storageKey);

      if (cachedData) {
        stateSetter(JSON.parse(cachedData)); // Load data from sessionStorage
        return;
      }

      try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        const result = await response.json();

        // Check if the response is successful and contains data
        if (result.status === "success" && result.data) {
          const data = result.data;
          stateSetter(data);
          sessionStorage.setItem(storageKey, JSON.stringify(data)); // Store data in sessionStorage
        } else {
          console.error(`Failed to fetch ${endpoint}: Invalid data structure`);
        }
      } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
      }
    };

    fetchData("places", setPlaces, "places");
    fetchData("hotels", setHotels, "hotels");
    fetchData("flights", setFlights, "flights");
  }, []);

  return (
    <DataContext.Provider value={{ places, hotels, flights }}>
      {children}
    </DataContext.Provider>
  );
};
