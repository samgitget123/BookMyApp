import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "./baseUrlendpoint";

//const baseUrl = `https://bookmyground.onrender.com`; // Update this for production
//https://bookingapp-r0fo.onrender.com
//http://localhost:5000
export const updateprice = createAsyncThunk(
  "updateprice/updatedata",
  async ({ booking_id, newAmount, combopack }) => {
    try {
      const response = await fetch(`${baseUrl}/api/booking/updateprice`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id,  // ✅ Correct
          newPrice: newAmount,  // 🔄 Fix newAmount -> newPrice
          comboPack: combopack,  // 🔄 Fix combopack -> comboPack
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the price");
      }

      const data = await response.json();
      console.log("Updated Price Response:", data); // ✅ Debugging
      return data;
    } catch (error) {
      console.error("Error in updateprice:", error); // ✅ Debugging
      throw new Error(error.message);
    }
  }
);

// Initial state for the slice
const initialState = {
  updateStatus: {},
  loading: false,
  error: null,
};

// Create slice
const updatePriceSlice = createSlice({
  name: "updatePrice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateprice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateprice.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatus = action.payload;
      })
      .addCase(updateprice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export reducer
export default updatePriceSlice.reducer;
