// src/redux/groundSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from './baseUrlendpoint';
//const baseUrl = `https://bookmyground.onrender.com`; // Update this for production
//https://bookingapp-r0fo.onrender.com
//http://localhost:5000
const initialState = {
  ground: null,
  loading: false,
  error: null,
  date: "",
};

// Async thunk for fetching ground details by ID and date
export const fetchGroundDetails = createAsyncThunk(
  "ground/fetchGroundDetails",
  async ({ gid, date }, thunkAPI) => {
    
    try {
      const response = await axios.get(`${baseUrl}/api/ground/${gid}?date=${date}`);
      return response.data || {}; // Ensure it returns an object
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch ground details");
    }
  }
);


const groundSlice = createSlice({
  name: 'ground',
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroundDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroundDetails.fulfilled, (state, action) => {
        state.ground = action.payload;
        state.date = action.meta.arg.date; // Store selected date
        state.loading = false;
      })
      .addCase(fetchGroundDetails.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch ground details';
        state.loading = false;
      });
  },
});

export default groundSlice.reducer;
