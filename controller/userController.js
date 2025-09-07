const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// ฟังก์ชันสร้าง Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userID: userId, role }, // เก็บ role ไว้ด้วย
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
};

// ✅ ดึงข้อมูลผู้ใช้ทั้งหมด (Admin เท่านั้น)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -__v");
    res.status(200).json({
      message: "ดึงข้อมูลผู้ใช้ทั้งหมดสำเร็จ",
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Get all users error:", error.message);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
      error: error.message,
    });
  }
};

// ✅ สมัครสมาชิก
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // ✅ ตรวจสอบข้อมูลที่กรอกมา
    if (!username || !email || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    // ✅ ตรวจสอบว่า email ซ้ำหรือไม่
    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }

    // ✅ สร้าง user ใหม่ (ใส่ password ด้วย)
    const user = new User({
      username,
      email,
      password,         // ปล่อย plain text → pre-save จะ hash ให้เอง
      role: role || "USER",  // default USER ถ้าไม่ส่งมา
    });

    // ✅ บันทึกลง MongoDB
    await user.save();

    // ✅ สร้าง token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "ลงทะเบียนเรียบร้อย",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
      expiresIn: "3d",
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
      error: error.message,
    });
  }
};

// ✅ เข้าสู่ระบบ
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ตรวจสอบข้อมูลที่กรอกมา
    if (!email || !password) {
      return res.status(400).json({ message: "กรุณากรอก email และ password" });
    }

    const user = await User.findOne({ email }).select("+isDeleted");
    if (!user) {
      return res.status(400).json({ message: "email ไม่ถูกต้อง" });
    }

    if (user.isDeleted) {
      return res.status(403).json({ message: "บัญชีนี้ถูกระงับการใช้งาน" });
    }

    const isValidPassword = await user.checkPassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "password ไม่ถูกต้อง" });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
      },
      token,
      expiresIn: "3d",
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
      error: error.message,
    });
  }
};
// ✅ ดึงข้อมูลผู้ใช้ที่ login อยู่
exports.getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่" });
    }

    res.status(200).json({
      message: "ดึงข้อมูลผู้ใช้สำเร็จ",
      user: req.user,
    });
  } catch (error) {
    console.error("GetMe error:", error.message);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
      error: error.message,
    });
  }
};
