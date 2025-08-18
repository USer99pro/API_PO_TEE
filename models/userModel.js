const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true, minlength: 6 },
    image: { type: String, default: "default.jpg" },
    role: { type: String, default: "member" },
    cloudinaryID: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    collection: "users",
    timestamps: true,
    versionKey: false,
  }
);

// ตรวจสอบรหัสผ่าน
Schema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// pre-save hook เข้ารหัสรหัสผ่านอัตโนมัติ
Schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", Schema);
module.exports = User;
