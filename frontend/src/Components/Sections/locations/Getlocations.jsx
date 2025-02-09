import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUserlocation } from "../../../redux/features/userlocationSlice";
import { IoLocationOutline } from "react-icons/io5";
const Getlocations = ({ disabled }) => {
  const dispatch = useDispatch();
  const [useraddress, setUseradress] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [errorApi, setErrorApi] = useState(null);

  // Handle successful location fetch
  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setLocation({ latitude, longitude });

    // Fetch address based on coordinates
    getCityFromCoordinates(latitude, longitude);
  };

  // Handle location errors
  const handleError = (error) => {
    if (error.code === error.PERMISSION_DENIED) {
      alert(
        "Location access denied. Please allow location access in your browser settings."
      );
    } else {
      setErrorApi(error.message);
    }
  };

  // Get city, state, district, and area from coordinates using OpenStreetMap API
  const getCityFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );

      const address = response.data.address;
      dispatch(getUserlocation(address));

      console.log("User Address:", address); // Log the address directly
    } catch (error) {
      console.error("Error fetching city data:", error);
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
    requestLocationAccess(); // Request location access on mount
  }, []);

  return (
    <>
      <button
        className="btn btn-sm btn-success  my-3"
        onClick={requestLocationAccess}
        disabled={disabled}
      >
         <IoLocationOutline size={24} color="#00EE64" /> 
         Use Current Location
      </button>
      
     

      {useraddress && (
        <p>
          <strong>City:</strong> {useraddress.city || "N/A"} <br />
          <strong>State:</strong> {useraddress.state || "N/A"} <br />
          <strong>District:</strong> {useraddress.state_district || "N/A"} <br />
          <strong>Country:</strong> {useraddress.country || "N/A"} <br />
        </p>
      )}

      {errorApi && <p className="text-danger">{errorApi}</p>}
    </>
  );
};

export default Getlocations;
