import mongoose from 'mongoose';

const groundSchema = new mongoose.Schema(
  {
    ground_id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'GND' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    stateDistrict: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: [String], // Array of image URLs
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    slots: {
      type: Object, // Changed from Map to Object
      default: {}, // Default empty object
    },
    ground_owner: {
      type: String,
      required: true,
    },
    user_id: { 
      type: String,  // Changed to String to match UUID format
      required: true ,
      ref: 'User', 
    },
  },
  { timestamps: true }
);

const Ground = mongoose.model('Ground', groundSchema);
export default Ground;
