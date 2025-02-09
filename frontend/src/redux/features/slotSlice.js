import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groundslots: [
    { id: "1", slot: "6.0", status: "available" },
    { id: "2", slot: "6.5", status: "available" },
    { id: "3", slot: "7.0", status: "available" },
    { id: "4", slot: "7.5", status: "available" },
    { id: "5", slot: "8.0", status: "available" },
    { id: "6", slot: "8.5", status: "available" },
    { id: "7", slot: "9.0", status: "available" },
    { id: "8", slot: "9.5", status: "available" },
    { id: "9", slot: "10.0", status: "available" },
    { id: "10", slot: "10.5", status: "available" },
    { id: "11", slot: "11.0", status: "available" },
    { id: "12", slot: "11.5", status: "available" },
    { id: "13", slot: "12.0", status: "available" },
    { id: "14", slot: "12.5", status: "available" },
    { id: "15", slot: "13.0", status: "available" },
    { id: "16", slot: "13.5", status: "available" },
    { id: "17", slot: "14.0", status: "available" },
    { id: "18", slot: "14.5", status: "available" },
    { id: "19", slot: "15.0", status: "available" },
    { id: "20", slot: "15.5", status: "available" },
    { id: "21", slot: "16.0", status: "available" },
    { id: "22", slot: "16.5", status: "available" },
    { id: "23", slot: "17.0", status: "available" },
    { id: "24", slot: "17.5", status: "available" },
    { id: "25", slot: "18.0", status: "available" },
    { id: "26", slot: "18.5", status: "available" },
    { id: "27", slot: "19.0", status: "available" },
    { id: "28", slot: "19.5", status: "available" },
    { id: "29", slot: "20.0", status: "available" },
    { id: "30", slot: "20.5", status: "available" },
    { id: "31", slot: "21.0", status: "available" },
    { id: "32", slot: "21.5", status: "available" },
    { id: "33", slot: "22.0", status: "available" },
    { id: "34", slot: "22.5", status: "available" },
    { id: "35", slot: "23.0", status: "available" },
    { id: "36", slot: "23.5", status: "available" },
    { id: "37", slot: "24.0", status: "available" },
    { id: "38", slot: "24.5", status: "available" },
    { id: "39", slot: "25.0", status: "available" },
    { id: "40", slot: "25.5", status: "available" },
    { id: "41", slot: "26.0", status: "available" },
    { id: "42", slot: "26.5", status: "available" }
  ]
};

const groundSlice = createSlice({
  name: "groundslot",
  initialState,
  reducers: {
    availableslots: (state)=>{
    }
  }
});


export {availableslots} from slotSlice.actions;
export default slotSlice.reducers;

