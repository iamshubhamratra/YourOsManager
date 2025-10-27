const User = require('../models/authModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

// Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Strong password regex
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// Signup
async function signup(name, email, password) {
  if (!name || !email || !password) {
    return { success: false, message: "All fields are required" };
  }

  if (!strongPasswordRegex.test(password)) {
    return {
      success: false,
      message: "Password must be at least 8 chars, with uppercase, lowercase, number & special char"
    };
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { success: false, message: "Email already registered" };
  }

  const user = new User({ name, email, password });
  await user.save();

  return {
    success: true,
    message: "Signup successful",
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email }
  };
}

// Login
async function login(email, password) {
  if (!email || !password) return { success: false, message: "Email and password required" };

  const user = await User.findOne({ email });
  if (!user) return { success: false, message: "Invalid email or password" };

  const isValid = await user.comparePassword(password);
  if (!isValid) return { success: false, message: "Invalid email or password" };

  return {
    success: true,
    message: "Login successful",
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email }
  };
}

// Verify JWT
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { success: true, userId: decoded.userId };
  } catch {
    return { success: false, message: "Invalid or expired token" };
  }
}

// Get user by ID
async function getUserById(userId) {
  const user = await User.findById(userId).select('-password');
  if (!user) return { success: false, message: "User not found" };
  return { success: true, user };
}

module.exports = { signup, login, verifyToken, getUserById };
