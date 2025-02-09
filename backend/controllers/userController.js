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
    throw new Error('Invalid phone number or password');
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

// ✅ Only Export registerUser (loginUser is already exported above)
export { registerUser, loginUser };
