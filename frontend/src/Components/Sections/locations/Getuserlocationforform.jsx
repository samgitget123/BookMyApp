import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { fetchPlaygrounds } from "../../../Features/citySlice";

const Getuserlocationforform = ({ onCityFetched }) => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [errorApi, setErrorApi] = useState(null);

  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setLocation({ latitude, longitude });

    // Call the reverse geocoding API
    getCityFromCoordinates(latitude, longitude);
  };

  const handleError = (error) => {
    if (error.code === error.PERMISSION_DENIED) {
      alert(
        "Location access denied. Please allow location access in your browser settings."
      );
    } else {
      setErrorApi(error.message);
    }
  };

  const getCityFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );

      const address = response.data.address;

      const city =
        address.city ||
        address.town ||
        address.village ||
        address.state_district ||
        address.state ||
        "Unknown City";

      const area =
        address.suburb || address.neighbourhood || "Unknown Area";

      if (city) {
        onCityFetched(city, area); // Pass both city and area to the parent component
        setCity(city);
        setArea(area); // Store area for local use, if needed
      }

      dispatch(fetchPlaygrounds(city));

    } catch (error) {
      console.error("Error fetching city:", error);
      setErrorApi("Unable to retrieve city data");
    }
  };

  const requestLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    requestLocationAccess(); // Automatically request location when the component mounts
  }, []);

  return null; // No need for a button, as location is fetched automatically
};

export default Getuserlocationforform;
