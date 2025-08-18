const express = require('express');
const router = express.Router(); 
const usercontroller = require("../controller/userController");


// 127.0.0.1:3000/users/
router.post('/register', usercontroller.register); 
router.post('/login', usercontroller.login);

module.exports = router;
