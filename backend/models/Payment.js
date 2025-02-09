import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    payment_id: {
      type: String,
      required: true,
      unique: true,
      default: () =>
        "PAY" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    },
    booking_id: {
      type: String,
      required: true,
      ref: "Booking", // Reference to the Booking model
    },
    ground_id: {
      type: String,
      required: true,
      ref: "Ground", // Reference to the Ground model
    },
    razorpay_order_id: {
      type: String, // Razorpay order ID
      required: true,
    },
    razorpay_payment_id: {
      type: String, // Razorpay payment ID
    },
    razorpay_signature: {
      type: String, // Razorpay signature for payment verification
    },
    amount: {
      type: Number, // Payment amount in rupees
      required: true,
    },
    currency: {
      type: String,
      default: "INR", // Default currency is Indian Rupee
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String, // Payment method like "UPI", "Card", etc.
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt fields
);

// Middleware to update the `updated_at` field
paymentSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// Export the model
const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
