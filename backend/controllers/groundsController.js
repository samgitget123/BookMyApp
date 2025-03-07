import asynHandler from '../middleware/asyncHandler.js';
import Ground from '../models/Ground.js';
import Booking from '../models/Booking.js';
import { validate as uuidValidate } from 'uuid'; // For UUID validation
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { upload } from '../middleware/upload.js';


const createGround = asynHandler(async (req, res) => {
    const { name, location, city, country, state, stateDistrict, description, ground_owner, user_id } = req.body;

    console.log("Received user_id:", user_id); // Debugging log

    // Ensure `user_id` is valid and in UUID format
    let userId = Array.isArray(user_id) ? user_id[1] : user_id; // Adjust user_id if it's an array
    if (!uuidValidate(userId)) { // Validate that the userId is a valid UUID
        return res.status(400).json({ message: "Invalid user ID" });
    }

    // Validate required fields
    if (!name || !location || !city || !country || !state || !stateDistrict || !description || !ground_owner) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate that at least one file was uploaded
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Photo file is required" });
    }

    try {
        // Map over req.files to get an array of file paths
        const photoPaths = req.files.map((file) => file.filename);

        // Create a new ground document with required fields
        const newGround = new Ground({
            name,
            location,
            city,
            country,
            state,
            stateDistrict,
            photo: photoPaths,
            description,
            ground_owner,
            user_id: userId, // Store valid user_id in DB
        });

        // Save the new ground document to the database
        await newGround.save();

        // Respond with the newly created ground data
        res.status(201).json({
            message: "Ground created successfully",
            ground: newGround
        });

    } catch (error) {
        console.error("Error creating ground:", error);
        res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
});


const getUserGrounds = async (req, res) => {
    try {
      const { userId } = req.query; // Extract userId from query params
        console.log(req.query)
      if (!userId) {
        return res.status(400).json({ message: 'UserId is required' });
      }
  
      // Make sure userId is a string
      const grounds = await Ground.find({ user_id: userId });
  
      if (!grounds.length) {
        return res.status(404).json({ message: 'No grounds found for this user.' });
      }
  
      res.status(200).json(grounds);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching grounds', error });
    }
  };
  
  
  
const getGroundsByLocation = asynHandler(async (req, res) => {
    try {
        const { location, state, city } = req.query; // Get query parameters

        // Validate the `state` parameter
        if (!state || state.trim() === '') {
            return res.status(400).json({ message: "Please select a valid state" });
        }

        // Build query object dynamically based on provided filters
        const query = {};
        if (location) query.location = { $regex: new RegExp(location, "i") }; // Case-insensitive regex for location
        if (state) query.state = { $regex: new RegExp(state, "i") }; // Case-insensitive regex for state
        if (city) query.city = { $regex: new RegExp(city, "i") }; // Case-insensitive regex for city

        // Fetch grounds based on the query
        const grounds = await Ground.find(query);

        // Handle cases where no grounds are found
        if (!grounds || grounds.length === 0) {
            let message = "No grounds found";
            if (state && city) {
                message = "No grounds found for the specified state and city combination";
            } else if (state) {
                message = "No grounds found for the specified state";
            } else if (city) {
                message = "No grounds found for the specified city";
            }
            return res.status(404).json({ message });
        }

        // Format the response
        const response = grounds.map((ground) => ({
            ground_id: ground.ground_id,
            data: {
                name: ground.name,
                location: ground.location,
                city: ground.city,
                photo: ground.photo,
                description: ground.description,
            },
        }));

        // Send the response
        res.status(200).json(response);
    } catch (err) {
        // Catch and send server errors
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

const getGroundsByIdandDate = asynHandler(async(req , res)=>{
     const { ground_id } = req.params;
        const { date } = req.query;
    try {
        // Find the ground
        const ground = await Ground.findOne({ ground_id });
        if (!ground) {
            return res.status(404).json({ message: 'Ground not found.' });
        }

        // Validate and format the date
        const selectedDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        // Find all bookings for the selected date and ground
        const bookings = await Booking.find({ ground_id, date: selectedDate });

        // Aggregate booked slots
        const bookedSlots = bookings.reduce((acc, booking) => acc.concat(booking.slots), []);

        // Respond with ground details and booked slots
        res.status(200).json({
            name: ground.name,
            location: ground.location,
            data: {
                image: ground.photo,
                desc: ground.description,
            },
            slots: {
                booked: bookedSlots,
            },
        });
    } catch (error) {
        console.error('Error fetching ground details:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


//get grounds by user id , ground id 
const getuserGroundsByIdAndDate = asynHandler(async (req, res) => {
    const { ground_id, user_id } = req.params;
    const { date } = req.query;

    try {
        // Find the ground
        const ground = await Ground.findOne({ ground_id });
        if (!ground) {
            return res.status(404).json({ message: 'Ground not found.' });
        }

        // Validate and format the date
        const selectedDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        // Find all bookings for the selected date, ground, and user
        const bookings = await Booking.find({ ground_id, user_id, date: selectedDate });

        // Aggregate booked slots
        const bookedSlots = bookings.reduce((acc, booking) => acc.concat(booking.slots), []);

        // Respond with ground details and booked slots
        res.status(200).json({
            name: ground.name,
            location: ground.location,
            user_id: user_id,
            data: {
                image: ground.photo,
                desc: ground.description,
            },
            slots: {
                booked: bookedSlots,
            },
        });
    } catch (error) {
        console.error('Error fetching ground details:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

//////user register with ground////

const registerUserWithGround = asynHandler(async (req, res) => {
  const { 
    name, phone_number, password, role, 
    ground_name, location, city, country, state, stateDistrict, description, ground_owner 
  } = req.body;
  console.log("Request Body:", req.body);

  
  // if (!name || !phone_number || !password || !ground_name || !location || !city || !country || !state || !description || !ground_owner) {
  //   return res.status(400).json({ message: "All required fields must be provided" });
  // }

  // Check if user already exists
  const userExists = await User.findOne({ phone_number });
  if (userExists) {
    return res.status(400).json({ message: "User with this phone number already exists" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate a unique user_id
  const user_id = uuidv4();

  try {
    // Create new user
    const user = await User.create({
      user_id,
      name,
      phone_number,
      password: hashedPassword,
      role: role || "user",
    });

    // Generate JWT Token
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET || "defaultSecretKeyForTesting", { expiresIn: "30d" });

    // Validate that files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Photo file is required for ground registration" });
    }

    // Get uploaded photo paths
    const photoPaths = req.files.map((file) => file.filename);

    // Create new ground
    const newGround = await Ground.create({
      name: ground_name,
      location,
      city,
      country,
      state,
      stateDistrict,
      photo: photoPaths,
      description,
      ground_owner,
      user_id, // Link ground to the newly created user
    });

    res.status(201).json({
      message: "User and ground registered successfully",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        phone_number: user.phone_number,
        role: user.role,
      },
      ground: newGround,
    });

  } catch (error) {
    console.error("Error creating user and ground:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});




export {createGround , getGroundsByLocation , getGroundsByIdandDate, getUserGrounds, getuserGroundsByIdAndDate, registerUserWithGround};