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

const BookDetailsModal = ({ showModal, handleCloseModal, selectedSlot, selectdate, ground_id }) => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const dispatch = useDispatch();
  const { baseUrl } = useBaseUrl();
  const modalRef = useRef(null); // Move this to the top, before any early return

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




  const cancelbookingHandler = async () => {
    const bookingData = bookingDetails?.data?.[0];
    console.log(bookingData, 'bookingData')
    const booking_id = bookingData?.book?.booking_id;
    const ground_id = bookingData.ground_id;
    console.log(booking_id, ground_id, 'canceldeleteparams');

    // Show a confirmation dialog first
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Once deleted, you won't be able to recover this booking!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    // If the user confirms the deletion
    if (result.isConfirmed) {
      try {
        // Dispatch the deletebooking action and await the result
        const deleteResult = await dispatch(deletebooking({ booking_id, ground_id }));

        if (deleteResult) {
        //  console.log(ground_id, selectdate, 'forcanceldisplay')
         // dispatch(fetchGroundDetails({ ground_id, date: selectdate }));
          cancelbookingHandler();

        }
        // If the deletion is successful, show a success alert
        if (deleteResult?.payload?.success) {

          Swal.fire({
            icon: 'success',
            title: 'Booking Deleted!',
            text: 'Your booking has been successfully deleted.',
          });

        } else {
          // If not successful, show an error alert
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: deleteResult?.payload?.message || 'An error occurred while deleting the booking.',
          });
        }
      } catch (error) {
        // Handle any errors that may occur during the deletebooking action
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.message || 'Failed to delete booking.',
        });
      }

    }
   
  };

  if (!bookingData) {
    return (
      // <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-labelledby="bookDetailsModalLabel" aria-hidden="true">
      //   <div className="modal-dialog">
      //     <div className="modal-content">
      //       <div className="modal-header">
      //         <h5 className="modal-title" id="bookDetailsModalLabel">Booking Details</h5>
      //         <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
      //       </div>
      //       <div className="modal-body">
      //         <p>{!bookingData ? 'booking may be deleted' : 'please refresh the page'}</p>
      //       </div>
      //       <div className="modal-footer">
      //         <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>Close</button>
      //       </div>
      //     </div>
      //   </div>
      // </div>
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



  // const CaptureandShare = async () => {
  //   if (modalRef.current && bookingData) {
  //     try {
  //       // (Optional) Capture modal content as an image
  //       // We capture the canvas if you need it for some other purpose,
  //       // but note: WhatsApp share links do not accept image data directly.
  //       const canvas = await html2canvas(modalRef.current);
  //       const imageData = canvas.toDataURL("image/png"); // This is just in case you need it

  //       // Extract details from your modal's data:
  //       const bookingId = bookingData.book.booking_id;
  //       const slots = convertSlotToTimeRange(bookingDetails.data[0].slots);
  //       const price = bookingData.book.price;
  //       const advance = bookingData.prepaid;
  //       const dueamount = price-advance;
  //       // Create a multi-line message with the booking details.
  //       // "\n" creates a new line.
  //       const message = `
  //         Thank you for Booking at ${bookingData.name}
  //         Booking Info:
  //         Booking ID: ${bookingId}
  //         Slots: ${slots}
  //         Price: ${price}/-
  //         Advance Paid: ${advance}/-
  //         Due Amount: ${dueamount}/-
  //     `;

  //       // Encode the message for URL inclusion.
  //       const whatsappMessage = encodeURIComponent(message);

  //       // Build the WhatsApp share URL with the text message.
  //       // Note: WhatsApp does not support sending the captured image directly.
  //       const whatsappURL = `https://wa.me/?text=${whatsappMessage}`;

  //       // Open the WhatsApp share link in a new tab
  //       window.open(whatsappURL, "_blank");
  //     } catch (error) {
  //       console.error("Error capturing or sharing the details:", error);
  //     }
  //   }
  // };

  const CaptureandShare = async () => {
    if (modalRef.current && bookingData) {
      try {
        // (Optional) Capture modal content as an image using html2canvas
        const canvas = await html2canvas(modalRef.current);
        const imageData = canvas.toDataURL("image/png"); // Captured image data (if needed)
  
        // Extract details from your modal's data:
        const bookingId = bookingData.book.booking_id;
        const slots = convertSlotToTimeRange(bookingDetails.data[0].slots);
        const price = bookingData.book.price;
        const advance = bookingData.prepaid;
        const dueAmount = price - advance;
        const date = bookingData.date;
        // Prepare the multi-line message with proper formatting.
        // \n inserts a new line in the message.
        const message = `Thank you  ${bookingData.name}  for booking!
      
  
  Booking Info:
  --------------------------
  Booking ID     : ${bookingId}
  Date           : ${date}
  Slots          : ${slots}
  Price          : ₹${price}/-
  Advance Paid   : ₹${advance}/-
  Due Amount     : ₹${dueAmount}/-
  --------------------------`;
  
        // Encode the message for URL inclusion.
        const whatsappMessage = encodeURIComponent(message);
  
        // Set the dynamic phone number (e.g., bookingData.mobile should contain the number in international format without the '+' sign)
        const phoneNumber = bookingData.mobile; // Ensure this is formatted as required: e.g. "919876543210"
  
        // Build the WhatsApp share URL with the dynamic number and the text message.
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
              <div className="card-body" style={{border:"0.75px solid black"}}>
                <div className="d-flex my-2">
                  <div>
                    <p>{bookingData.book.booking_id}</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between my-1">
                  <div>
                    <p><FaRegCalendarAlt size={20} className="me-1 text-secondary" />{selectdate}</p>
                  </div>
                  <div>
                    <p> <FaRegClock size={20} className="me-1 text-secondary" />{convertSlotToTimeRange(bookingDetails?.data[0]?.slots)}</p>
                  </div>
                </div>

                <div className='d-flex justify-content-between my-1'>
                  <div>
                    <p><FaUser size={20} className="me-1 text-secondary" />{bookingData.name}</p>
                  </div>
                  <div>
                    <p><a href={`tel:${bookingData.mobile}`} className="text-decoration-underline text-dark"><FaPhoneAlt size={20} className="me-1 text-secondary" />{bookingData.mobile}</a></p>
                  </div>

                </div>

                <div className='d-flex justify-content-between my-1'>
                  <div>
                    <p style={{padding:"0px"}}>Amount  <FaRupeeSign />{bookingData.book.price}/-</p>
                    {/* <span  onClick={handleEditAmount}><a className="text-decoration-underline text-dark cursor-pointer">Edit Amount</a></span> */}
                    <button className="btn btn-sm btn-success btn-sm  me-2" onClick={handleEditAmount}>Edit Amount
                    </button>
                  </div>
                  

                </div>
                <div className='d-flex justify-content-between'>
                <div className='my-2'>
                     {/* WhatsApp Share Button */}
                     <button className="btn btn-success btn-sm" onClick={CaptureandShare}>Share on WhatsApp <FaWhatsapp size={20} color="#25D366" /></button>
                  </div>
                  <div>
                    <button className='btn btn-sm btn-danger' onClick={cancelbookingHandler}>Cancel</button>

                  </div>
                </div>
                {/* <button className="btn btn-primary" onClick={CaptureandShare}>Share on WhatsApp</button> */}

              </div>
            </div>
          </div>
          <div className="modal-footer" style={{ backgroundColor: "#006849" }}>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>Close</button>
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
