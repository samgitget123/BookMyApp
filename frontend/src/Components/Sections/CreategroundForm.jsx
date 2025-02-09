import React, { useState, useEffect } from "react";
import axios from "axios";
import { useBaseUrl } from "../../Contexts/BaseUrlContext";
import { indianCities } from "../Data/CityData";
import Swal from "sweetalert2";
import { FaUser } from "react-icons/fa";
import brandIocn from "../../Images/bmgicondisplay.png";
import CaptionText from "./animations/CaptionText";

const CreateGroundForm = () => {
  const { baseUrl } = useBaseUrl();
  console.log(baseUrl, 'baseurl')
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    country: "",
    state: "",
    city: "",
    stateDistrict: "",
    photo: [],
    description: "",
    ground_owner: "",
    user_id: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoaded, setLocationLoaded] = useState(false);

  // Function to get the user's geolocation and fetch the details
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Using OpenStreetMap API (or any other API you prefer) for reverse geocoding
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
            );

            const address = res.data.address;
            setFormData({
              ...formData,
              state: address.state || "",
              stateDistrict: address.state_district || "",
              location: address.village || "",
              country: address.country || "",
              city: address.city || "",
            });
            setLocationLoaded(true);
          } catch (error) {
            Swal.fire("Error", "Unable to fetch location. Please check your network.", "error");
          }
        },
        (error) => {
          Swal.fire("Error", "Unable to retrieve your location.", "error");
        }
      );
    } else {
      Swal.fire("Error", "Geolocation is not supported by your browser.", "error");
    }
  };

  useEffect(() => {
    // Get the user location on initial load
    getUserLocation();
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.state) newErrors.state = "State is required.";
    if (!formData.stateDistrict) newErrors.stateDistrict = "State District is required.";
    if (!formData.city) newErrors.city = "City is required."; // Validation for city
    if (!formData.description) newErrors.description = "Description is required.";
    if (!formData.photo) newErrors.photo = "Photo is required.";
    if (!formData.ground_owner) newErrors.ground_owner = "Ground owner is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Update file change handler to handle multiple files
  const handleFileChange = (e) => {
    // Convert FileList to an array
    const filesArray = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, photo: filesArray }));
  };
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (user_id) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: user_id,
      }));
    }
  }, []);
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const user_id = localStorage.getItem("user_id");
  //   console.log(user_id, "user_id from localStorage");
  //   if (!user_id) {
  //     alert("User not logged in!");
  //     return;
  //   }

  //   if (validate()) {
  //     setIsLoading(true);
  //     const formDataToSubmit = new FormData();

  //     // Append non-file fields
  //     Object.keys(formData).forEach((key) => {
  //       if (key !== "photo") {
  //         formDataToSubmit.append(key, formData[key]);
  //       }
  //     });
  //     formDataToSubmit.append("user_id", user_id); // Add user_id directly to the form data
  //     // Append each file from the photo array
  //     formData.photo.forEach((file) => {
  //       formDataToSubmit.append("photo", file);
  //     });

  //     try {
  //       const response = await axios.post(
  //         `${baseUrl}/api/ground/createGround`,
  //         formDataToSubmit,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //       console.log(response, "Create Ground Response");
  //       Swal.fire("Success", "Ground added successfully!", "success");

  //       // Reset form fields after successful submission
  //       setFormData({
  //         name: "",
  //         location: "",
  //         country: "",
  //         state: "",
  //         city: "",
  //         stateDistrict: "",
  //         photo: [],
  //         description: "",
  //         ground_owner: "",
  //       });
  //       setErrors({}); // Clear errors
  //     } catch (error) {
  //       Swal.fire(
  //         "Error",
  //         "Failed to add ground. Please check your network connection.",
  //         "error"
  //       );
  //     } finally {
  //       setIsLoading(false); // Always reset loading state
  //     }
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //    const { user_id } = formData;
  //   if (!user_id) {
  //     alert("User not logged in!");
  //     return;
  //   }
  
  //   // Only add the user_id if it exists and is not an empty string
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     user_id: user_id, // Add user_id directly here
  //   }));
  
  //   if (validate()) {
  //     setIsLoading(true);
  //     const formDataToSubmit = new FormData();
  
  //     // Append all form fields
  //     Object.keys(formData).forEach((key) => {
  //       if (key !== "photo") {
  //         formDataToSubmit.append(key, formData[key]);
  //       }
  //     });
  
  //     // Check if form data is correct before sending
  //     for (let pair of formDataToSubmit.entries()) {
  //       console.log(pair[0], pair[1]);
  //     }
  
  //     // Append each file in photo
  //     formData.photo.forEach((file) => {
  //       formDataToSubmit.append("photo", file);
  //     });
  
  //     try {
  //       const response = await axios.post(
  //         `${baseUrl}/api/ground/createGround`,
  //         formDataToSubmit,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //       console.log(response, "Create Ground Response");
  //       Swal.fire("Success", "Ground added successfully!", "success");
  //       // Reset form
  //       setFormData({
  //         name: "",
  //         location: "",
  //         country: "",
  //         state: "",
  //         city: "",
  //         stateDistrict: "",
  //         photo: [],
  //         description: "",
  //         ground_owner: "",
  //         user_id: "", // Reset user_id as well
  //       });
  //       setErrors({});
  //     } catch (error) {
  //       console.error(error.response);
  //       Swal.fire("Error", error.response.data.message || "Failed to add ground", "error");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };
//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   // Get user_id from local storage
//   const user_id = localStorage.getItem("user_id");
  
//   if (!user_id) {
//     alert("User not logged in!");
//     return;
//   }

//   // Add user_id to form data before submitting
//   setFormData((prevData) => ({
//     ...prevData,
//     user_id: user_id, // Ensure user_id is included
//   }));

//   if (validate()) {
//     setIsLoading(true);
//     const formDataToSubmit = new FormData();

//     // Append all form fields
//     Object.keys(formData).forEach((key) => {
//       if (key !== "photo") {
//         formDataToSubmit.append(key, formData[key]);
//       }
//     });

//     // Append each file in photo array
//     formData.photo.forEach((file) => {
//       formDataToSubmit.append("photo", file);
//     });

//     try {
//       const response = await axios.post(
//         `${baseUrl}/api/ground/createGround`,
//         formDataToSubmit,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log(response, "Create Ground Response");
//       Swal.fire("Success", "Ground added successfully!", "success");

//       // Reset form
//       setFormData({
//         name: "",
//         location: "",
//         country: "",
//         state: "",
//         city: "",
//         stateDistrict: "",
//         photo: [],
//         description: "",
//         ground_owner: "",
//         user_id: "", // Reset user_id
//       });
//       setErrors({});
//     } catch (error) {
//       console.error(error.response);
//       Swal.fire("Error", error.response.data.message || "Failed to add ground", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   }
// };
const handleSubmit = async (e) => {
  e.preventDefault();

  // Get user_id from local storage
  const user_id = localStorage.getItem("user_id");

  if (!user_id) {
    Swal.fire("Error", "User not logged in!", "error");
    return;
  }

  if (validate()) {
    setIsLoading(true);
    const formDataToSubmit = new FormData();

    // Append all form fields except "photo"
    Object.keys(formData).forEach((key) => {
      if (key !== "photo") {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    // Append user_id manually
    formDataToSubmit.append("user_id", user_id);

    // Append each file in the "photo" array
    formData.photo.forEach((file) => {
      formDataToSubmit.append("photo", file);
    });

    try {
      const response = await axios.post(
        `${baseUrl}/api/ground/createGround`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response, "Create Ground Response");
      Swal.fire("Success", "Ground added successfully!", "success");

      // Reset form fields after submission
      setFormData({
        name: "",
        location: "",
        country: "",
        state: "",
        city: "",
        stateDistrict: "",
        photo: [],
        description: "",
        ground_owner: "",
        user_id: "", // Reset user_id field
      });

      setErrors({});
    } catch (error) {
      console.error(error.response);
      Swal.fire("Error", error.response?.data?.message || "Failed to add ground", "error");
    } finally {
      setIsLoading(false);
    }
  }
};


  return (
    <section>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-5 col-md-12 col-sm-12" style={{ backgroundColor: "#006849" }}>
            <div className="d-flex justify-content-center">
              <img
                src={brandIocn}
                alt="Brand Icon"
                style={{ width: "100%", height: "200px", objectFit: "contain" }}
              />
            </div>
            <div className="d-flex align-items-center justify-content-center text-center mt-3">
              <h2><span className="text-light">Enroll your ground today</span> <span className="spanfont">and</span></h2>
            </div>
            <div>
            <CaptionText/>
            </div>
          </div>
          <div className="col-lg-7  col-md-12 col-sm-12" >
            <div className="container mt-5">
              <h2 className="text-center mb-4">Add Ground Details</h2>
              <form onSubmit={handleSubmit} className="row g-3">
                {/* Name */}
                <div className="col-md-6 ">
                  <label htmlFor="name" className="form-label">
                    Ground Name
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      id="name"
                      name="name"
                      placeholder="Enter your Ground Name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    <span className="input-group-text"><FaUser /></span>
                  </div>

                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="ground_owner" className="form-label">Ground Owner</label>
                  <input
                    type="text"
                    className={`form-control ${errors.ground_owner ? "is-invalid" : ""}`}
                    id="ground_owner"
                    name="ground_owner"
                    placeholder="Enter Owner Name"
                    value={formData.ground_owner}
                    onChange={handleInputChange}
                  />
                  {errors.ground_owner && <div className="invalid-feedback">{errors.ground_owner}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <select
                    className={`form-control ${errors.city ? "is-invalid" : ""}`}
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a city</option>
                    {indianCities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>

                  {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                </div>
                {/* Photo */}
                <div className="col-md-6">
                  <label htmlFor="photo" className="form-label">
                    Photo
                  </label>
                  <input
                    type="file"
                    multiple  // Allow multiple file selection
                    className={`form-control ${errors.photo ? "is-invalid" : ""}`}
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {errors.photo && <div className="invalid-feedback">{errors.photo}</div>}
                </div>

                {/* Description */}
                <div className="col-md-12">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? "is-invalid" : ""}`}
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>

                {/* Location */}
                <div className="col-md-6">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.location ? "is-invalid" : ""}`}
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                  {errors.location && (
                    <div className="invalid-feedback">{errors.location}</div>
                  )}
                </div>

                {/* Country */}
                <div className="col-md-6">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.country ? "is-invalid" : ""}`}
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                  {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                </div>

                {/* State */}
                <div className="col-md-6">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.state ? "is-invalid" : ""}`}
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                  {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                </div>



                {/* State District */}
                <div className="col-md-6">
                  <label htmlFor="stateDistrict" className="form-label">
                    State District
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.stateDistrict ? "is-invalid" : ""}`}
                    id="stateDistrict"
                    name="stateDistrict"
                    value={formData.stateDistrict}
                    onChange={handleInputChange}
                  />
                  {errors.stateDistrict && (
                    <div className="invalid-feedback">{errors.stateDistrict}</div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="col-12 text-center my-5">
                  <button type="submit" className="btn btn-lg btn-success w-50" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>

  );
};

export default CreateGroundForm;
