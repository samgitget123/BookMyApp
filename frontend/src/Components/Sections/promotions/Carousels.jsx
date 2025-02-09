import React from "react";
import banner1 from "../../../Images/crickbanner.jpg";
import banner2 from "../../../Images/bgcrick.jpg";
import banner3 from "../../../Images/banner.jpg";

import banner4 from "../../../Images/cricgrass.jpg";
import banner5 from "../../../Images/cricequip.jpg";
import banner6 from "../../../Images/sports.jpg";

import banner7 from "../../../Images/cricart.jpg";
import banner8 from "../../../Images/greengrass.jpg";
import banner9 from "../../../Images/baseball.jpg";

const Carousels = () => {
  const banners = [banner7, banner8, banner9, banner6]; // Array of banner images
  const topTexts = [
    "Lets Book Your Space",
    "Play Your Favorite Game",
    "Explore Our Cricket Fields",
    "Get Your Game On!",
    
  ]; // Array of top text to be displayed on each slide
  // const bottomTexts = [
  //   "The Ultimate Experience",
  //   "Play and Win",
  //   "Get Ready to Compete",
  //   "Book Your Ground Today",
   
  // ];
  return (
    <div
      id="carouselExample"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      <div className="carousel-inner">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={banner}
              className="d-block w-100"
              alt={`Slide ${index + 1}`}
            />
             <div
              className="carousel-caption d-none d-md-block"
              style={{
                position: "absolute",
                // top: "30%",
                // left: "20%",
               // transform: "translate(-50%, -50%)",
                color: "#fff",
                fontSize: "40px",
                fontWeight: "bold",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
                padding: "2px 2px",
                borderRadius: "5px", // Optional: Add rounded corners
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", // Optional: Adds a shadow to the text for better visibility
              }}
            >
              <h5 style={{fontSize:"30px"}}>{topTexts[index]}</h5>
            </div>
            {/* Bottom Text */}
            {/* <div className="carousel-caption d-none d-md-block">
              <h5>{bottomTexts[index]}</h5>
            </div> */}
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span
          className="carousel-control-prev-icon"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span
          className="carousel-control-next-icon"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousels;
