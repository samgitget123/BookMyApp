import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,  // Change this from ObjectId to String to accept UUIDs
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    phone_number: {
      type: String,
      required: [true, 'Please add a phone number'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
    userFlag: {
      type: Boolean,
      default: false, // true means allowed to log in, true means restricted
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
