import { createSlice } from "@reduxjs/toolkit";
import {baseUrl} from "./baseUrlendpoint";
const initialState = {
  ground_id: "",
  bookingdetails: {
    date: "",
    slots: [],
  },
};
console.log(baseUrl, 'reduxurl')
const bookingSlice = createSlice({
  name: "bookingdetails",
  initialState,
  reducers: {
    // Action to store booking details
    setBookingData: (state, action) => {
      const { ground_id, date, slots } = action.payload;
      state.ground_id = ground_id;
      state.bookingdetails = {
        date: date || state.bookingdetails.date,  // If date is provided, update, else retain current value
        slots: slots || state.bookingdetails.slots,  // If slots are provided, update, else retain current value
        isbooked: "booked"
      };
    },

    // Action to reset booking details (optional)
    resetBookingData: (state) => {
      state.ground_id = "";
      state.bookingdetails = {
        date: "",
        slots: [],
        
      };
    },
  },
});

export const { setBookingData, resetBookingData } = bookingSlice.actions;

export default bookingSlice.reducer;
