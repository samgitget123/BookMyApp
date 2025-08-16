import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import UserGrounds from "./UserGrounds";
import { useParams, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { ground_name, lat, long } = location.state || {};
  const { gid } = useParams();
  const { ground, loading } = useSelector((state) => state.ground);
  const dispatch = useDispatch();
  const { baseUrl } = useBaseUrl();

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clickedslot, setClickedslot] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (gid) {
      const formattedDate = selectedDate
        ? selectedDate.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
        : null;
      dispatch(fetchGroundDetails({ gid, date: formattedDate }));
    }
  }, [gid, selectedDate]);

  const bookedslotsbydate = ground?.slots?.booked || [];

  const availableSlots = Groundslots
    .filter(slot => !bookedslotsbydate.includes(slot.slot))
    .map(slot => slot.slot);

  const handleSlotClick = (slot) => {
    const numericSlot = parseFloat(slot);
    const selectedNumericSlots = selectedSlots.map(parseFloat).sort((a, b) => a - b);

    if (selectedSlots.includes(slot)) {
      if (numericSlot === selectedNumericSlots[selectedNumericSlots.length - 1]) {
        setSelectedSlots(selectedSlots.filter(s => s !== slot));
      }
    } else {
      if (
        selectedNumericSlots.length === 0 ||
        numericSlot === selectedNumericSlots[selectedNumericSlots.length - 1] + 0.5
      ) {
        setSelectedSlots([...selectedSlots, slot]);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Invalid Selection",
          text: "Please select slots in sequential order!",
          confirmButtonColor: "#006849",
        });
      }
    }
  };

 const confirnnowClick = () => {
  const selectedDateObj = new Date(selectedDate).setHours(0, 0, 0, 0);
  const todayObj = new Date().setHours(0, 0, 0, 0);

  if (selectedDateObj < todayObj) {
    Swal.fire({
      icon: "warning",
      title: "Booking for Past Date",
      text: "Are you sure you want to proceed with booking slots for a previous date?",
      showCancelButton: true,
      confirmButtonText: "Yes, Proceed",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#006849",
    }).then((result) => {
      if (result.isConfirmed) {
        setShowModal(true);
      }
    });
  } else {
    setShowModal(true);
  }
};
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlots([]);
  };

  const handleOpenModal = (slot) => {
    setClickedslot(slot);
    setShowBookingModal(true);
  };

  const handleClosebookingModal = () => {
    setShowBookingModal(false);
    setClickedslot(null);
  };

  const isToday = () => {
    const selectedDateObj = new Date(selectedDate).setHours(0, 0, 0, 0);
    const todayObj = new Date().setHours(0, 0, 0, 0);
    return selectedDateObj === todayObj;
  };

  if (loading) {
    return (
      <div className="loading-container d-flex justify-content-center align-items-center my-5">
        <FaSpinner className="spinner-icon" style={{ fontSize: "50px", color: "grey", animation: "spin 1s infinite" }} />
        <p className="loading-text">Fetching Ground Details...</p>
      </div>
    );
  }

  return (
    <section>
      <div className="selectdatesection ">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  if (date) setSelectedDate(date);
                }}
                dateFormat="MMMM d, yyyy"
                className="form-control"
              />
              <p className="mt-2">
                <strong>Selected Date: </strong>{formatDate(selectedDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="viewcardbg">
        <div className="container-fluid p-3">
          <div className="Carticon d-sm-none d-flex justify-content-center mt-2">
            <CartButtons onClick={confirnnowClick} />
          </div>

          <div className="row">
            <div className="col-lg-9">
              <div className="d-flex p-2 justify-content-evenly justify-content-lg-center justify-content-md-start flex-wrap mb-3" style={{ backgroundColor: "#006849" }}>
                <div>
                  {availableSlots.length > 0 && (
                    <h6 className="teritoryFont text-light text-center mt-3">
                      Available Slots:
                    </h6>
                  )}

<ul className="list-unstyled d-flex flex-wrap flex-column flex-sm-row slotboxes">
  {availableSlots.length > 0 ? (
    availableSlots
      .map((slot, index) => {
        const selectedDateObj = new Date(selectedDate).setHours(0, 0, 0, 0);
        const todayObj = new Date().setHours(0, 0, 0, 0);
        const slotTime = parseFloat(slot);

        const isPastToday = selectedDateObj === todayObj && slotTime < calculateCurrentTime(selectedDate);
        const isPreviousDate = selectedDateObj < todayObj;

        if (isPastToday) return null; // Hide today's past slots

        const isSelected = selectedSlots.includes(slot);
        const isBooked = bookedslotsbydate.includes(slot);

        const slotLabel = convertSlotToTimeRange(slot);

        // Determine button class based on logic
        let btnClass = "btn-primary"; // default for today/future
        if (isBooked) {
          btnClass = "btn-danger";
        } else if (isPreviousDate && !isSelected) {
          btnClass = "btn-secondary"; // grey for unselected past slot
        } else if (isSelected) {
          btnClass = "btn-success"; // selected is shown as blue
        }

        return (
          <li key={index} className="listbox m-1">
            <button
              className={`btn btn-sm availablebtn ${btnClass}`}
              onClick={() => handleSlotClick(slot)}
            >
              {slotLabel}
            </button>
          </li>
        );
      })
  ) : (
    <li className="teritoryFont">No available slots</li>
  )}
</ul>
                </div>

                <div className="mt-sm-3 d-flex">
                  <div className="text-center">
                    <h6 className="text-light mt-3 text-center">Booked Slots:</h6>
                    <ul className="list-unstyled d-flex flex-wrap flex-column flex-sm-row text-center slotboxes">
                      {bookedslotsbydate.length > 0 ? (
                        bookedslotsbydate.map((slot, index) => (
                          <li key={index} className="listbox m-1 text-center">
                            <button
                              type="button"
                              className="btn btn-danger btn-sm availablebtn"
                              onClick={() => handleOpenModal(slot)}
                            >
                              {convertSlotToTimeRange(slot)}
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

            <div className="col-lg-3">
              <div className="card shadow-lg border-0 w-80 rounded secondaryColor viewcardFont mx-auto">
                <div className="mobileconfirmnow Carticon d-flex justify-content-center">
                  {selectedSlots.length > 0 && <CartButtons onClick={confirnnowClick} count={selectedSlots} />}
                </div>
                <div className="d-flex justify-content-center">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${ground?.data?.image[0]}`}
                    className="card-img-top ground-image img-fluid my-3"
                    style={{ width: '300px', height: '250px' }}
                  />
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">{ground?.name}</h5>
                  <h6 className="card-subtitle mb-2 viewcardFont">Location: {ground?.location}</h6>
                  <p className="card-text viewcardFont">{ground?.data?.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        selectedSlots={selectedSlots}
        selectdate={formatDate(selectedDate)}
        setSelectedSlots={setSelectedSlots}
      />

      {/* Slot Details Modal */}
      <BookDetailsModal
        showModal={showBookingModal}
        handleCloseModal={handleClosebookingModal}
        selectedSlot={clickedslot}
        selectdate={formatDate(selectedDate)}
        ground_id={gid}
        ground_name={ground_name}
        lat={lat}
        long={long}
      />
    </section>
  );
};

export default ViewGround;