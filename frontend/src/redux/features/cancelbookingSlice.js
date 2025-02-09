import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "./baseUrlendpoint";
//const baseUrl = `https://bookmyground.onrender.com`; // Update this for production
//https://bookingapp-r0fo.onrender.com
//http://localhost:5000
// Define the deletebooking async thunk
export const deletebooking = createAsyncThunk(
  "deletebooking/deletedata",
  async ({ booking_id, ground_id }) => {
  
    try {

      const response = await fetch(
        `${baseUrl}/api/booking/deletebooking?booking_id=${booking_id}&ground_id=${ground_id}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
      const data = await response.json();
      console.log(data, 'cancelbooking');
      return data; // Return the fetched data
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Initial state for the slice
const initialState = {
  bookingStatus: {},
  loading: false,
  error: null,
};

// Create slice
const cancelbookSlice = createSlice({
  name: "cancelBooking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deletebooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletebooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingStatus = action.payload;
      })
      .addCase(deletebooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export reducer
export default cancelbookSlice.reducer;
