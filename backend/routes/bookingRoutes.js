import express from "express";
const router = express.Router();

import { bookingGround , getBookings , getBookingDetailsBySlot , deleteBookingDetailsById, updateBookingPrice , getAllBookings, searchBookings, getBookingsByDate, getAllBookingsbygid, updatePaymentStatus} from "../controllers/bookingController.js";

router.route('/book-slot').post(bookingGround);
router.route('/getbookingdetails').get(getBookings);
router.route('/bookdetails').get(getBookingDetailsBySlot);
router.route('/deletebooking').delete(deleteBookingDetailsById);
router.route('/updateprice').put(updateBookingPrice);
router.route('/getallbookings').get(getAllBookings); 
router.route('/getallbookingsbydate').get(getBookingsByDate);
router.route('/search').get(searchBookings);
router.route('/getallbooking').get(getAllBookingsbygid); //bookings by user_id
router.route('/updatepaymentstatus').put(updatePaymentStatus);
export default router;
