import React, { createContext, useState, useContext } from "react";

// Create the context
const BaseUrlContext = createContext();

// Custom hook to use the context
export const useBaseUrl = () => useContext(BaseUrlContext);

// Provider component
export const BaseUrlProvider = ({ children }) => {
  // State to manage the base URL
  const [baseUrl, setBaseUrl] = useState(
    "https://bookingapp-v-1-0.onrender.com"
  );
//http://localhost:5000
//https://bookingapp-v-1-0.onrender.com
  // Method to update the base URL
  const switchBaseUrl = (newUrl) => {
    setBaseUrl(newUrl);
  };

  return (
    <BaseUrlContext.Provider value={{ baseUrl, switchBaseUrl }}>
      {children}
    </BaseUrlContext.Provider>
  );
};
