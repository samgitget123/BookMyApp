import React from "react";
import { useLocation } from "react-router-dom";
import { useBaseUrl } from "../../Contexts/BaseUrlContext";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
const Payment = () => {
  const location = useLocation();
  const paymentdata = location.state; // Retrieve data from the state
  const minpay = paymentdata.data.price * 25/100
  console.log(minpay , "paymentdata");
  const selectedSlots = paymentdata.data.slots;
  const { baseUrl } = useBaseUrl();
  // Function to format a single slot
  const formatslot = (selectedSlots) => {
    if (!Array.isArray(selectedSlots) || selectedSlots.length === 0) return ""; // Ensure selectedSlots is a valid array

    // Function to format time from 24-hour to 12-hour with AM/PM
    const formatTime = (hours, minutes) => {
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      return `${formattedHours}:${minutes} ${period}`;
    };

    // Extract the first and last slots from the selectedSlots array
    const firstSlot = selectedSlots[0];
    const lastSlot = selectedSlots[selectedSlots.length - 1];

    // Get start time from the first slot
    const [startHours, startHalf] = firstSlot.split(".").map(Number);
    const startMinutes = startHalf === 0 ? "00" : "30";
    const startTime = formatTime(startHours, startMinutes);

    // Get end time from the last slot (end 30 minutes after the last slot)
    const [endHours, endHalf] = lastSlot.split(".").map(Number);
    const endTime = formatTime(
      endHours + (endHalf === 0 ? 0 : 1),
      endHalf === 0 ? "30" : "00"
    );

    // Return the formatted time range as one value
    return `${startTime} - ${endTime}`;
  };
////payment handler////
const handlePayment = async () => {
  try {
    // Create order on the backend
    const bookingId = uuidv4(); // Generate a unique booking ID
    const { data: order } = await axios.post(`${baseUrl}/api/payment/create-order`, {
      amount: minpay,
      currency: "INR",
      receipt: "1", 
      ground_id: paymentdata.data.ground_id, 
      booking_id: bookingId,

    });

    const options = {
      key: "rzp_test_kmCGsajN35PCCh", // Replace with your Razorpay Key ID
      amount: order.amount,
      currency: order.currency,
      name: "Ground Booking",
      description: "Payment for ground booking",
      order_id: order.id,
      handler: async (response) => {
        const verification = await axios.post(`${baseUrl}/api/payment/verify-payment`, {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verification.data.success) {
          alert("Payment Successful!");
        } else {
          alert("Payment Verification Failed!");
        }
      },
      prefill: {
        name: "User Name", // Replace with actual user name
        email: "user@example.com", // Replace with actual user email
        contact: "9876543210", // Replace with actual user contact number
      },
      theme: {
        color: "#006849", // Your preferred color
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Error during payment:", error);
    alert("Something went wrong. Please try again.");
  }
};
  return (
    <section className="d-flex justify-content-center">
      <div
        className="container p-3 mt-md-3 rounded overflow-auto"
        style={{
          backgroundColor: "#006849",
          maxHeight: "90vh", // Optional: restrict height for mobile
        }}
      >
        <div className="row">
          <div className="col-lg-5 col-md-12">
            <section className="text-white">
              <h2>Payment Overview</h2>
              <p>Make secure and fast payments for your ground bookings.</p>
              <p>
                <strong>Ground Name:</strong> {paymentdata.data.ground_id}
              </p>
              <p>
                <strong>Date:</strong> {paymentdata.data.date}
              </p>
              <p>
                <strong>Slot:</strong> {formatslot(paymentdata.data.slots)}
              </p>
              <p>
                <strong>Total Price:</strong> ₹ {paymentdata.data.price}
              </p>
              <p>
                <strong>Amount to be Paid as Advance: </strong> ₹ {minpay}
              </p>
            </section>
          </div>
          <div className="col-lg-7 col-md-12">
            <div className="d-flex justify-content-center">
              <div
                className="card payment-card shadow-lg w-100"
                style={{
                  maxWidth: "500px",
                  maxHeight: "80vh", // Optional: limit height for card
                  overflowY: "auto", // Enable scrolling inside card
                }}
              >
                <div className="card-header text-center bg-secondary text-white">
                  <h3>Payment Options</h3>
                </div>
                <div className="card-body">
                  <h5 className="text-center text-muted mb-3">
                    Choose a payment method
                  </h5>
                  <div className="mb-4">
                    <h6 className="text-muted">UPI Apps</h6>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-light w-100 mx-1">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/en/thumb/8/89/PhonePe-logo.png/1200px-PhonePe-logo.png"
                          alt="PhonePe"
                          style={{ width: "50px" }}
                        />
                        <br />
                        PhonePe
                      </button>
                      <button className="btn btn-light w-100 mx-1">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Google_Pay_%28GPay%29_Logo.svg/1200px-Google_Pay_%28GPay%29_Logo.svg.png"
                          alt="Google Pay"
                          style={{ width: "50px" }}
                        />
                        <br />
                        Google Pay
                      </button>
                      <button className="btn btn-light w-100 mx-1">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Paytm_logo.png/1200px-Paytm_logo.png"
                          alt="Paytm"
                          style={{ width: "50px" }}
                        />
                        <br />
                        Paytm
                      </button>
                    </div>
                  </div>
                  <hr />
                  <div className="mb-4">
                    <h6 className="text-muted">Debit/Credit Card</h6>
                    <form>
                      <div className="form-group mb-2">
                        <label htmlFor="cardNumber">Card Number</label>
                        <input
                          type="text"
                          id="cardNumber"
                          className="form-control"
                          placeholder="Enter your card number"
                          required
                        />
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-6">
                          <label htmlFor="expiryDate">Expiry Date</label>
                          <input
                            type="text"
                            id="expiryDate"
                            className="form-control"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="cvv">CVV</label>
                          <input
                            type="password"
                            id="cvv"
                            className="form-control"
                            placeholder="123"
                            maxLength="3"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group mb-2">
                        <label htmlFor="cardName">Cardholder Name</label>
                        <input
                          type="text"
                          id="cardName"
                          className="form-control"
                          placeholder="Enter your name"
                          required
                        />
                      </div>

                      <button type="submit" className="btn btn-primary w-100" onClick={handlePayment}>
                        Pay ₹{minpay}
                      </button>
                    </form>
                  </div>
                  <hr />
                  <div className="text-center">
                    <p className="text-muted">Secure payments with 256-bit SSL</p>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/SSL_certificate_logo.svg/1280px-SSL_certificate_logo.svg.png"
                      alt="SSL"
                      style={{ width: "80px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
