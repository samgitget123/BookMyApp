import React, { useState, useEffect } from "react";
import axios from "axios";
import { useBaseUrl } from "../Contexts/BaseUrlContext";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import { deletebooking } from "../redux/features/cancelbookingSlice";
import { useDispatch } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
// import { Line, Pie, Bar } from "react-chartjs-2";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);


//ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { baseUrl } = useBaseUrl();
  const dispatch = useDispatch();
   const navigate = useNavigate();
  // Fetch bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const uid = localStorage.getItem("user_id");
      if (uid) {
        const resp = await axios.get(`${baseUrl}/api/booking/getallbooking?user_id=${uid}`);
        if (resp.data.success) {
          setBookings(resp.data.data);
          setFilteredBookings(resp.data.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Filter logic
  useEffect(() => {
    if (debouncedSearch) handleSearch(debouncedSearch);
    else filterByDate();
    // eslint-disable-next-line
  }, [debouncedSearch, bookings]);

  useEffect(() => {
    if (selectedDate) {
      const d = selectedDate;
      const filtered = bookings.filter(b => {
        const bd = new Date(b.date);
        return bd.getDate() === d.getDate() &&
               bd.getMonth() === d.getMonth() &&
               bd.getFullYear() === d.getFullYear();
      });
      setFilteredBookings(filtered);
    }
  }, [selectedDate, bookings]);

  const handleSearch = (term) => {
    const lower = term.trim().toLowerCase();
    const results = bookings.filter(item =>
      item._id.toLowerCase().includes(lower) ||
      item.ground_id.toLowerCase().includes(lower) ||
      item.name.toLowerCase().includes(lower) ||
      (item.mobile && item.mobile.includes(lower))
    );
    setFilteredBookings(results);
  };

  const filterByDate = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const filtered = bookings.filter(b => b.date.startsWith(todayStr));
    setFilteredBookings(filtered);
  };

  const convertSlotToTimeRange = (slotArr) => {
    if (!Array.isArray(slotArr) || slotArr.length === 0) return "Invalid Slot";
    const start = parseFloat(slotArr[0]);
    const end = parseFloat(slotArr[slotArr.length - 1]) + 0.5;
    const formatTime = t => {
      const hour = Math.floor(t);
      const min = t % 1 === 0 ? "00" : "30";
      const period = hour >= 12 ? "PM" : "AM";
      const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${display}:${min} ${period}`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const getSummary = () => {
    const selStr = selectedDate?.toISOString().split("T")[0];
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth()+1, 0, 23,59,59);
    const sdBookings = bookings.filter(b => b.date.startsWith(selStr));
    const moBookings = bookings.filter(b => {
      const d = new Date(b.date);
      return d >= firstDay && d <= lastDay;
    });
    const totalSlots = sdBookings.reduce((sum, b) => sum + (b.slots?.length || 0), 0);
    const totalAmount = sdBookings.reduce((sum, b) => sum + (b.book?.price || 0), 0);
    const monthlyAmount = moBookings.reduce((sum, b) => sum + (b.book?.price || 0), 0);
    return { totalSlots, totalAmount, monthlyAmount };
  };

  const { totalSlots, totalAmount, monthlyAmount } = getSummary();

  // Generate last 7 days revenue data
  const generateLast7 = () => {
    const today = new Date();
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const amount = bookings
        .filter(b => b.date.startsWith(dateStr))
        .reduce((sum, b) => sum + (b.book?.price || 0), 0);
      out.push({ label: d.toLocaleDateString('en-GB',{ day:'numeric', month:'short'}), amount });
    }
    return out;
  };
  const last7 = generateLast7();

  const chartData = {
    labels: last7.map(x => x.label),
    datasets: [{
      label: 'Revenue (₹)',
      data: last7.map(x => x.amount),
      fill: true,
      borderColor: "#006849",
      backgroundColor: "rgba(0,104,73,0.2)"
    }]
  };


  const revenueData = {
  labels: last7.map(x => x.label), // e.g., "12 Aug", "13 Aug"
  datasets: [
    {
        label: `Last Seven Days`,
      data: last7.map(x => x.amount), // already using amount
      backgroundColor: "rgba(0,104,73,0.7)",
      borderColor: "#006849",
      borderWidth: 2,
    },
  ],
};

//////////////////////////Power Bi///////////////////////
// Revenue by Ground (Top 5)
const getTopGroundsData = () => {
  const groundEarnings = {};

  bookings.forEach(b => {
    const id = b.ground_id;
    groundEarnings[id] = (groundEarnings[id] || 0) + (b.book?.price || 0);
  });

  // Convert to array and sort by revenue
  const sorted = Object.entries(groundEarnings)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // Top 5

  return {
    labels: sorted.map(([id]) => id),
    datasets: [{
      data: sorted.map(([, value]) => value),
      backgroundColor: [
        "#198754", "#28a745", "#20c997", "#6f42c1", "#fd7e14"
      ],
    }],
  };
};

const topGroundsData = getTopGroundsData();
  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredBookings.map(booking => ({
      "Booking ID": booking._id,
      // "Ground Id": booking.ground_id,
       "Date": booking.date,
      "Name": booking.name,
     "Amount": booking.book.price,
       "Advance": booking.prepaid,
      "Mobile": booking.mobile,
      "Status": booking.paymentStatus
    })));


    // Add worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");

    // Set cell width for better display
    const wscols = [
      { wch: 10 }, // Width of "Booking ID" column
      // { wch: 10 }, // Width of "Ground ID" column
         { wch: 12 }, // Width of "Date" column
      { wch: 20 }, // Width of "Name" column
    { wch: 20 }, // Width of "price" column
     { wch: 20 }, // Width of "Advance" column
      { wch: 15 }, // Width of "Mobile" column
      { wch: 12 }, // Width of "Status" column
    ];
    ws["!cols"] = wscols;

    // Write the Excel file
    XLSX.writeFile(wb, "Bookings.xlsx");
  };

  const deleteId = (booking_id, ground_id) => {
    dispatch(deletebooking({ booking_id, ground_id }));
  };

  // Reset the date filter to show all bookings
  // const resetDateFilter = () => {
  //   setSelectedDate(null);  // Reset selected date to null
  //   setFilteredBookings(bookings);  // Show all bookings again
  // };
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
      <h4>Admin Dashboard</h4>

      {/* Filters */}
      <div className="mb-3 d-flex align-items-center">
        <input
          className="form-control me-3"
          placeholder="Search by Booking ID, Ground, Name, Mobile"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <DatePicker
          selected={selectedDate}
          onChange={d => setSelectedDate(d)}
          dateFormat="yyyy-MM-dd"
          className="form-control"
        />
        <button className="btn btn-success ms‑3"   onClick={resetDateFilter}>Reset</button>
      </div>

      {/* Summary */}
      <div className="mb-3 d-flex flex-wrap">
        <p className="me-4">Today's Slots: <strong>{totalSlots}</strong></p>
        <p className="me-4">Today's Revenue: ₹{totalAmount}</p>
        <p>Monthly Revenue: ₹{monthlyAmount}</p>
      </div>

     

      {/* Download and Table */}
      <div className="mb-3 d-flex">
        <button className="btn btn-success me-3" onClick={handleDownloadExcel}>Download Excel</button>
      {isSuperAdmin ? (<button className="btn btn-success" onClick={gotoUsermanagemnt}>User Management</button>):('')}  
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        filteredBookings.length === 0 ? (
          <div className="text-center">No data found</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-dark text-center">
                <tr>
                  <th>Booking ID</th><th>Name</th><th>Date</th><th>Time</th>
                  <th>Mobile</th><th>Advance</th><th>Amount</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="text-center">
                    <td>{b.book.booking_id}</td>
                    <td>{b.name}</td>
                    <td>{b.date.split("T")[0]}</td>
                    <td>{convertSlotToTimeRange(b.slots)}</td>
                    <td>{b.mobile}</td>
                    <td>{b.prepaid}</td>
                    <td>{b.book.price}</td>
                    <td>
                      <select
                        value={b.paymentStatus==="success"?"paid":"pending"}
                         onChange={(e) => handlePaymentStatusChange(b.book.booking_id, e.target.value)}
                        className="form-select form-select-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => handleViewBooking(b)}>View</button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
       {/* Line Chart */}
      {/* <div className="mb-4">
        <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false }}}} />
      </div>
<div className="mb-4">
 <Bar data={revenueData} options={{ responsive: true }} />
</div> */}
<div className="row">
  {/* Line Chart */}
  <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
    <Line
      data={chartData}
      options={{ responsive: true, plugins: { legend: { display: false } } }}
    />
  </div>

  {/* Bar Chart */}
  <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
    <Bar
      data={revenueData}
      options={{ responsive: true, plugins: { legend: { display: false } } }}
    />
  </div>
</div>


          {/* Modal */}
            {selectedBooking && (
              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton style={{ backgroundColor: "#006849" }}>
                  <Modal.Title className="text-light">Booking Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="d-flex justify-content-between flex-wrap">
                    <div><p><strong>Booking ID:</strong> {selectedBooking.book.booking_id}</p></div>
                    <div> <p><strong>Ground ID:</strong> {selectedBooking.ground_id}</p></div>
                    
                  </div>
                  <div className="d-flex justify-content-between flex-wrap">
                  <div><p><strong>Name:</strong> {selectedBooking.name}</p></div>
                  <div><p><strong>Mobile:</strong> {selectedBooking.mobile}</p></div>
                  </div>
                  <div className="d-flex justify-content-between flex-wrap">
                  <div><p><strong>Date of booking:</strong> {selectedBooking.date}</p></div>
                 
                  <p><strong>Total price: </strong> {selectedBooking.book.price}</p>
                  </div>
                  <div>
                  <p><strong>Status:</strong> {selectedBooking.paymentStatus}</p>
                  </div>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: "#006849" }}>
                  <button className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                </Modal.Footer>
              </Modal>
            )}
    </div>
  );
};

export default AdminDashboard;
