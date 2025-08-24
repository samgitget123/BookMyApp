import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "../../../Contexts/BaseUrlContext";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import Ouradv from "../Ouradv";
import Contactus from "../Contactus";

const HomeCard = () => {
  const [user_id, setUserId] = useState(null); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { baseUrl } = useBaseUrl();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId); // Update state
    } else {
      console.error("User ID not found in localStorage");
      setLoading(false);
    }
  }, []);

  // Second useEffect to fetch API data once user_id is set
  useEffect(() => {
    if (!user_id) return; // Prevent API call if user_id is not set

    setLoading(true);
    const url = `${baseUrl}/api/ground/user/grounds?userId=${user_id}`;
    console.log("Fetching from:", url);

    axios
      .get(url)
      .then((response) => {
        console.log("API Response:", response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching grounds:", error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user_id]); // Corrected to depend on user_id

  console.log(data, "grounddata"); // Now shows correct data
  const handleCardClick = (gid , ground_name , lat , long) => {
    navigate(`/viewground/${gid}`, { state: { gid, ground_name, lat , long } });
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
  const isLoggedIn = !!localStorage.getItem("token") && !!localStorage.getItem("user_id");

  return (
    <>
     {isLoggedIn ? (<div className="d-flex justify-content-center my-3  "><h2  style={{ color: '#006849' }}>Pick Now</h2></div>):''} 
      <div>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center my-5">
            <FaSpinner className="spinner-icon" style={{ fontSize: "50px", color: "grey", animation: "spin 1s infinite" }} />
            <span className="ms-2">Loading...</span>
          </div>
        ) : (
          <div className="container-fluid" >
            <div className="row g-3 ">
              {data.length > 0 ? (
                data.map((playground) => {
                  const slotsForToday = playground.slots ? playground.slots[todayDate] : null;
                  return (
                    <div className="d-lg-flex justify-content-center">
                      <div className="col-sm-12 col-md-12 col-lg-6" key={playground.ground_id} onClick={() => handleCardClick(playground.ground_id , playground.name , playground.longitude , playground.latitude)}>
                        <div className="d-flex flex-column flex-lg-row align-items-lg-center">

                          {/* Main Card */}
                          {/* ${process.env.REACT_APP_BACKEND_URL}/uploads/${playground.photo[0]} */}
                          <div className="card shadow-lg border-0 rounded w-100">
                            <div className="card-img-top d-flex align-items-center justify-content-center" style={{ height: "250px", backgroundColor: "#f0f0f0" }}>
                              {playground.photo && playground.photo.length > 0 ? (
                                <img
                                  src={`${baseUrl}/uploads/${playground.photo}`}
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

                          {/* Collage Images (Hidden on Mobile) */}
                          <div className="d-none d-md-flex flex-wrap justify-content-center">
                            {playground.photo && playground.photo.length > 1 ? (
                              playground.photo.slice(1, 4).map((image, index) => (
                                <img
                                  key={index}
                                  src={`${baseUrl}/uploads/${image}`}
                                  alt={`Image ${index + 1}`}
                                  className="img-fluid m-2 rounded"
                                  style={{ width: "100%", height: "120px", objectFit: "cover" }}
                                />
                              ))
                            ) : (
                              <span className="text-muted">No Additional Images</span>
                            )}
                          </div>
                          {/* <div className="d-flex d-sm-block justify-content-center my-2">
                            <a className="btn btn-success btn-lg mt-3">
                             View
                            </a>

                          </div> */}
                        </div>
                      </div>
                    </div>

                  );
                })
              ) : (
                isLoggedIn ? (
                  <div className="col-12 text-center fw-bold text-secondary">
                    <p>No Registered Grounds. Please Register Your Ground.</p>
                    <button className="btn btn-md btn-success" onClick={() => navigate("/createground")}>
                      Register
                    </button>
                  </div>
                ) : (
                  <div className="col-12 text-center">
                    <p>Please log in to view available grounds.</p>
                    <button className="btn btn-md btn-success" onClick={() => navigate("/LoginForm")}>
                      Login
                    </button>
                  </div>
                )
              )}


            </div>
            {/* Our information */}
            <div className="row mt-5" style={{ backgroundColor: "#E8E8E8" }}>
              <div className="col-lg-8 col-sm-12 col-md-6">
                <Ouradv />
              </div>
              <div className="col-lg-4 col-sm-12 col-md-6">
                <Contactus />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomeCard;
