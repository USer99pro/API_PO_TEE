const User = require("../models/userModel");

exports.registerUser = async (req, res, next) => {
  try {
    console.log("📥 Incoming request body:", req.body);

    let { username, email, password, image, role } = req.body;

    console.log("📝 Before trim:", { username, email, password, image, role });

    // Trim ค่าที่รับมา
    username = typeof username === "string" ? username.trim() : username;
    email = typeof email === "string" ? email.trim() : email;

    console.log("✂️ After trim:", { username, email, password });

    // Validate required fields
    if (!username || !email || !password) {
      console.warn("⚠️ Missing required fields");
      return res.status(400).json({
        message: "Please provide username, email, and password"
      });
    }

    // Validate data types
    if (typeof email !== "string" || typeof username !== "string" || typeof password !== "string") {
      console.warn("⚠️ Invalid input format");
      return res.status(400).json({ message: "Invalid input format" });
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email });
    console.log("🔍 Existing email search result:", existingEmail);

    if (existingEmail) {
      console.warn("⚠️ Email already exists");
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create new user
    const newUser = new User({ username, email, image, role });
    console.log("🆕 New user object (before save):", newUser);

    // Encrypt password
    newUser.password = await newUser.encryptPassword(password);

    // Save user
    await newUser.save();
    console.log("✅ ผู้ใช้ถูกบันทึก:", newUser);

    // ส่ง status 201 เมื่อสร้างสำเร็จ
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {
    console.error("❌ Error registering user:", error);
    return res.status(500).json({
      message: "Error registering user",
      error: error.message
    });
  }
};
