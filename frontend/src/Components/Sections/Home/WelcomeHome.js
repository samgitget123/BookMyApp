import React, { useState } from "react";
import { useSelector } from "react-redux";
import brandlogo from "../../../Images/bmgicondisplay.jpeg";
import Carousels from "../promotions/Carousels";
import Getlocations from "../locations/Getlocations";
import TypingText from "../animations/Typingtext";
import CardComponent from "../Cardcomponent";
import HomeCard from "./HomeCard";
import { Button } from "react-bootstrap";
const WelcomeHome = () => {
  const userLocation = useSelector((state) => state.userLocation.userLocation);
  const [selectCity, setSelectCity] = useState('');
  const user_name = localStorage.getItem("name");
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
                  <div >
                    <img
                      className="img-fluid brandlogosize" //rotateImage
                      src={brandlogo}
                      alt="logo"
                    />
                  </div>
                  <div>
                    <h4 className="webheading">
                      Hello{" "}
                      <span className="webheading2">{user_name}</span>
                    </h4>
                  </div>
                  <TypingText />



                  {/* Get Location Button */}
                  {/* <div>
                    <Getlocations />
                  </div> */}


                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Card components */}
      <section className="px-3">
        <HomeCard grounddata={{ selectCity, userLocation }} />
      </section>

    </>
  );
};

export default WelcomeHome;
