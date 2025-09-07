const jwt  = require('jsonwebtoken');
const User = require('../models/userModel');

const Authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ message: "ไม่มี token กรุณาเข้าสู่ระบบใหม่" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.userID).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // attach user to req
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed",
      error: error.message
    });
  }
};

// Middleware ตรวจสอบสิทธิ์ Admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "คุณไม่มีสิทธิ์เข้าถึง API นี้" });
  }
  next();
};

module.exports = { Authentication, isAdmin };
