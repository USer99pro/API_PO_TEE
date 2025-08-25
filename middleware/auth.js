const jwt  = require('jsonwebtoken');
const User = require('../models/userModel');

const Authentication = async (req,res,next) => {
   try {
    const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
      if(!token){
         return res.status(401).json({
            message:"ไม่มี token กรุณาเข้าสู่ระบบใหม่"});
      }


      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if(!decoded){
         const err = new Error("Invalid token");
         err.statusCode = 401;
         throw err;
      }
      const user = await User.findById(decoded.userID).select('-password -__v');
      if(!user){
         const err = new Error("User not found");
         err.statusCode = 404;
         throw err;
      }

      req.user = user; // Attach user to request object
      next();
   } catch (error) {
      res.status(error.statusCode || 500).json({
         message: "Authentication failed",
         error: error.message
      });
   }
}

module.exports = {Authentication};