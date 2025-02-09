import asyncHandler from "../middleware/asyncHandler.js";
import Booking from "../models/Booking.js";

import Ground from "../models/Ground.js";
import generateBookingID from "../Utils.js";

// const bookingGround = asyncHandler(async (req, res) => {
//   const {user_id, ground_id, date, slots, comboPack, name, mobile, email, price, prepaid } = req.body;
//   if (!user_id || typeof user_id !== "string") {
//     return res.status(400).json({ message: "User ID must be a valid string" });
//   }
//   if (!price || price <= 0) {
//     return res.status(400).json({ message: "Invalid total price provided" });
//   }
//   if (prepaid < 0 || prepaid > price) {
//     return res.status(400).json({ message: "Invalid prepaid amount" });
//   }

//   const bookingDateformat = new Date(date);
//   const bookingDate = bookingDateformat.toISOString().slice(0, 10); // 'YYYY-MM-DD'

//   const ground = await Ground.findOne({ ground_id });
//   if (!ground) {
//     return res.status(404).json({ message: "Ground not found" });
//   }

//   // Ensure the slots field is initialized if not present
//   if (!ground.slots) {
//     ground.slots = new Map();
//   }

//   // Access the slot for the selected date
//   let dateSlotEntry = ground.slots.get(bookingDate);

//   if (!dateSlotEntry) {
//     // If no slots exist for this date, initialize with an empty array
//     dateSlotEntry = { bookedSlots: [] };
//     ground.slots.set(bookingDate, dateSlotEntry);
//   }

//   // Check if any of the selected slots are already booked
//   const alreadyBooked = dateSlotEntry.bookedSlots.filter((slot) =>
//     slots.includes(slot)
//   );
// console.log(alreadyBooked , 'alreadybooked')
//   if (alreadyBooked.length > 0) {
//     return res.status(409).json({
//       message: "Some slots are already booked",
//       conflicts: alreadyBooked,
//     });
//   }

//   // Update the bookedSlots array with the selected slots
//   dateSlotEntry.bookedSlots.push(...slots);

//   // Ensure uniqueness of booked slots (optional, in case of any duplication)
//   dateSlotEntry.bookedSlots = [...new Set(dateSlotEntry.bookedSlots)];

//   // Ensure the ground schema is updated with the new slots
//   ground.markModified("slots");

//   // Save the updated ground document with booked slots
//   await ground.save();

//   // Generate booking ID
//   const booking_id = generateBookingID();

//   // Create the booking entry
//   const booking = new Booking({
//     user_id,
//     ground_id,
//     date,
//     slots,
//     comboPack,
//     name,
//     mobile,
//     email,
//     prepaid,
//     book: { booking_id, price: price }, // Using user-provided price
//     paymentStatus: prepaid > 0 ? "pending" : "pending",
//   });

//   await booking.save();

//   // Return the success response
//   res.status(201).json({
//     success: true,
//     data: { user_id,ground_id, date, slots, comboPack, price: price, prepaid,  booking_id, name, mobile, email },
//     message: "Slot booked successfully",
//   });
// });

const bookingGround = asyncHandler(async (req, res) => {
  const { user_id, ground_id, date, slots, comboPack, name, mobile, email, price, prepaid } = req.body;

  if (!user_id || typeof user_id !== "string") {
    return res.status(400).json({ message: "User ID must be a valid string" });
  }
  if (!price || price <= 0) {
    return res.status(400).json({ message: "Invalid total price provided" });
  }
  if (prepaid < 0 || prepaid > price) {
    return res.status(400).json({ message: "Invalid prepaid amount" });
  }

  const bookingDateformat = new Date(date);
  const bookingDate = bookingDateformat.toISOString().slice(0, 10); // 'YYYY-MM-DD'

  const ground = await Ground.findOne({ ground_id });
  if (!ground) {
    return res.status(404).json({ message: "Ground not found" });
  }

  // Ensure the slots object is initialized if not present
  if (!ground.slots) {
    ground.slots = {};
  }

  // If the date is not yet present in slots, initialize it with empty booked and available slots
  if (!ground.slots[bookingDate]) {
    ground.slots[bookingDate] = {
      availableSlots: ["6.0", "6.5", "7.0", "7.5"], // Default available slots (can be dynamic)
      bookedSlots: [], // Initially no slots are booked
    };
  }

  // Check if any of the selected slots are already booked
  const alreadyBooked = ground.slots[bookingDate].bookedSlots.filter((slot) =>
    slots.includes(slot)
  );

  if (alreadyBooked.length > 0) {
    return res.status(409).json({
      message: "Some slots are already booked",
      conflicts: alreadyBooked,
    });
  }

  // Update the bookedSlots array with the selected slots and remove them from availableSlots
  ground.slots[bookingDate].bookedSlots.push(...slots);
  ground.slots[bookingDate].bookedSlots = [...new Set(ground.slots[bookingDate].bookedSlots)];

  // Remove the booked slots from availableSlots
  ground.slots[bookingDate].availableSlots = ground.slots[bookingDate].availableSlots.filter(
    (slot) => !slots.includes(slot)
  );

  // Mark slots as modified and save the ground document
  ground.markModified("slots");
  await ground.save();

  // Generate booking ID
  const booking_id = generateBookingID();

  // Create the booking entry
  const booking = new Booking({
    user_id,
    ground_id,
    date,
    slots,
    comboPack,
    name,
    mobile,
    email,
    prepaid,
    book: { booking_id, price }, // Using user-provided price
    paymentStatus: prepaid > 0 ? "pending" : "pending",
  });

  await booking.save();

  // Return the success response
  res.status(201).json({
    success: true,
    data: { user_id, ground_id, date, slots, comboPack, price, prepaid, booking_id, name, mobile, email },
    message: "Slot booked successfully",
  });
});




const getBookings = asyncHandler(async (req, res) => {
  const { ground_id, date, slots } = req.query;

  // Check if any required fields are missing
  if (!ground_id || !date || !slots) {
      return res.status(400).json({ message: "Please provide ground_id, date, and slots" });
  }

  // Convert slots into an array of strings (in case of single slot input)
  const selectedSlots = Array.isArray(slots) ? slots : [slots];

  // Find bookings that match the provided filters
  const bookings = await Booking.find({
      ground_id,
      date,
      slots: { $in: selectedSlots }  // Match any booking with the selected slots
  });

  if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for the given filters" });
  }

  // Return the filtered bookings
  res.status(200).json({
      success: true,
      data: bookings,
      message: "Bookings retrieved successfully",
  });
});

//get booking details by slot
const getBookingDetailsBySlot = asyncHandler(async (req, res) => {
  const { ground_id, date, slot } = req.query;

  // Check if required fields are provided
  if (!ground_id || !date || !slot) {
    return res.status(400).json({ message: "Please provide ground_id, date, and slot" });
  }

  // Find bookings for the specific slot on the provided date and ground
  const bookings = await Booking.find({
    ground_id,
    date,
    slots: slot,  // Match the specific slot
  });

  if (bookings.length === 0) {
    return res.status(404).json({ message: "No bookings found for the given slot" });
  }

  // Return the booking details for the specific slot
  res.status(200).json({
    success: true,
    data: bookings,
    message: "Booking details retrieved successfully",
  });
});

// const deleteBookingDetailsById = asyncHandler(async (req, res) => {
//   const { booking_id, ground_id } = req.query;
//   console.log('Ground ID:', ground_id);
//   console.log('Booking Query:', req.query);

//   if (!booking_id || !ground_id) {
//     return res.status(400).json({ message: "Please provide booking_id and ground_id" });
//   }

//   // Find the booking
//   const booking = await Booking.findOne({
//     "book.booking_id": booking_id, 
//     ground_id,
//   });

//   if (!booking) {
//     return res.status(404).json({ message: "Booking not found for the given booking_id and ground_id" });
//   }

//   // Delete the booking
//   await Booking.findOneAndDelete({ "book.booking_id": booking_id, ground_id });

//   // Find the ground
// //   const ground = await Ground.findOne({ ground_id });
// // console.log(ground, 'groundDetails')
// //   if (!ground) {
// //     return res.status(404).json({ message: "Ground not found for the given ground_id" });
// //   }

// //   console.log('Booking Date:', booking.date);
// //   console.log('Ground Slots:', ground.slots);

// //   // ✅ Correct way to get date key in Mongoose Map
// //   const slotData = ground.slots.get(booking.date);  // Use `.get()` for Mongoose Map
// //   console.log('Slot Data for Date:', slotData);

// //   if (slotData) {
// //     const bookedSlots = slotData.bookedSlots;
// //     const slotTimeToRemove = booking.slot_time; 
// //     const index = bookedSlots.indexOf(slotTimeToRemove);

// //     if (index > -1) {
// //       bookedSlots.splice(index, 1); 
// //     }

// //     if (bookedSlots.length === 0) {
// //       ground.slots.delete(booking.date); 
// //     } else {
// //       ground.slots.set(booking.date, slotData);
// //     }



// //     ground.markModified("slots");
// //     await ground.save();
//   // } else {
//   //   return res.status(400).json({ message: "No booked slots found for the given date in the ground" });
//   // }

//   res.status(200).json({
//     success: true,
//     message: "Booking and slots deleted successfully",
//   });
// });

const deleteBookingDetailsById = asyncHandler(async (req, res) => {
  const { booking_id, ground_id } = req.query;

  if (!booking_id || !ground_id) {
    return res.status(400).json({ message: "Please provide booking_id and ground_id" });
  }

  // Find the booking
  const booking = await Booking.findOne({
    "book.booking_id": booking_id,
    ground_id,
  });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found for the given booking_id and ground_id" });
  }

  // Delete the booking
  await Booking.findOneAndDelete({ "book.booking_id": booking_id, ground_id });

  // Find the ground
  const ground = await Ground.findOne({ ground_id });
  if (!ground) {
    return res.status(404).json({ message: "Ground not found for the given ground_id" });
  }

  const bookingDate = booking.date; // Date of the booking
  const bookedSlots = ground.slots[bookingDate]?.bookedSlots; // Get booked slots for the specific date

  if (bookedSlots) {
    // Remove the booked slots from the bookedSlots array
    const slotsToRemove = booking.slots; // The slots that need to be removed from booking

    // Filter out the slots that are being deleted
    ground.slots[bookingDate].bookedSlots = bookedSlots.filter(
      (slot) => !slotsToRemove.includes(slot)
    );

    // Add the deleted slots back to the availableSlots
    ground.slots[bookingDate].availableSlots.push(...slotsToRemove);

    // Ensure the availableSlots remain unique
    ground.slots[bookingDate].availableSlots = [
      ...new Set(ground.slots[bookingDate].availableSlots),
    ];

    // Mark slots as modified and save the ground document
    ground.markModified("slots");
    await ground.save();
  } else {
    return res.status(400).json({
      message: "No booked slots found for the given date in the ground",
    });
  }

  res.status(200).json({
    success: true,
    message: "Booking and slots deleted successfully",
  });
});






const updateBookingPrice = asyncHandler(async (req, res) => {
  const { booking_id, newPrice, comboPack } = req.body;

  // Check if required fields are provided
  if (!booking_id) {
    return res.status(400).json({ message: "Please provide booking_id" });
  }

  // Find the booking by booking_id
  const booking = await Booking.findOne({ "book.booking_id": booking_id });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Calculate price per slot (default logic)
  const pricePerSlot = 800 * 0.5; // Each slot costs 400
  
  let updatedPrice = booking.book.price; // Start with the current price

  // If newPrice is provided, update it
  if (newPrice !== undefined) {
    updatedPrice = newPrice;
  } else {
    // Otherwise, calculate price dynamically based on slots & combo pack
    updatedPrice = booking.slots.length * pricePerSlot + (comboPack ? 80 : 0);
  }

  // Update booking price and combo pack
  booking.book.price = updatedPrice;
  if (comboPack !== undefined) {
    booking.comboPack = comboPack;
  }

  // Save the updated booking
  await booking.save();

  // Return the updated booking details
  res.status(200).json({
    success: true,
    data: { booking_id, price: updatedPrice, comboPack: booking.comboPack },
    message: "Booking price updated successfully",
  });
});

// Get all booking details for Admin Portal
const getAllBookings = asyncHandler(async (req, res) => {
  try {
    // Fetch all bookings from the database
    const bookings = await Booking.find({});

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    // Return all booking details
    res.status(200).json({
      success: true,
      data: bookings,
      message: "All bookings retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});
//Get all bookings details by date
const getBookingsByDate = asyncHandler(async (req, res) => {
  try {
    // Get the date from the query parameter
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Please provide a valid date" });
    }
    
    // Fetch bookings for the specified date.
    // Note: Adjust the query based on how you store dates (string, Date, etc.)
    const bookings = await Booking.find({ date: date });
    
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: `No bookings found for date: ${date}` });
    }
    
    res.status(200).json({
      success: true,
      data: bookings,
      message: `Bookings retrieved successfully for date: ${date}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings by date", error });
  }
});
// Search Bookings by Name, Mobile, Ground ID, or Booking ID
const searchBookings = asyncHandler(async (req, res) => {
  const { name, mobile, ground_id, booking_id } = req.query;

  // Build the search filter dynamically
  let filter = {};

  if (name) filter.name = { $regex: new RegExp(name, "i") }; // Case-insensitive search
  if (mobile) filter.mobile = mobile;
  if (ground_id) filter.ground_id = ground_id;
  if (booking_id) filter["book.booking_id"] = booking_id;

  try {
    const bookings = await Booking.find(filter);

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found with the given criteria" });
    }

    res.status(200).json({
      success: true,
      data: bookings,
      message: "Bookings retrieved successfully",
    });
  } catch (error) {
    console.error("Error searching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export { bookingGround, getBookings, getBookingDetailsBySlot, deleteBookingDetailsById, updateBookingPrice, getAllBookings, searchBookings, getBookingsByDate };



