import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
      try {
        const response = await axios.post("http://localhost:5000/api/user/loginUser", userData);
        console.log(response, 'reduxauthresponse');
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
    }
  );
  

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, error: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
