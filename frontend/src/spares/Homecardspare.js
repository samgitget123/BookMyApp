import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "../../../Contexts/BaseUrlContext";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

const HomeCard = ({ grounddata }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { baseUrl } = useBaseUrl();
  const navigate = useNavigate();

  useEffect(() => {
    const { userLocation, selectCity } = grounddata;
    const state = userLocation.state || "Telangana";
    const city = selectCity || "";

    const url = `${baseUrl}/api/ground?state=${state}&city=${city}`;
    console.log(url, "getgrounds");

    axios
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching grounds:", error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [grounddata, baseUrl]);

  const handleCardClick = (gid) => {
    navigate(`/viewground/${gid}`, { state: gid });
  };

  return (
    <div className="container my-3">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5">
          <FaSpinner className="spinner-icon" style={{ fontSize: "50px", color: "grey", animation: "spin 1s infinite" }} />
          <span className="ms-2">Loading...</span>
        </div>
      ) : (
        <div className="row g-4">
          {data.length > 0 ? (
            data.map((playground) => (
              <div key={playground.ground_id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card shadow-lg border-0 rounded h-100" onClick={() => handleCardClick(playground.ground_id)}>
                  <div className="card-img-top d-flex align-items-center justify-content-center" style={{ height: "200px", backgroundColor: "#f0f0f0" }}>
                    {playground.data.photo ? (
                      <img
                        src={`${baseUrl}/uploads/${Array.isArray(playground.data.photo) ? playground.data.photo[0] : playground.data.photo}`}
                        alt={playground.data.name}
                        className="img-fluid"
                        style={{ height: "100%", width: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span>No Image Available</span>
                    )}
                  </div>

                  <div className="card-body secondaryColor d-flex flex-column">
                    <h5 className="card-title teritoryFont cardheadfont">{playground.data.name}</h5>
                    <p className="card-text teritoryFont">
                      <i className="fas fa-map-marker-alt" style={{ color: "#00EE64" }}></i> {playground.data.location}
                    </p>
                    <button className="btn btn-success mt-auto">Book Your Slots</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center fw-bold text-secondary">No Registered Grounds. Please Register Your Ground.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeCard;
