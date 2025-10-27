const { verifyToken, getUserById } = require('../controllers/authController');

// Middleware to protect routes
async function requireAuth(req, res, next) {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }
  
  const verified = verifyToken(token);
  
  if (!verified.success) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
  
  // Get user and attach to request
  const result = await getUserById(verified.userId);
  
  if (!result.success) {
    return res.status(401).json({
      success: false,
      message: "User not found"
    });
  }
  
  req.user = result.user;
  next();
}

module.exports = { requireAuth };