const express = require('express');
const router = express.Router(); 
const usercontroller = require("../controller/userController");
const { Authentication} = require("../middleware/auth");


// 127.0.0.1:3000/users/
router.post('/register', usercontroller.register); 
router.post('/login', usercontroller.login);
router.get('/', Authentication ,usercontroller.getAllUsers);

module.exports = router;
