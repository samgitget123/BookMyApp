import React, { useEffect, useState } from "react";
import axios from "axios";
import { useBaseUrl } from "../Contexts/BaseUrlContext";
import * as XLSX from "xlsx"; // Import the XLSX library
import { deletebooking } from "../redux/features/cancelbookingSlice";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for the date picker
import Modal from 'react-bootstrap/Modal'; // Import the Bootstrap Modal
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {

  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBookings, setFilteredBookings] = useState(bookings);
  const { baseUrl } = useBaseUrl();
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date()); // State to hold the selected date
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedBooking, setSelectedBooking] = useState(null); // State to hold selected booking for modal
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const dispatch = useDispatch();
    const navigate = useNavigate();
  //http://localhost:5000/api/booking/updatepaymentstatus
  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);


  useEffect(() => {
    if (debouncedSearch) {
      handleSearch(debouncedSearch);
    } else {
      filterByDate(); // Apply date filter when search is cleared
    }
    setCurrentPage(1); // Reset pagination
  }, [debouncedSearch, bookings]);

  useEffect(() => {
    // Filter bookings based on the selected date
    if (selectedDate) {
      const filteredByDate = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date);
        // Compare day, month, and year
        return (
          bookingDate.getDate() === selectedDate.getDate() &&
          bookingDate.getMonth() === selectedDate.getMonth() &&
          bookingDate.getFullYear() === selectedDate.getFullYear()
        );
      });
      setFilteredBookings(filteredByDate);
    } else {
      setFilteredBookings(bookings); // Reset to all bookings if no date is selected
    }
  }, [selectedDate, bookings]);

  const fetchBookings = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const uid = await localStorage.getItem('user_id');
      console.log(uid, 'user_id of user')
      //http://localhost:5000/api/booking/getallbooking?ground_id=GNDALG9XQDOA
      //const response = await axios.get(`${baseUrl}/api/booking/getallbookings`);
      if (uid) {
        const response = await axios.get(`${baseUrl}/api/booking/getallbooking?user_id=${uid}`);
        if (response.data.success && Array.isArray(response.data.data)) {
          setBookings(response.data.data);
          setFilteredBookings(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      }

    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };


  const handleSearch = (searchTerm) => {
    const lowercasedSearchTerm = searchTerm.trim().toLowerCase();

    if (!lowercasedSearchTerm) {
      filterByDate(); // Apply date filter when search is cleared
      return;
    }

    const filteredResults = bookings.filter((item) => {
      const mobileString = item.mobile ? item.mobile.toString() : '';
      return (
        item._id?.toLowerCase().includes(lowercasedSearchTerm) ||
        item.ground_id?.toLowerCase().includes(lowercasedSearchTerm) ||
        item.name?.toLowerCase().includes(lowercasedSearchTerm) ||
        mobileString.includes(lowercasedSearchTerm)
      );
    });

    setFilteredBookings(filteredResults);
  };

  // Function to filter bookings by date
  const filterByDate = () => {
    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const dateFilteredResults = bookings.filter((item) => item.date === today);
    setFilteredBookings(dateFilteredResults);
  };
  // Pagination Logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  console.log(currentBookings, 'currentbooking')
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  const handleDownloadExcel = () => {
    if (!selectedDate) {
      alert("Please select a date!");
      return;
    }

    const selected = new Date(selectedDate);
    const firstDayOfMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);

    // Filter bookings from the 1st of the month to the selected date
    const filteredData = bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= firstDayOfMonth && bookingDate <= selected;
    });

    if (filteredData.length === 0) {
      alert("No bookings found in this date range!");
      return;
    }

    // Sort data by Date first, then by Slot (assuming slots are numeric or sortable strings)
    const sortedData = filteredData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA - dateB !== 0) {
        return dateA - dateB; // Sort by Date
      }

      return a.slots - b.slots; // Sort by Time (assuming numeric slot values)
    });

    // Calculate total amount from all filtered bookings
    const totalAmount = sortedData.reduce((sum, booking) => sum + (booking.book ? booking.book.price : 0), 0);

    // Convert data to worksheet format
    const wsData = sortedData.map(booking => ({
      "Booking ID": booking.book.booking_id,
      "Ground Id": booking.ground_id,
      "Name": booking.name,
      "Date": booking.date,
      "Time": convertSlotToTimeRange(booking.slots),
      "Mobile": booking.mobile,
      "Advance": booking.prepaid,
      "Amount": booking.book.price,
      "Status": booking.paymentStatus === 'success' ? 'paid' : 'pending'
    }));
    // paymentStatus: newStatus === "paid" ? "success" : "pending",
    // Add a total row at the end
    wsData.push({
      "Booking ID": "Total",
      "Ground Id": "",
      "Name": "",
      "Date": "",
      "Time": "",
      "Mobile": "",
      "Advance": "",
      "Amount": totalAmount,  // Display total amount here
      "Status": ""
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);

    // Add worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");

    // Set column widths for better display
    const wscols = [
      { wch: 15 }, // "Booking ID"
      { wch: 10 }, // "Ground ID"
      { wch: 20 }, // "Name"
      { wch: 12 }, // "Date"
      { wch: 15 }, // "Time"
      { wch: 15 }, // "Mobile"
      { wch: 10 }, // "Advance"
      { wch: 12 }, // "Amount"
      { wch: 15 }, // "Status"
    ];
    ws["!cols"] = wscols;

    // Generate file name dynamically
    const fileName = `Bookings_${firstDayOfMonth.toISOString().split('T')[0]}_to_${selected.toISOString().split('T')[0]}.xlsx`;

    // Write the Excel file
    XLSX.writeFile(wb, fileName);
  };


  const deleteId = (booking_id, ground_id) => {
    dispatch(deletebooking({ booking_id, ground_id }));
  };


  const resetDateFilter = () => {
    const currentDate = new Date(); // Get the current date
    setSelectedDate(currentDate); // Set selected date to today's date
    setFilteredBookings(bookings); // Show all bookings again
  };

  // Open modal with booking details
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };


  // Safely destructure the result

  const getSummary = () => {
    if (!selectedDate) {
      return { totalSlots: 0, totalAmount: 0, monthlyAmount: 0 };
    }

    const selectedDateStr = selectedDate.toISOString().split("T")[0];

    // Get first and last day of the selected month
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999);
    // Filter bookings for the selected date
    const selectedDateBookings = bookings.filter(booking => booking.date.split("T")[0] === selectedDateStr);

    // Filter bookings for the entire month
    const monthlyBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= firstDayOfMonth && bookingDate <= lastDayOfMonth;
    });

    // Calculate totals
    const totalSlots = selectedDateBookings.reduce((total, booking) => total + booking?.slots.length, 0);
    const totalAmount = selectedDateBookings.reduce((total, booking) => total + (booking.book ? booking.book.price : 0), 0);
    const monthlyAmount = monthlyBookings.reduce((total, booking) => total + (booking.book ? booking.book.price : 0), 0);

    return { totalSlots, totalAmount, monthlyAmount };
  };

  // Get the updated summary
  const { totalSlots, totalAmount, monthlyAmount } = getSummary();


  //const { totalSlots, totalAmount, monthlyAmount } = getTodaySummary();
  //update payment status

  const handlePaymentStatusChange = async (bookingId, newStatus) => {
    console.log(bookingId, newStatus, 'paymentstatus-------')
    try {
      const response = await fetch(`${baseUrl}/api/booking/updatepaymentstatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking_id: bookingId,
          paymentStatus: newStatus === "paid" ? "success" : "pending",
        }),
      });

      if (response.ok) {
        // Update state immediately to reflect UI changes
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.book.booking_id === bookingId
              ? { ...booking, paymentStatus: newStatus === "paid" ? "success" : "pending" }
              : booking
          )
        );
      } else {
        console.error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };
//////User Management///////
const gotoUsermanagemnt = ()=> {
  navigate('/userManagement');
}
///check is user a superadmin////
const isSuperAdmin = localStorage.getItem('role') === 'superadmin';
  return (
    <div className="container mt-4">
      <h4 className="mb-3">Admin Dashboard - <span style={{ color: "#198754" }}>Booking Details</span></h4>

      {/* Search Box */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Booking ID, Ground Name, or User Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Date Picker and Reset Button */}
      <div className="mb-3 d-sm-flex align-items-center">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            if (date) {
              setSelectedDate(date);
            }
          }}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="form-control"
        />
        <button
          className="btn btn-success ms-3"
          onClick={resetDateFilter}
        >
          Reset
        </button>
        <div className="ms-4">
          <div className="d-flex justify-content-space evenly flex-wrap">
            <div className="mx-3 mt-2">
              <p>Today's Slots: <strong>{totalSlots}</strong></p>
            </div>
            <div className="mt-2">
              <p>Total Amount: <strong>₹{totalAmount}</strong></p>
            </div>
            <div className="mx-3 mt-2">
              <p>Monthly Amount: <strong>₹{monthlyAmount}</strong></p>
              <p className="text-muted" style={{ fontSize: "12px" }}>
                <i>Note: Monthly amount is consolidated from the 1st to the last day of the selected month.</i>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Download Excel Button */}
      <div className="mb-3 d-flex">
        <button className="btn btn-success me-3" onClick={handleDownloadExcel}>Download Excel</button>
      {isSuperAdmin ? (<button className="btn btn-success" onClick={gotoUsermanagemnt}>User Management</button>):('')}  
      </div>
      <p className="text-muted" style={{ fontSize: "12px" }}>
        <i>Note: The report includes data from the 1st of the current month up to the selected date.</i>
      </p>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="table-responsive">
          {currentBookings.length === 0 ? (
            <div className="text-center my-4">
              <p>No data found</p>
            </div>
          ) : (

            <table className="table table-sm table-striped table-bordered">
              <thead className="table-dark">
                <tr className="text-center">
                
                  <th>Booking ID</th>
                  <th>Username</th>
                  <th>Time</th>
                  <th>Mobile</th>
                  <th>Advance</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => (
                  <tr key={booking._id} className="text-center">
                    <td>{booking.book.booking_id}</td>
                    <td>{booking.name}</td>
                    <td>{booking.date}</td>
                    <td>{convertSlotToTimeRange(booking.slots)}</td>
                    <td>{booking.mobile}</td>
                    <td>{booking.prepaid}</td>
                    <td>{booking.book.price}</td>
                    <td>
                      <select
                        value={booking.paymentStatus === "success" ? "paid" : "pending"}
                        onChange={(e) => handlePaymentStatusChange(booking.book.booking_id, e.target.value)}
                        className="form-select form-select-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-success btn-sm" onClick={() => handleViewBooking(booking)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredBookings.length > 0 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => paginate(index + 1)} style={{ backgroundColor: "green" }}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Modal for Viewing Booking Details */}

      {selectedBooking && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton style={{ backgroundColor: "#006849", padding: "10px" }}>
            <Modal.Title className="text-light">Booking Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <div className="row">
                {/* Left Column */}
                <div className="col-6">
                  <p><strong>Booking ID:</strong> {selectedBooking._id}</p>
                  <p><strong>Ground ID:</strong> {selectedBooking.ground_id}</p>
                  <p><strong>Name:</strong> {selectedBooking.name}</p>
                  <p><strong>Date:</strong> {selectedBooking.date}</p>
                </div>

                {/* Right Column */}
                <div className="col-6">
                  <p><strong>Time:</strong> {convertSlotToTimeRange(selectedBooking.slots)}</p> 
                  <p><strong>Mobile:</strong> {selectedBooking.mobile}</p>
                  <p><strong>Status:</strong> {selectedBooking.paymentStatus == 'success' ? 'paid' : 'pending'}</p>
                  <p><strong>Price:</strong> ₹{selectedBooking.book.price}</p>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#006849", padding: "10px" }}>
            <button className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
          </Modal.Footer>
        </Modal>

      )}
    </div>
  );
};

export default AdminDashboard;
