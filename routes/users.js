const express = require('express');
const router = express.Router(); 
const usercontroller = require("../controller/userController");
const { Authentication, isAdmin} = require("../middleware/auth");


// 127.0.0.1:3000/users/
router.post('/register', usercontroller.register); 
router.post('/login', usercontroller.login);
router.get('/all',Authentication, isAdmin ,usercontroller.getAllUsers);
router.get('/me', Authentication ,usercontroller.getMe)
module.exports = router;
