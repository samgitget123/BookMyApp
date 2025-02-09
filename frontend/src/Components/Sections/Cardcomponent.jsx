import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./requires/SearchBar";
import { useBaseUrl } from "../../Contexts/BaseUrlContext";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

const CardComponent = ({ grounds, grounddata }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  // fullData will store the complete API response
  const [fullData, setFullData] = useState([]);
  // filteredData will be used for rendering (and updating based on search)
  const [filteredData, setFilteredData] = useState([]);

  const { baseUrl } = useBaseUrl();
  const navigate = useNavigate();

  // Fetch ground details
  useEffect(() => {
    const state = grounddata.userLocation.state; // Default to Telangana if not provided
    const city = grounddata.selectCity;
    const location = ""; // Use dynamic location if available

    // Construct the URL for fetching grounds
    const url = `${baseUrl}/api/ground?state=${state}&city=${city}&location=${location}`;
console.log(url , 'getgrounds')
    const fetchGrounds = async () => {
      try {
        const response = await axios.get(url);
        // Store the full response in fullData
        setFullData(response.data);
        // Also initialize filteredData with the full data
        setFilteredData(response.data);
      } catch (error) {
        console.error(
          "Error fetching grounds:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchGrounds();
  }, [grounddata, baseUrl]);

  // Handle cards per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        setCardsPerPage(4);
      } else if (
        window.matchMedia("(min-width: 769px) and (max-width: 1028px)").matches
      ) {
        setCardsPerPage(8);
      } else {
        setCardsPerPage(12);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Simulate a loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(filteredData.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredData.slice(indexOfFirstCard, indexOfLastCard);

  // Handle search bar filtering
  // We use fullData as the source for filtering
  const handleSearch = (results) => {
    setFilteredData(results);
    setCurrentPage(1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCardClick = (gid) => {
    navigate(`/viewground/${gid}`, { state: gid });
  };

  return (
    <div className="my-3">
      <div>
        {/* Pass the full data to SearchBar so it can revert to default */}
        <SearchBar data={fullData} onSearch={handleSearch} />
      </div>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5">
          <FaSpinner
            className="spinner-icon"
            style={{
              fontSize: "50px",
              color: "grey",
              animation: "spin 1s infinite",
            }}
          />
          <span className="ms-2">Loading...</span>
        </div>
      ) : (
        <div className="row g-2">
          {currentCards && currentCards.length > 0 ? (
            currentCards.map((playground, index) => (
              <div
                className="col-lg-2 col-md-6 col-sm-12"
                key={index}
                onClick={() => handleCardClick(playground.ground_id)}
              >
                <div className="card shadow-lg border-0 rounded" style={{ width: "100%" }}>
                  <div
                    className="card-img-top"
                    style={{
                      height: "200px",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {Array.isArray(playground.data.photo) && playground.data.photo.length > 0 ? (
                      <img
                        src={`${baseUrl}/uploads/${playground.data.photo[0]}`}
                        alt={playground.data.name}
                        className="img-fluid"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : playground.data.photo ? (
                      <img
                        src={`${baseUrl}/uploads/${playground.data.photo}`}
                        alt={playground.data.name}
                        className="img-fluid"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span>No Image Available</span>
                    )}
                  </div>

                  <div className="card-body secondaryColor">
                    <h4 className="card-title teritoryFont cardheadfont">
                      <i className="fa-thin fa-cricket-bat-ball"></i>{" "}
                      {playground.data.name}
                    </h4>
                    <p className="card-text teritoryFont">
                      <i className="fas fa-map-marker-alt" style={{ color: "#00EE64" }}></i>{" "}
                      {playground.data.location}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="text-center fw-bold text-secondary">
                No playgrounds available for the selected filters.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="row justify-content-center mt-4">
        <div className="col-md-6 d-flex justify-content-between">
          <button
            className="btn btn-sm secondaryColor teritoryFont"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            className="btn btn-sm secondaryColor teritoryFont"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
