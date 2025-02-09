import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import UserGrounds from "./UserGrounds";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CartButtons from "../Buttons/CartButtons";
import BookModal from "../Modals/BookModal";
import { fetchGroundDetails } from '../../redux/features/groundSlice';
import { useBaseUrl } from "../../Contexts/BaseUrlContext";
import { useDispatch, useSelector } from "react-redux";
import BookDetailsModal from "../Modals/BookDetailsModal";
import { Groundslots } from "../../helpers/Groundslots";
import convertSlotToTimeRange from "../../helpers/ConvertSlotToTimeRange";
import { formatDate } from "../../helpers/FormatDate";
import { calculateCurrentTime } from "../../helpers/CalucateCurrentTime";
import { FaSpinner } from "react-icons/fa";
const ViewGround = () => {
  const { gid } = useParams();
  const { ground, loading, error } = useSelector((state) => state.ground);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clickedslot, setClickedslot] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  useEffect(() => {
    if (gid) {
      const formattedDate = selectedDate
        ? selectedDate.toISOString().split('T')[0] // Get only the date part (YYYY-MM-DD)
        : null;
      console.log(formattedDate, selectedDate, 'isodate')
      dispatch(fetchGroundDetails({ gid, date: formattedDate }));
    }
  }, [gid, selectedDate]);
  const { baseUrl } = useBaseUrl();
  const dispatch = useDispatch();

  // Example function to format slot
  const formatSlot = (slot) => {

    return slot; // Example: return formatted slot
  };

  const bookedslotsbydate = ground?.slots?.booked?.map(formatSlot) || [];

  const availableSlots = Groundslots
    .filter((slot) => !bookedslotsbydate.includes(slot.slot))
    .map((slot) => slot.slot);

  const handleSlotClick = (slot) => {
    const numericSlot = parseFloat(slot); // Convert slot to number
    const selectedNumericSlots = selectedSlots.map(parseFloat).sort((a, b) => a - b); // Sort selected slots

    if (selectedSlots.includes(slot)) {
      // Allow deselecting only the last selected slot to maintain sequence
      if (numericSlot === selectedNumericSlots[selectedNumericSlots.length - 1]) {
        setSelectedSlots(selectedSlots.filter((s) => s !== slot));
      }
    } else {
      // Ensure sequential selection
      if (
        selectedNumericSlots.length === 0 || // First slot can be selected freely
        numericSlot === selectedNumericSlots[selectedNumericSlots.length - 1] + 0.5 // Must be next in sequence
      ) {
        setSelectedSlots([...selectedSlots, slot]);
      } else {
        // **SweetAlert2 for better UI**
        Swal.fire({
          icon: "warning",
          title: "Invalid Selection",
          text: "Please select slots in sequential order!",
          confirmButtonColor: "#006849", // Match your theme
          confirmButtonText: "OK",
        });
      }
    }
  };
  const confirnnowClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedSlots([]);
  };

  const handleOpenModal = (slot) => {
    setClickedslot(slot); // Set the selected slot
    setShowBookingModal(true); // Open the modal
  };

  const handleClosebookingModal = () => {
    setShowBookingModal(false); // Close the modal
    setClickedslot(null); // Reset selected slot
  };
  /////Get booking details////
  if (loading) {
    return (
      <div className="loading-container d-flex justify-content-center align-items-center my-5">
        <FaSpinner className="spinner-icon" style={{ fontSize: "50px", color: "grey", animation: "spin 1s infinite" }} />
        <p className="loading-text">Fetching Ground Details...</p>
      </div>
    );
  }
  return (
    <section className="viewcardbg">
      <div className="selectdatesection">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div >
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
                  style={{ width: "500px" }}
                />
              </div>
              {/* <div>
                    <UserGrounds/>
                  </div> */}
            </div>
          </div>
          <div>
            <p>
              <strong>Selected Date: </strong>
              {formatDate(selectedDate)}
            </p>
          </div>
        </div>
      </div>
      <div className="container-fluid pt-3">
        {/* Available Slots Section */}
        <div className="Carticon d-sm-none d-flex justify-content-center mt-2">
          <CartButtons onClick={confirnnowClick} />
        </div>

        <div className="row">
          <div className="col-lg-9 col-sm-12 col-md-12">
            <div
              className="d-flex  justify-content-evenly justify-content-md-start flex-wrap mb-3" style={{ backgroundColor: "#006849" }}
            >
              <div>
                <h6 className="teritoryFont text-light text-center mt-3">
                  Available Slots:
                </h6>
                {/* <ul className="list-unstyled d-flex flex-wrap flex-column flex-sm-row slotboxes">
                 
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                      <li key={index} className="listbox m-1">
                        <button
                          className={`btn ${bookedslotsbydate.includes(slot)
                              ? "btn-danger" // Booked slots shown in red
                              : selectedSlots.includes(slot)
                                ? "btn-success" // Selected slots shown in green
                                : "btn-primary" // Available slots shown in blue
                            } btn-sm availablebtn`}
                          onClick={() => handleSlotClick(slot)}
                          disabled={
                            // Disable booked slots
                            bookedslotsbydate.includes(slot) ||
                            // Disable past time slots
                            (new Date(selectedDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0) &&
                              parseFloat(slot) < calculateCurrentTime(selectedDate)) ||
                            // Disable slots for past dates
                            new Date(selectedDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                          }
                        >
                          {convertSlotToTimeRange(slot)}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="teritoryFont">No available slots</li>
                  )}

                </ul> */}
                {/* <ul className="list-unstyled d-flex flex-wrap flex-column flex-sm-row slotboxes">
  {availableSlots.length > 0 ? (
    availableSlots
      .filter((slot) => {
        const selectedDateObj = new Date(selectedDate).setHours(0, 0, 0, 0);
        const todayObj = new Date().setHours(0, 0, 0, 0);

        // If the selected date is today, remove past slots
        if (selectedDateObj === todayObj) {
          return parseFloat(slot) >= calculateCurrentTime(selectedDate);
        }
        return true; // Keep all slots for future and past dates (they will be disabled)
      })
      .map((slot, index) => (
        <li key={index} className="listbox m-1">
          <button
            className={`btn ${
              bookedslotsbydate.includes(slot)
                ? "btn-danger" // Booked slots shown in red
                : selectedSlots.includes(slot)
                ? "btn-success" // Selected slots shown in green
                : "btn-primary" // Available slots shown in blue
            } btn-sm availablebtn`}
            onClick={() => handleSlotClick(slot)}
            disabled={
              bookedslotsbydate.includes(slot) || // Disable booked slots
              new Date(selectedDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) // Disable all slots for past dates
            }
          >
            {convertSlotToTimeRange(slot)}
          </button>
        </li>
      ))
  ) : (
    <li className="teritoryFont">No available slots</li>
  )}
</ul> */}
                <ul className="list-unstyled d-flex flex-wrap flex-column flex-sm-row slotboxes">
                  {availableSlots.length > 0 ? (
                    availableSlots
                      .filter((slot) => {
                        const selectedDateObj = new Date(selectedDate).setHours(0, 0, 0, 0);
                        const todayObj = new Date().setHours(0, 0, 0, 0);

                        // Remove all slots for past dates
                        if (selectedDateObj < todayObj) return false;

                        // If the selected date is today, remove past slots
                        if (selectedDateObj === todayObj) {
                          return parseFloat(slot) >= calculateCurrentTime(selectedDate);
                        }

                        return true; // Keep slots for today (future slots) and future dates
                      })
                      .map((slot, index) => (
                        <li key={index} className="listbox m-1">
                          <button
                            className={`btn ${bookedslotsbydate.includes(slot)
                                ? "btn-danger" // Booked slots shown in red
                                : selectedSlots.includes(slot)
                                  ? "btn-success" // Selected slots shown in green
                                  : "btn-primary" // Available slots shown in blue
                              } btn-sm availablebtn`}
                            onClick={() => handleSlotClick(slot)}
                          >
                            {convertSlotToTimeRange(slot)}
                          </button>
                        </li>
                      ))
                  ) : (
                    <li className="teritoryFont">No available slots</li>
                  )}
                </ul>

              </div>
              <div className="mt-sm-3 d-flex ">
                <div className="text-center">
                  <h6 className="text-light mt-3 text-center">Booked Slots:</h6>
                  <ul className="list-unstyled d-flex flex-wrap flex-column flex-sm-row text-center slotboxes">
                    {bookedslotsbydate.length > 0 ? (
                      bookedslotsbydate.map((slot, index) => (
                        <li key={index} className="listbox m-1 text-center" >
                          <button
                            type="button"
                            className="btn btn-danger btn-sm availablebtn"
                            onClick={() => handleOpenModal(slot)}
                          >
                            {convertSlotToTimeRange(slot)}
                            {/* Format if needed */}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="text-danger text-center nobookedslots m-1">
                        No booked slots
                      </li>
                    )}
                  </ul>
                </div>
              </div>

            </div>
          </div>
          <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 col-xlg-6 g-0  ">
            <div className="card shadow-lg border-0 w-80 rounded secondaryColor viewcardFont  mx-auto ">
              <div className="mobileconfirmnow Carticon  d-flex justify-content-center my-3">
                {selectedSlots.length > 0 && <CartButtons onClick={confirnnowClick} count={selectedSlots} />}
              </div>
              <div className="d-flex justify-content-center">
                <img
                  src={`${baseUrl}/uploads/${ground?.data?.image[0]}`}
                  className="card-img-top ground-image img-fluid my-3"
                  //alt={name || "Ground Image"}
                  style={{ width: '300px', height: '200px' }}
                />
              </div>
              <div className="card-body text-center">
                <h5 className="card-title">{ground?.name}</h5>
                <h6 className="card-subtitle mb-2 viewcardFont">
                  Location: {ground?.location}
                </h6>
                <p className="card-text viewcardFont">{ground?.data?.desc}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Modal */}
      </div>
      <section>
        <div className="container">

        </div>
      </section>
      {/* Modal for Booking Confirmation */}
      <BookModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        selectedSlots={selectedSlots}
        selectdate={formatDate(selectedDate)}
        setSelectedSlots={setSelectedSlots}
      />
      {/****************Book details************* */}
      <BookDetailsModal
        showModal={showBookingModal}
        handleCloseModal={handleClosebookingModal}
        selectedSlot={clickedslot} // Pass selected slot to modal
        selectdate={formatDate(selectedDate)}
        ground_id={gid}
      />
    </section>
  );
};

export default ViewGround;
