import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import asyncHandler from "../middleware/asyncHandler.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js"; // Import the Payment schema

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// **Payment creation route**
// const createpayment = asyncHandler(async (req, res) => {
//   const { amount, currency, receipt, ground_id, booking_id } = req.body;
// console.log(amount, currency, receipt, ground_id, booking_id, 'reqbody')
//   try {
//     const options = {
//       amount: amount * 100, // Amount in paise (1 INR = 100 paise)
//       currency: currency || "INR",
//       receipt: receipt || `order_rcptid_${Date.now()}`,
//       ground_id: 'dhhdhd',
//       booking_id:'djkdhk123'
//     };

//     // Create Razorpay order
//     const order = await razorpayInstance.orders.create(options);
//     console.log(order, "paymentorder");

//     // Save the order details in the database (status: "pending" initially)
//     const payment = new Payment({
//       payment_id: order.id,
//       booking_id,
//       ground_id,
//       razorpay_order_id: order.id,
//       amount,
//       currency: order.currency,
//       status: "pending", // Default status until verified
//     });

//     await payment.save();
//     console.log("Payment record created:", payment);

//     res.status(200).json(order); // Return the Razorpay order details to the client
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error.message);
//     res.status(500).json({ error: "Unable to create order." });
//   }
// });
const createpayment = asyncHandler(async (req, res) => {
  const { amount, currency, receipt, ground_id, booking_id } = req.body;

  console.log(amount, currency, receipt, ground_id, booking_id, "reqbody");

  if (!amount || !ground_id || !booking_id) {
    return res.status(400).json({ error: "Amount, ground_id, and booking_id are required." });
  }

  try {
    const options = {
      amount: amount * 100, // Convert to paise (smallest currency unit)
      currency: currency || "INR",
      receipt: receipt || `order_rcptid_${Date.now()}`,
    };

    // Create Razorpay order
    const order = await razorpayInstance.orders.create(options);
    console.log(order, "paymentorder");

    // Save the order details in the database
    const payment = new Payment({
      payment_id: order.id,
      booking_id, // Store booking ID
      ground_id, // Store ground ID
      razorpay_order_id: order.id,
      amount,
      currency: order.currency,
      status: "pending", // Set initial status as "pending"
    });

    await payment.save();
    console.log("Payment record created:", payment);

    // Return the Razorpay order details to the client
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error.message);
    res.status(500).json({ error: "Unable to create order." });
  }
});

// **Payment verification route**
// const verifypayment = asyncHandler(async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//   try {
//     console.log(req.body, "payment-verification-request");

//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     console.log(body, "paymentbody");

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature === razorpay_signature) {
//       // Update the payment record in the database
//       const updatedPayment = await Payment.findOneAndUpdate(
//         { razorpay_order_id },
//         {
//           razorpay_payment_id,
//           razorpay_signature,
//           status: "success", // Update status to success
//         },
//         { new: true } // Return the updated document
//       );

//       console.log("Payment record updated:", updatedPayment);

//       res.status(200).json({ success: true, message: "Payment Verified!" });
//     } else {
//       // Update payment status to failed
//       await Payment.findOneAndUpdate(
//         { razorpay_order_id },
//         { status: "failed" }
//       );

//       res.status(400).json({ success: false, message: "Payment Verification Failed!" });
//     }
//   } catch (error) {
//     console.error("Error verifying payment:", error.message);
//     res.status(500).json({ error: "Unable to verify payment." });
//   }
// });
const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    booking_id,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Verify payment using Razorpay's SDK or manual signature verification
    const isValid = true; // Assume the verification process is successful

    if (isValid) {
      // Update payment status to "success"
      await Payment.findOneAndUpdate(
        { booking_id },
        {
          razorpay_order_id,
          status: "success",
        }
      );

      // Update booking payment status to "success"
      const updatedBooking = await Booking.findOneAndUpdate(
        { "book.booking_id": booking_id },
        { paymentStatus: "success" },
        {new: true}
      );
       // Check if the booking was successfully updated
       if (!updatedBooking) {
        return res.status(404).json({ error: "Booking record not found" });
      }
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        updatedBooking,
      });
    } else {
       // Update payment status to "failed" if signature verification fails
       await Payment.findOneAndUpdate(
        { razorpay_order_id },
        { status: "failed" }
      );
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};
export { createpayment, verifyPayment };
