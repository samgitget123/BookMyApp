import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userLocation : {}
}

export const userlocationSlice = createSlice({
    name: "userLocation",
    initialState,
    reducers:{
        getUserlocation: (state, action) => {
            state.userLocation = action.payload; // Store user address in Redux
          },
    }
})

export const {getUserlocation} = userlocationSlice.actions;
export default userlocationSlice.reducer;