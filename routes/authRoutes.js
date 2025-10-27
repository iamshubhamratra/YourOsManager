const express = require("express");
const authRoutes = express.Router();
const authController = require("../controllers/authController");

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Signup
authRoutes.post("/signup", async (req, res) => {
  const result = await authController.signup(req.body.name, req.body.email, req.body.password);
  if (result.success) {
    res.cookie("token", result.token, cookieOptions);
    return res.status(201).json({ success: true, user: result.user });
  }
  res.status(400).json({ success: false, message: result.message });
});

// Login
authRoutes.post("/login", async (req, res) => {
  const result = await authController.login(req.body.email, req.body.password);
  if (result.success) {
    res.cookie("token", result.token, cookieOptions);
    return res.json({ success: true, user: result.user });
  }
  res.status(401).json({ success: false, message: result.message });
});

// Logout
authRoutes.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

// Get current user 
authRoutes.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

  const verified = authController.verifyToken(token);
  if (!verified.success) return res.status(401).json({ success: false, message: verified.message });

  const result = await authController.getUserById(verified.userId);
  if (result.success) return res.json({ success: true, user: result.user });
  res.status(404).json({ success: false, message: result.message });
});

module.exports = authRoutes;
