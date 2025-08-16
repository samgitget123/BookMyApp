import React, { useState, useEffect } from "react";
import axios from "axios";
import { useBaseUrl } from "../Contexts/BaseUrlContext";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-bootstrap/Modal';
import { Line, Pie } from "react-chartjs-2";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
        <button className="btn btn-success ms‑3" onClick={() => { setSearch(""); filterByDate(); }}>Reset</button>
      </div>

      {/* Summary */}
      <div className="mb-3 d-flex flex-wrap">
        <p className="me-4">Today's Slots: <strong>{totalSlots}</strong></p>
        <p className="me-4">Today's Revenue: ₹{totalAmount}</p>
        <p>Monthly Revenue: ₹{monthlyAmount}</p>
      </div>

     

      {/* Download and Table */}
      <button className="btn btn-success mb-3" onClick={() => {/* use your XLSX exporter */}}>Download Excel</button>

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
                        onChange={e => {/* update payment status logic */}}
                        className="form-select form-select-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td><button className="btn btn-sm btn-primary" onClick={() => {/* view modal */}}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
       {/* Line Chart */}
      <div className="mb-4">
        <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false }}}} />
      </div>
    </div>
  );
};

export default AdminDashboard;
