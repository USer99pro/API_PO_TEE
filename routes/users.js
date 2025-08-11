const express = require('express');
const router = express.Router(); // ✅ This was missing
const usercontroller = require("../controller/userController");

/* GET users listing. */
router.post('/register', usercontroller.registerUser); 

module.exports = router;
