const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const studentRouter = require("./routes/studentRouter");

const app = express();

// เชื่อมต่อ MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ Failed to connect MongoDB:", err.message);
  });


//Connect Mongodb none .env
//   mongoose.connection('<<Mongodb URL>>/<< Collection Name>>').then(() => {
//     console.log("✅ Connected to MongoDB");
//   }).catch((err) => {
//     console.error("❌ Failed to connect MongoDB:", err.message);
//   });



// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/students", studentRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;
