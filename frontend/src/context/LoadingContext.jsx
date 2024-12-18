// LoadingContext.jsx
import React, { createContext, useContext, useState } from "react";
import Loader from "../components/loader/Loader";

// Create a Context for the loading state
const LoadingContext = createContext();

// Create a custom hook to use the LoadingContext
export const useLoading = () => useContext(LoadingContext);

// Provider component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading }}>
      {isLoading && <Loader />}
      {children}
    </LoadingContext.Provider>
  );
};
