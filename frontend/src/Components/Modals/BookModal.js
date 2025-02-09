import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { useBaseUrl } from "../../Contexts/BaseUrlContext";
import { fetchGroundDetails } from "../../redux/features/groundSlice";
import { useDispatch } from "react-redux";
import { FaUser, FaEnvelope, FaPhoneAlt, FaRegCalendarAlt, FaRegClock, FaRupeeSign, FaEdit, FaTrashAlt } from "react-icons/fa";

const BookModal = ({
  showModal,
  handleCloseModal,
  selectedSlots = [],
  selectdate,
  setSelectedSlots,
}) => {
  console.log(selectedSlots.length , 'no of slots')
  const { gid } = useParams();
  const [info, setInfo] = useState("");
  const [name, setName] = useState(""); // State for Name
  const [email, setEmail] = useState(""); // State for Email
  const [mobile, setMobile] = useState(""); // State for Mobile
  const [price, setPrice] = useState('');
  const [prepaid, setPrepaid] = useState("");  // Prepaid Amount
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [loading, setLoading] = useState(false)
  const { baseUrl } = useBaseUrl();
  const dispatch = useDispatch();
  const remainingAmount = price - prepaid;
  const handleBooking = async (gid, selectedSlots, selectdate) => {
    const user_id = localStorage.getItem("user_id");
   
    const result = await Swal.fire({
      title: "Confirm Booking",
      text: "Are you sure you want to book these slots?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
    });

    if (!result.isConfirmed) return; // Stop if the user cancels
    if (!user_id) {
      alert("User not logged in");
      return;
    }
    const bookingData = {
      user_id, 
      ground_id: gid,
      date: selectdate,
      slots: selectedSlots,
      name: name,   // Include name
      email: email, // Include email
      mobile: mobile, // Include mobile number
      price: price,
      prepaid,
      paymentStatus,
    };

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/booking/book-slot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
       // ✅ Check if API request was successful
    if (!response.ok) {
      Swal.fire({
        title: "Booking Failed",
        text: data.message || "An error occurred while booking. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }
      
    dispatch(fetchGroundDetails({ gid, date: selectdate }));
    setInfo('');
    setName('');
    setEmail('');
    setMobile('');
    //setSelectedSlots([]);
    setPrice('');
    setPaymentStatus("pending");
    Swal.fire({
      title: "Success!",
      text: "Your booking has been confirmed.",
      icon: "success",
      confirmButtonColor: "#006849",
    });
      
    } catch (error) {
      console.error("Error booking slot:", error);
    }finally {
      setLoading(false); // Hide spinner
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden"; // Disable scrolling when modal is open
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling when modal is closed
    }
  }, [showModal]);

  const formatslot = (selectedSlots) => {
    if (!Array.isArray(selectedSlots) || selectedSlots.length === 0) return "";

    const formatTime = (hours, minutes) => {
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      return `${formattedHours}:${minutes} ${period}`;
    };

    const firstSlot = String(selectedSlots[0]);
    const lastSlot = String(selectedSlots[selectedSlots.length - 1]);

    const isValidSlot = (slot) => /^(\d+(\.\d+)?)$/.test(slot);

    if (!isValidSlot(firstSlot) || !isValidSlot(lastSlot)) {
      console.error("Invalid slot format detected.");
      return "Invalid slot format";
    }

    const [startHours, startHalf] = firstSlot.split(".").map(Number);
    const startMinutes = startHalf === 0 ? "00" : "30";
    const startTime = formatTime(startHours, startMinutes);

    const [endHours, endHalf] = lastSlot.split(".").map(Number);
    const endTime = formatTime(
      endHours + (endHalf === 0 ? 0 : 1),
      endHalf === 0 ? "30" : "00"
    );

    return `${startTime} - ${endTime}`;
  };
  const handleAmountChange = (e) => {
    setPrice(e.target.value);
  };
  return (
    <>
      <div
        className={`modal fade ${showModal ? "show modal-animate" : ""}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content shadow-lg rounded-3">
            <div className="modal-header text-white" style={{ backgroundColor: "#006849" }}>
              <h5 className="modal-title" id="exampleModalLabel">
                Booking Your Slot
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body text-center">
              <div className="d-flex justify-content-between  my-2">
                <div>
                  <p><FaRegCalendarAlt size={20} className="me-1 text-dark" />{selectdate}</p>
                </div>
                <div>
                  <div>
                    {selectedSlots.length > 0 ? (
                      <span><FaRegClock size={20} className="me-1 text-dark" />{formatslot(selectedSlots)}</span>
                    ) : (
                      <span>No slots selected.</span>
                    )}
                  </div>
                </div>

              </div>


              {/* Input Fields for Name, Email, and Mobile */}
              <div className="my-3 input-group">
                <span className="input-group-text"><FaUser /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="my-3 input-group">
                <span className="input-group-text"><FaEnvelope /></span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="my-3 input-group">
                <span className="input-group-text"><FaPhoneAlt /></span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter your Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength={10}
                />
              </div>
              <div className="d-flex justify-content-start">
                <div className="input-group input-group-sm">
                  <span className="input-group-text" id="inputGroup-sizing-sm"><strong>Total Amount</strong></span>
                  <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value={price} onChange={handleAmountChange} />
                </div>
              </div>

               {/* Prepaid Amount Input */}
               <div className="my-3 input-group">
                <span className="input-group-text"><FaRupeeSign /></span>
                <input type="number" className="form-control" placeholder="Enter Prepaid Amount" value={prepaid} onChange={(e) => setPrepaid(Number(e.target.value))} />
              </div>
{/* Remaining Amount */}
<div className="d-flex justify-content-between my-3">
                <strong>Remaining Amount:</strong> <span><FaRupeeSign /> {remainingAmount}</span>
              </div>
              {/* Payment Status Selection */}
              <div className="text-start my-3">
                <strong>Payment Status:</strong>
                <div className="form-check">
                  <input className="form-check-input" type="radio" id="pending" value="pending" checked={paymentStatus === "pending"} onChange={() => setPaymentStatus("pending")} />
                  <label className="form-check-label" htmlFor="pending">Pending</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" id="success" value="success" checked={paymentStatus === "success"} onChange={() => setPaymentStatus("success")} />
                  <label className="form-check-label" htmlFor="success">Success</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" id="failed" value="failed" checked={paymentStatus === "failed"} onChange={() => setPaymentStatus("failed")} />
                  <label className="form-check-label" htmlFor="failed">Failed</label>
                </div>
              </div>

              {info && <div className="alert alert-success">{info}</div>}
              <p className="text-muted mt-2">
                Please review the details before confirming.
              </p>
            </div>
            <div className="modal-footer justify-content-between" style={{ backgroundColor: "#006849" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
             
              <button
                type="button"
                className="btn btn-primary"
                disabled={selectedSlots.length === 0 || !name || !email || !mobile}
                onClick={() => handleBooking(gid, selectedSlots, selectdate)}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default BookModal;
