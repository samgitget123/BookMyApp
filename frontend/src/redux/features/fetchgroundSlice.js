import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "./baseUrlendpoint";
//const baseUrl = `https://bookmyground.onrender.com`; // Update this for production
//https://bookingapp-r0fo.onrender.com
//http://localhost:5000
// Async thunk to fetch grounds data
export const fetchGrounds = createAsyncThunk(
  "fetchGrounds/fetchData",
  async ({ state, city, location }) => {
    const response = await fetch(
      `${baseUrl}/api/ground?state=${state}&city=${city}&location=${location}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch grounds");
    }
    const data = await response.json();
    return data; // Return the fetched data
  }
);

// Initial state for the slice
const initialState = {
  grounds: [],
  loading: false,
  error: null,
};

const fetchgroundSlice = createSlice({
  name: "fetchGrounds",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle pending state when API call is made
      .addCase(fetchGrounds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle success state when API call succeeds
      .addCase(fetchGrounds.fulfilled, (state, action) => {
        state.loading = false;
        state.grounds = action.payload; // Store the fetched grounds in the state
      })
      // Handle failure state when API call fails
      .addCase(fetchGrounds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Store the error message
      });
  },
});

export default fetchgroundSlice.reducer;
