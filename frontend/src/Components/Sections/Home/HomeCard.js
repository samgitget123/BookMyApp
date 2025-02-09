import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "../../../Contexts/BaseUrlContext";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

const HomeCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { baseUrl } = useBaseUrl();
  const navigate = useNavigate();

  // Retrieve user_id from localStorage
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) {
      console.error("User ID not found in localStorage");
      setLoading(false);
      return;
    }

    const url = `${baseUrl}/api/ground/user/grounds?userId=${user_id}`;

    console.log(url, "getgrounds");

    axios
      .get(url)
      .then((response) => {
        setData(response.data); // Response is an array
      })
      .catch((error) => {
        console.error("Error fetching grounds:", error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [baseUrl, user_id]);

  const handleCardClick = (gid) => {
    navigate(`/viewground/${gid}`, { state: gid });
  };

  // Get today's date in 'YYYY-MM-DD' format
  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  return (
    <div className="my-3">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5">
          <FaSpinner className="spinner-icon" style={{ fontSize: "50px", color: "grey", animation: "spin 1s infinite" }} />
          <span className="ms-2">Loading...</span>
        </div>
      ) : (
        <div className="container">
          <div className="row g-3">
            {data.length > 0 ? (
              data.map((playground) => {
                // Check if today's date exists in slots and fetch bookedSlots for that date
                // const slotsForToday = playground.slots[todayDate];
                const slotsForToday = playground.slots ? playground.slots[todayDate] : null;
                return (
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={playground.ground_id} onClick={() => handleCardClick(playground.ground_id)}>
                    <div className="card shadow-lg border-0 rounded h-100">
                      <div className="card-img-top d-flex align-items-center justify-content-center" style={{ height: "200px", backgroundColor: "#f0f0f0" }}>
                        {playground.photo && playground.photo.length > 0 ? (
                          <img
                            src={`${baseUrl}/uploads/${playground.photo[0]}`}
                            alt={playground.name}
                            className="img-fluid"
                            style={{ height: "100%", width: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <span>No Image Available</span>
                        )}
                      </div>

                      <div className="card-body secondaryColor d-flex flex-column">
                        <div className="d-flex justify-content-between">
                          <div> 
                            <h5 className="card-title teritoryFont cardheadfont">{playground.name}</h5>
                          </div>
                          <div>
                            <p className="card-text teritoryFont">
                            <i className="fas fa-map-marker-alt" style={{ color: "#00EE64" }}></i> {playground.location}
                            </p>
                          </div>
                        </div>

                        {/* Displaying the number of booked slots for today's date */}
                        {slotsForToday && slotsForToday.bookedSlots.length > 0 ? (

                          <p className="card-text teritoryFont m-0">Booked Slots: <span>{slotsForToday.bookedSlots.length}</span></p>

                        ) : (
                          <p className="text-muted text-light m-0">No bookings yet for today.</p>
                        )}

                        <button className="btn btn-success mt-2">Book Your Slots</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center fw-bold text-secondary">
                <p>No Registered Grounds. Please Register Your Ground.</p>
                <button className="btn btn-md btn-success" onClick={() => navigate("/createground")}>
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeCard;
