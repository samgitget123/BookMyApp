import React, { useState, useEffect } from "react";
import axios from "axios";
import { useBaseUrl } from "../../Contexts/BaseUrlContext";
import { indianCities } from "../Data/CityData";
import Swal from "sweetalert2";
import { FaUser } from "react-icons/fa";
import brandIocn from "../../Images/bmgicondisplay.png";
import CaptionText from "./animations/CaptionText";
import { AiFillEye, AiFillEyeInvisible, AiOutlinePhone, AiOutlineUser } from 'react-icons/ai';
import { Link } from "react-router-dom";

const CreateGroundForm = () => {
  const { baseUrl } = useBaseUrl();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  console.log(baseUrl, 'baseurl')
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setError('');
  };
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    password: "",
    role: "",
    ground_name: "",
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

  // const validate = () => {
  //   const newErrors = {};

  //   if (!formData.name) newErrors.name = "Name is required.";
  //   if (!formData.phone) newErrors.phone = "phonenumber is required.";
  //   if (!formData.password) newErrors.password = "Password is required.";
  //   if (!formData.role) newErrors.role = "role is required.";
  //   if (!formData.ground_name) newErrors.ground_name = "ground name is required.";
  //   if (!formData.location) newErrors.location = "Location is required.";
  //   if (!formData.country) newErrors.country = "Country is required.";
  //   if (!formData.state) newErrors.state = "State is required.";
  //   if (!formData.stateDistrict) newErrors.stateDistrict = "State District is required.";
  //   if (!formData.city) newErrors.city = "City is required."; // Validation for city
  //   if (!formData.description) newErrors.description = "Description is required.";
  //   if (!formData.photo) newErrors.photo = "Photo is required.";
  //   if (!formData.ground_owner) newErrors.ground_owner = "Ground owner is required.";

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };
  // const validate = () => {
  //   console.log("Validating form..."); // Debugging
  //   const newErrors = {};

  //   if (!formData.name) {
  //     newErrors.name = "Name is required.";
  //     console.log("Validation Error: Name is missing");
  //   }
  //   if (!formData.phone_number) {
  //     newErrors.phone_number = "Phone number is required.";
  //     console.log("Validation Error: Phone number is missing");
  //   }
  //   if (!formData.password) {
  //     newErrors.password = "Password is required.";
  //     console.log("Validation Error: Password is missing");
  //   }
  //   if (!formData.role) {
  //     newErrors.role = "Role is required.";
  //     console.log("Validation Error: Role is missing");
  //   }
  //   if (!formData.ground_name) {
  //     newErrors.ground_name = "Ground name is required.";
  //     console.log("Validation Error: Ground name is missing");
  //   }
  //   if (!formData.location) {
  //     newErrors.location = "Location is required.";
  //     console.log("Validation Error: Location is missing");
  //   }
  //   if (!formData.country) {
  //     newErrors.country = "Country is required.";
  //     console.log("Validation Error: Country is missing");
  //   }
  //   if (!formData.state) {
  //     newErrors.state = "State is required.";
  //     console.log("Validation Error: State is missing");
  //   }
  //   if (!formData.stateDistrict) {
  //     newErrors.stateDistrict = "State District is required.";
  //     console.log("Validation Error: State District is missing");
  //   }
  //   if (!formData.city) {
  //     newErrors.city = "City is required.";
  //     console.log("Validation Error: City is missing");
  //   }
  //   if (!formData.role) {
  //     newErrors.role = "Role is required.";
  //     console.log("Validation Error: Role is missing");
  //   }
  //   if (!formData.description) {
  //     newErrors.description = "Description is required.";
  //     console.log("Validation Error: Description is missing");
  //   }

  //   if (!Array.isArray(formData.photo) || formData.photo.length === 0) {
  //     newErrors.photo = "Photo is required.";
  //     console.log("Validation Error: Photo is missing or not an array");
  //   }

  //   if (!formData.ground_owner) {
  //     newErrors.ground_owner = "Ground owner is required.";
  //     console.log("Validation Error: Ground owner is missing");
  //   }

  //   console.log(newErrors, "Errors Found"); // Debugging

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };
  const validate = () => {
    let errors = {};

    if (!formData.ground_name.trim()) {
      errors.ground_name = "Ground name is required";
    }
    if (!formData.ground_owner.trim()) {
      errors.ground_owner = "Ground owner name is required";
    }
    if (!formData.city) {
      errors.city = "Please select a city";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }
    if (!formData.country.trim()) {
      errors.country = "Country is required";
    }
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }
    if (!formData.stateDistrict.trim()) {
      errors.stateDistrict = "State District is required";
    }
    if (!formData.name.trim()) {
      errors.name = "Username is required";
    }
    if (!formData.phone_number.trim()) {
      errors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      errors.phone_number = "Phone number must be 10 digits";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
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

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     // Get user_id from local storage
  //     const user_id = localStorage.getItem("user_id");
  // console.log(user_id, 'user_id')
  //     if (!user_id) {
  //       Swal.fire("Error", "User not logged in!", "error");
  //       return;
  //     }

  //     if (validate()) {
  //       setIsLoading(true);
  //       const formDataToSubmit = new FormData();

  //       // Append all form fields except "photo"
  //       Object.keys(formData).forEach((key) => {
  //         if (key !== "photo") {
  //           formDataToSubmit.append(key, formData[key]);
  //         }
  //       });

  //       // Append user_id manually
  //       formDataToSubmit.append("user_id", user_id);

  //       // Append each file in the "photo" array
  //       formData.photo.forEach((file) => {
  //         formDataToSubmit.append("photo", file);
  //       });

  //       try {
  //         //http://localhost:5000/api/ground/cerateGroundUser
  //         ///api/ground/createGround
  //         const response = await axios.post(
  //           `${baseUrl}/api/ground/cerateGroundUser`,
  //           formDataToSubmit,
  //           {
  //             headers: {
  //               "Content-Type": "multipart/form-data",
  //             },
  //           }
  //         );

  //         console.log(response, "Create Ground Response");
  //         Swal.fire("Success", "Ground added successfully!", "success");

  //         // Reset form fields after submission
  //         setFormData({
  //           name: "",
  //           location: "",
  //           country: "",
  //           state: "",
  //           city: "",
  //           stateDistrict: "",
  //           photo: [],
  //           description: "",
  //           ground_owner: "",
  //           user_id: "", // Reset user_id field
  //           phone: "",
  //           password: ""
  //         });

  //         setErrors({});
  //       } catch (error) {
  //         console.error(error.response);
  //         Swal.fire("Error", error.response?.data?.message || "Failed to add ground", "error");
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Get user_id from local storage
  //   const user_id = localStorage.getItem("user_id");
  //   console.log(user_id, "Fetched user_id");

  //   if (!user_id) {
  //     Swal.fire("Error", "User not logged in!", "error");
  //     return;
  //   }

  //   // Ensure formData exists before validation
  //   if (!formData) {
  //     console.error("Form data is undefined!");
  //     return;
  //   }

  //   // Validate form
  //   const isValid = validate();
  //   console.log(isValid, "Validation Result");

  //   if (!isValid) {
  //     console.error("Validation failed, form not submitted.");
  //     return;
  //   }

  //   setIsLoading(true);
  //   const formDataToSubmit = new FormData();

  //   // Append all form fields except "photo"
  //   Object.keys(formData).forEach((key) => {
  //     if (key !== "photo") {
  //       formDataToSubmit.append(key, formData[key]);
  //     }
  //   });

  //   // Append user_id manually
  //   formDataToSubmit.append("user_id", user_id);

  //   // Append each file in the "photo" array
  //   if (Array.isArray(formData.photo)) {
  //     formData.photo.forEach((file) => {
  //       formDataToSubmit.append("photo", file);
  //     });
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${baseUrl}/api/ground/cerateGroundUser`,
  //       formDataToSubmit,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     console.log(response, "Create Ground Response");
  //     Swal.fire("Success", "Ground added successfully!", "success");

  //     // Reset form fields after submission
  //     setFormData({
  //       name: "",
  //       location: "",
  //       country: "",
  //       state: "",
  //       city: "",
  //       stateDistrict: "",
  //       photo: [],
  //       description: "",
  //       ground_owner: "",
  //       user_id: "",
  //       phone: "",
  //       password: ""
  //     });

  //     setErrors({});
  //   } catch (error) {
  //     console.error(error.response);
  //     Swal.fire("Error", error.response?.data?.message || "Failed to add ground", "error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Get user_id from local storage
  //   const user_id = localStorage.getItem("user_id");
  //   console.log(user_id, "Fetched user_id");

  //   if (!user_id) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "User not logged in!",
  //     });
  //     return;
  //   }

  //   // Ensure formData exists before validation
  //   if (!formData) {
  //     console.error("Form data is undefined!");
  //     return;
  //   }

  //   // Validate form
  //   const validationResult = validate();
  //   console.log(validationResult, "Validation Result");

  //   if (validationResult !== true) {
  //     let errorMessages = Object.values(validationResult).join("\n");

  //     Swal.fire({
  //       icon: "error",
  //       title: "Validation Errors",
  //       text: errorMessages,
  //     });

  //     return;
  //   }

  //   setIsLoading(true);
  //   const formDataToSubmit = new FormData();

  //   // Append all form fields except "photo"
  //   Object.keys(formData).forEach((key) => {
  //     if (key !== "photo") {
  //       formDataToSubmit.append(key, formData[key]);
  //     }
  //   });

  //   // Append user_id manually
  //   formDataToSubmit.append("user_id", user_id);

  //   // Append each file in the "photo" array
  //   if (Array.isArray(formData.photo)) {
  //     formData.photo.forEach((file) => {
  //       formDataToSubmit.append("photo", file);
  //     });
  //   }

  //   try {
  //     const response = await axios.post(
  //       //${baseUrl}/api/ground/cerateGroundUser
  //       `${baseUrl}/api/ground/cerateGroundUser`,
  //       formDataToSubmit,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     console.log(response, "Create Ground Response");
  //     Swal.fire({
  //       icon: "success",
  //       title: "Success",
  //       text: "Ground added successfully!",
  //     });

  //     // Reset form fields after submission
  //     setFormData({
  //       name: "",
  //       location: "",
  //       country: "",
  //       state: "",
  //       city: "",
  //       stateDistrict: "",
  //       photo: [],
  //       description: "",
  //       ground_owner: "",
  //       user_id: "",
  //       phone: "",
  //       password: "",
  //       ground_name:"",
  //       phone_number:""
  //     });

  //     setErrors({});
  //   } catch (error) {
  //     console.error(error.response);

  //     Swal.fire({
  //       icon: "error",
  //       title: "Submission Failed",
  //       text: error.response?.data?.message || "Failed to add ground",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get user_id from local storage
    const user_id = localStorage.getItem("user_id");
    console.log(user_id, "Fetched user_id");

    if (!user_id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User not logged in!",
      });
      return;
    }

    // Validate form
    const validationErrors = validate(); // This should return an object with error messages
    console.log(validationErrors, "Validation Errors");

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Show errors in the form fields

      // Display Swal alert with all errors
      let errorMessages = Object.values(validationErrors).join("\n");

      Swal.fire({
        icon: "error",
        title: "Validation Errors",
        html: `<ul style="text-align:left; color:red; font-size:14px;">${Object.values(validationErrors)
          .map((error) => `<li>${error}</li>`)
          .join("")}</ul>`,
      });

      return;
    }

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
    if (Array.isArray(formData.photo)) {
      formData.photo.forEach((file) => {
        formDataToSubmit.append("photo", file);
      });
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/ground/cerateGroundUser`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response, "Create Ground Response");
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Ground added successfully!",
      });

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
        user_id: "",
        phone: "",
        password: "",
      });

      setErrors({});
    } catch (error) {
      console.error(error.response);

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.message || "Failed to add ground",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating field: ${name} with value: ${value}`); // Debugging log
    setFormData((prev) => ({ ...prev, [name]: value }));
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
              <CaptionText />
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
                      className={`form-control ${errors.ground_name ? "is-invalid" : ""}`}
                      id="ground_name"
                      name="ground_name"
                      placeholder="Enter your Ground Name"
                      value={formData.ground_name}
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

                {/*****user login details */}

                {/* Name */}
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label">
                    Username
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter User name"
                    />
                    <span className="input-group-text bg-white border-0">
                      <AiOutlineUser size={20} />
                    </span>
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                </div>
                <div className="col-6">
                 
                  <select class="form-select" aria-label="Default select example"  name="role" onChange={handleChange} value={formData.role || ""}>
  <option selected>Select Role</option>
  <option value="admin">Admin</option>
  <option value="user">User</option>
</select>
                </div>

                {/* Phone Number */}
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className={`form-control ${errors.phone_number ? "is-invalid" : ""}`}
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="Enter User phone number"
                    />
                    <span className="input-group-text bg-white border-0">
                      <AiOutlinePhone size={20} />
                    </span>
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                </div>


                {/* Password */}
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter User password"
                    />
                    <span
                      className="input-group-text bg-white border-0"
                      style={{ cursor: "pointer" }}
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <AiFillEyeInvisible size={24} />
                      ) : (
                        <AiFillEye size={24} />
                      )}
                    </span>
                  </div>
                </div>

                {/* <div >
                  <label htmlFor="password" className="form-label text-light">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                    />
                    <span
                      className="input-group-text bg-white border-0"
                      style={{ cursor: "pointer" }}
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <AiFillEyeInvisible size={24} />
                      ) : (
                        <AiFillEye size={24} />
                      )}
                    </span>
                  </div>
                </div> */}

                {/* Submit Button */}
                <div className="col-12 text-center my-5">
                  <button type="submit" className="btn btn-lg btn-success w-50" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit"}
                  </button>
                </div>
                {message && (
                  <div className="mt-2 text-center text-light">
                    Registration successful!{" "}
                    <Link to="/" className="text-warning">
                      Login Now
                    </Link>
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>

  );
};

export default CreateGroundForm;
