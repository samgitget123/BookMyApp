import {configureStore} from '@reduxjs/toolkit';
import userlocationReducer  from './redux/features/userlocationSlice';
import fetchgroundReducer from './redux/features/fetchgroundSlice';
import cancelbookReducer from './redux/features/cancelbookingSlice';
import groundReducer from './redux/features/groundSlice';
import bookingReducer from './redux/features/bookingSlice';
import updatepriceReducer from './redux/features/updatepriceSlice';
export const store = configureStore({
    reducer: {
        userLocation: userlocationReducer,
        fetchGrounds: fetchgroundReducer,
        ground:  groundReducer,
        bookingdetails: bookingReducer,
        cancelBooking: cancelbookReducer,
        updatePrice: updatepriceReducer,
    },
})