import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
const registerUser = asyncHandler(async (req, res) => {
  const { name, phone_number, password, role } = req.body;
  
  if (!name || !phone_number || !password) {
    res.status(400);
    throw new Error('Please provide name, phone number, and password');
  }

  const userExists = await User.findOne({ phone_number });
  if (userExists) {
    res.status(400);
    throw new Error('User with this phone number already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
 // Generate a unique user_id using UUID
 const user_id = uuidv4();

  const user = await User.create({
    user_id, // Add the generated user_id
    name,
    phone_number,
    password: hashedPassword,
    role: role || 'user',
  });

  if (user) {
    const token = jwt.sign(
      { userId:  user.user_id },
      process.env.JWT_SECRET || 'defaultSecretKeyForTesting',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id:user.user_id,
        name: user.name,
        phone_number: user.phone_number,
        role: user.role,
        
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// ✅ Secure Login Function
 const loginUser = asyncHandler(async (req, res) => {
  const { phone_number, password } = req.body;

  if (!phone_number || !password) {
    res.status(400);
    throw new Error('Please provide both phone number and password');
  }

  const user = await User.findOne({ phone_number });
  if (!user) {
    res.status(401);
    throw new Error('We dont have such credentials, please Register');
  }

// ✅ If userFlag is missing, set it to false
// if (user.userFlag === undefined) {
//   user.userFlag = false;
//   await user.save();
// }

// ❌ Restrict login if userFlag is true (indicating account restriction)
if (user.userFlag) {
  res.status(403);
  throw new Error('Your account is restricted due to unpaid bills. Please clear your dues.');
}

  // ✅ Securely compare hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid phone number or password');
  }

  const token = jwt.sign(
    { userId: user.user_id },
    process.env.JWT_SECRET || 'defaultSecretKeyForTesting',
    { expiresIn: '30d' }
  );

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user.user_id,
      name: user.name,
      phone_number: user.phone_number,
      role: user.role,
    },
  });
});


//Update User Flag
const updateUserFlag = asyncHandler(async (req, res) => {
  const { user_id } = req.params; // Get user ID from URL
  const { userFlag } = req.body; // Get new flag value

  console.log(user_id, 'userid');

  // ✅ Find user by `user_id` (String UUID) instead of `_id`
  const user = await User.findOne({ user_id });

  console.log(user, 'userdetails');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // ✅ Update the flag
  user.userFlag = userFlag;
  await user.save();

  res.status(200).json({ message: 'User flag updated successfully', user });
});


// ✅ Only Export registerUser (loginUser is already exported above)

// ✅ Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}, "user_id name phone_number role userFlag"); // Fetch users with selected fields
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
export { registerUser, loginUser, updateUserFlag , getAllUsers };
