import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user_id: { type: String, required: true }, 
  ground_id: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
  },
  slots: {
    type: [String],
    required: true,
  },
  comboPack: {
    type: Boolean, // Indicates if the user selected the combo pack
    default: false,
  },
  book: {
    booking_id: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  prepaid: {
    type: Number, // Advance amount taken before full payment
    default: 0, // Default to 0 if no advance payment is made
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending", // Default payment status
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^[0-9]{10}$/.test(v), // Validate for a 10-digit phone number
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v), // Simple email validation
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
});

// Export the model
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
