import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert
import html2canvas from "html2canvas";
import { useBaseUrl } from '../../Contexts/BaseUrlContext';
import { useDispatch } from 'react-redux';
import { deletebooking } from '../../redux/features/cancelbookingSlice';
import { fetchGroundDetails } from '../../redux/features/groundSlice';
import { updateprice } from '../../redux/features/updatepriceSlice';
import { FaSpinner } from "react-icons/fa";
import { FaUser, FaPhoneAlt, FaRegCalendarAlt, FaRegClock, FaRupeeSign, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const BookDetailsModal = ({ showModal, handleCloseModal, selectedSlot, selectdate, ground_id , ground_name, lat,long}) => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const dispatch = useDispatch();
  const { baseUrl } = useBaseUrl();
  const modalRef = useRef(null); // Move this to the top, before any early return
  const navigate = useNavigate();

  useEffect(() => {
    // This will run every time the modal opens (showModal is true) or the params change
    if (!showModal) return; // Don't run the effect if the modal isn't visible
    const getBookingDetails = async (ground_id, selectdate, selectedSlot) => {
      const url = `${baseUrl}/api/booking/bookdetails?ground_id=${ground_id}&date=${selectdate}&slot=${selectedSlot}`;
      console.log(url, 'slotapi')
      try {
        const response = await axios.get(url);
        setBookingDetails(response.data); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    // Ensure all required params are available before making the API call
    if (ground_id && selectdate && selectedSlot) {
      getBookingDetails(ground_id, selectdate, selectedSlot);
    }

  }, [showModal, ground_id, selectdate, selectedSlot, showEditModal]); // Dependencies: this effect will run on these values' changes

  if (!showModal) return null; // Don't render the modal if showModal is false

  // Safely access the data
  const bookingData = bookingDetails?.data?.[0];
  const handleEditAmount = () => {
    setNewAmount(bookingData?.book?.price || ""); // Set current amount in input
    setShowEditModal(true);
    //alert(`new amount: ${newAmount}`)
  };
  const updateHandler = async () => {
    const bookingData = bookingDetails?.data?.[0];

    if (!newAmount || !bookingData?.book?.booking_id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please provide a valid amount to update.',
      });
      return;
    }

    try {
      // Dispatch the updateprice action with required payload
      const response = await dispatch(updateprice({
        booking_id: bookingData?.book?.booking_id,
        newAmount: parseInt(newAmount, 10), // Ensure it's a number
        comboPack: false, // Default value, modify if needed
      }));

      // Handle response
      if (response.payload?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Amount Updated!',
          text: 'The booking price has been successfully updated.',
        });

        setShowEditModal(false); // Close the modal
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.payload?.message || 'Failed to update the booking price.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update the price.',
      });
    }

  };


 
  const fetchgroundslots = async (gid, date) => {
    try {
      const response = await axios.get(`${baseUrl}/api/ground/${gid}?date=${date}`);
      return response.data || {};
    } catch (error) {
      console.error('Failed to fetch ground details:', error.response?.data || error.message);
    }
  };
  const sendCancellationMessage = (customerName, phoneNumber, bookingData) => {
    if (!phoneNumber || !bookingData) {
      console.error("Missing phone number or booking details.");
      return;
    }

    const { date, slots, book } = bookingData;
    const bookingId = book?.booking_id;
    const formattedSlots = convertSlotToTimeRange(slots);

    // Clean and structured cancellation message
    const cancelMessage = `*Booking Cancellation Notice*
  ────────────────────────
   *Booking ID:* ${bookingId}  
   *Date:* ${date}  
   *Slots:* ${formattedSlots}  
  ────────────────────────
  
  Dear *${customerName}*,  
  We regret to inform you that your booking has been *cancelled*.
  
  For any queries, feel free to contact us.
  ${ground_name}.`;
    // Encode the message for WhatsApp
    const whatsappMessage = encodeURIComponent(cancelMessage);

    // Construct the WhatsApp URL
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

    // Open WhatsApp link in a new tab
    window.open(whatsappURL, "_blank");
  };



  const cancelbookingHandler = async () => {
    const bookingData = bookingDetails?.data?.[0];
    if (!bookingData) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Booking details not found.",
      });
      return;
    }

    const bookingId = bookingData?.book?.booking_id;
    const groundId = bookingData.ground_id;
    const customerName = bookingData.name;
    const phoneNumber = bookingData.mobile;

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Once cancelled, you won't be able to recover this booking!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!result.isConfirmed) return;

    try {
      // Dispatch delete action and wait for result
      const deleteResult = await dispatch(deletebooking({ booking_id: bookingId, ground_id: groundId }));

      if (deleteResult?.payload?.success) {
        Swal.fire({
          icon: "success",
          title: "Booking Cancelled!",
          text: "The booking has been successfully cancelled.",
        });

        sendCancellationMessage(customerName, phoneNumber, bookingData);

      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: deleteResult?.payload?.message || "An error occurred while cancelling the booking.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to cancel booking.",
      });
    }
  };


  if (!bookingData) {
    return (

      <div className="loading-container d-flex justify-content-center align-items-center my-5">
        <FaSpinner className="spinner-icon" style={{ fontSize: "50px", color: "grey", animation: "spin 1s infinite" }} />
        <p className="loading-text">Fetching Ground Details...</p>
      </div>
    );
  }



  const convertSlotToTimeRange = (slot) => {
    console.log("Slot received in convertSlotToTimeRange:", slot); // Debugging

    if (!Array.isArray(slot) || slot.length === 0) {
      console.error("Unexpected slot format:", slot);
      return "Invalid Slot";
    }

    // Convert slot values to numbers
    let startSlot = parseFloat(slot[0]);  // First slot
    let endSlot = parseFloat(slot[slot.length - 1]) + 0.5;  // Last slot + 30 min to complete range

    if (isNaN(startSlot) || isNaN(endSlot)) {
      console.error("Invalid numeric slot values:", slot);
      return "Invalid Slot";
    }

    // Function to format time
    const convertToTime = (timeSlot) => {
      const hour = Math.floor(timeSlot);
      const minutes = timeSlot % 1 === 0 ? "00" : "30";
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

      return `${formattedHour}:${minutes} ${period}`;
    };

    return `${convertToTime(startSlot)} - ${convertToTime(endSlot)}`;
  };





  const CaptureandShare = async () => {
    if (modalRef.current && bookingData) {
      try {
        // Extract details from your modal's data:
        const bookingId = bookingData.book.booking_id;
        const slots = convertSlotToTimeRange(bookingDetails.data[0].slots);
        const price = bookingData.book.price;
        const advance = bookingData.prepaid;
        const dueAmount = price - advance;
        const date = bookingData.date;
        const customerName = bookingData.name;
        const phoneNumber = bookingData.mobile; // Ensure this is formatted as required: e.g., "919876543210"
        const latitude = lat;
        const longitude = long;
   
        const groundLocationURL = `https://www.google.com/maps?q=${longitude},${latitude}`;

        const message = `*🎉 Booking Confirmation 🎉*
        ────────────────────────
        🔹 *Booking ID:* ${bookingId}  
        📅 *Date:* ${date}  
        🕒 *Slots:* ${slots}  
        💰 *Price:* ₹${price}/-  
        💸 *Advance Paid:* ₹${advance}/-  
        💳 *Due Amount:* ₹${dueAmount}/-  
        ────────────────────────
        Dear ${customerName},
        Thank you for booking with us!,
        📍 *Ground Location:* ${groundLocationURL}

        Best Regards,
        ${ground_name}`;

        // Encode the message for URL inclusion
         // Encode the message for WhatsApp URL
      const whatsappMessage = encodeURIComponent(message);
        // Build the WhatsApp share URL with the dynamic number and the text message
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

        // Open the WhatsApp share link in a new tab
        window.open(whatsappURL, "_blank");
      } catch (error) {
        console.error("Error capturing or sharing the details:", error);
      }
    }
  };

  return (
    <div className="modal fade show custom-backdrop" style={{ display: "block" }} tabIndex="-1" aria-labelledby="bookDetailsModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" ref={modalRef}>
          <div className="modal-header" style={{ backgroundColor: "#006849" }}>
            <h5 className="modal-title text-light" id="bookDetailsModalLabel">Booking Details</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
          <div className="card">
  <div className="card-body">
    {/* Booking ID */}
    <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
      <p className="mb-0 fw-bold">Booking ID: {bookingData.book.booking_id}</p>
    </div>

    {/* Date & Time */}
    <div className="d-flex justify-content-between my-3">
      <div className="d-flex align-items-center gap-2">
        <FaRegCalendarAlt size={18} color="#006849" />
        <span>{selectdate}</span>
      </div>
      <div className="d-flex align-items-center gap-2">
        <FaRegClock size={18} color="#006849" />
        <span>{convertSlotToTimeRange(bookingDetails?.data[0]?.slots)}</span>
      </div>
    </div>

    {/* User Name & Mobile */}
    <div className="d-flex justify-content-between my-3">
      <div className="d-flex align-items-center gap-2">
        <FaUser size={18} color="#006849" />
        <span>{bookingData.name}</span>
      </div>
      <div className="d-flex align-items-center gap-2">
        <FaPhoneAlt size={18} color="#006849" />
        <a href={`tel:${bookingData.mobile}`} className="text-decoration-none text-dark fw-bold">
          {bookingData.mobile}
        </a>
      </div>
    </div>

    {/* Amount Section */}
    <div className="d-flex justify-content-between align-items-center my-3 border-bottom pb-2">
      <p className="mb-0 fw-bold">
        Amount: <FaRupeeSign />{bookingData.book.price}/-
      </p>
      <button className="btn btn-sm btn-success" onClick={handleEditAmount}>
        Edit Amount
      </button>
    </div>

    {/* Buttons Section */}
    <div className="d-flex justify-content-between mt-3">
      <button className="btn btn-success btn-sm d-flex align-items-center" onClick={CaptureandShare}>
        Share on WhatsApp <FaWhatsapp size={18} className="ms-2" />
      </button>
      <button className="btn btn-danger btn-sm" onClick={cancelbookingHandler}>
        Cancel
      </button>
    </div>
  </div>
</div>

          </div>
          <div className="modal-footer" style={{ backgroundColor: "#006849" }}>
            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleCloseModal}>Close</button>
          </div>

        </div>
      </div>
      {/* Edit Amount Modal */}
      {showEditModal && (
        <div className="modal fade show custom-backdrop" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content" >
              <div className="modal-header" style={{ backgroundColor: "#006849", padding: "10px" }}>
                <h5 className="modal-title text-light">Edit Amount</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <label>New Amount:</label>
                <input
                  type="number"
                  className="form-control mt-2"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
              </div>
              <div className="modal-footer" style={{ backgroundColor: "#006849" }}>
                <button className="btn btn-primary" onClick={updateHandler} >Save</button>
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>

  );
};

export default BookDetailsModal;
