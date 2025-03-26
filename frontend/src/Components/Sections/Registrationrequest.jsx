import React, { useState } from "react";
import axios from "axios";
import { AiOutlineDownload, AiOutlineUpload } from "react-icons/ai";
import { useBaseUrl } from "../../Contexts/BaseUrlContext";
const Registrationrequest = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
 const { baseUrl } = useBaseUrl();
  // 📌 Handle File Download
  const handleDownload = () => {
    axios({
      url: `${baseUrl}/download-template`,  // Adjust URL based on backend
      method: "GET",
      responseType: "blob", // Important to download as a file
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Registration_Template.xlsx");
      document.body.appendChild(link);
      link.click();
    });
  };

  // 📌 Handle File Upload
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${baseUrl}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("File submission failed.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h3 className="text-center mb-3">Request & Submit Registration Form</h3>

        {/* 📌 Download Button */}
        <button className="btn btn-primary w-100 mb-3" onClick={handleDownload}>
          <AiOutlineDownload size={20} /> Download Form
        </button>

        {/* 📌 Upload Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Upload Completed Form:</label>
            <input type="file" className="form-control" onChange={handleFileChange} accept=".xlsx" />
          </div>
          <button type="submit" className="btn btn-success w-100">
            <AiOutlineUpload size={20} /> Submit Form
          </button>
        </form>

        {/* 📌 Status Message */}
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default Registrationrequest;
