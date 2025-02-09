import React, { useState } from "react";
import { useSelector } from "react-redux";
import brandlogo from "../../Images/bmgicondisplay.jpeg";
import Carousels from "./promotions/Carousels";
import Getlocations from "./locations/Getlocations";
import TypingText from "./animations/Typingtext";
import { telanganaCities } from "../Data/CityData";
import CardComponent from "./Cardcomponent";
const Herosection = () => {
  const userLocation = useSelector((state) => state.userLocation.userLocation);
  const [selectCity, setSelectCity] = useState('');
  console.log(userLocation, selectCity, 'useradrress')
  // Handle city selection change
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setSelectCity(selectedCity)
  };
  return (
    <>
      <section className="text-dark primaryColor">
        <div className="container-fluid">
          <div className="row">
            {/* Carousel Section */}
            <div className="col-lg-8 d-none d-md-block">
              <Carousels />
            </div>

            {/* Form Section */}
            <div
              className="col-lg-4 secondaryColor"
              style={{ borderRadius: "0px 0px 40px 40px" }}
            >
              <div className="d-flex align-items-center justify-content-center text-center">
                <div className=" mt-md-2">
                  <div className=" d-none d-sm-block mb-sm-5">
                    <img
                      className="img-fluid brandlogosize" //rotateImage
                      src={brandlogo}
                      alt="logo"
                    />
                  </div>
                  <TypingText />

                  {/* User State and City Dropdowns */}
                  <form role="search" onSubmit={(e) => e.preventDefault()}>
                    {/* State Dropdown */}
                    <input class="form-control" type="text" value={userLocation.state} aria-label="Disabled input example" disabled readonly />

                    {/* City Dropdown */}
                    <select
                      className="form-control my-3"
                      value={selectCity}
                      onChange={handleCityChange}
                      style={{ borderRadius: "20px" }}
                    >
                      <option value="">Select City</option>
                      {telanganaCities.map((city, index) => (
                        <option key={index} value={city} >
                          {city}
                        </option>
                      ))}
                    </select>
                  </form>

                  {/* Get Location Button */}
                  <div>
                    <Getlocations />
                  </div>

                  <div>
                    <h4 className="webheading">
                      Find Grounds{" "}
                      <span className="webheading2">@ Your Nearest</span>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-3">
        <CardComponent grounddata={{ selectCity, userLocation }} />
      </section>
    </>
  );
};

export default Herosection;
