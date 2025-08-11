const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = new mongoose.Schema(
    {
        username: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, unique: true },
        password: { type: String, required: true, trim: true, minlength: 6 },
        image: { type: String, default: "default.jpg" },
        role: { type: String, default: "member" },
    },
    {
        collection: "users",
        timestamps: true,
        versionKey: false,
    }
);

// เข้ารหัสรหัสผ่าน
Schema.methods.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(30);
    return await bcrypt.hash(password, salt);
};

// ตรวจสอบรหัสผ่าน
Schema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// pre-save hook
Schema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await this.encryptPassword(this.password);
    next();
});

const User = mongoose.model("User", Schema);
module.exports = User;
