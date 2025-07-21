const express = require('express');
const router = express.Router(); // ✅ This was missing

const usercontroller = require("../controller/userController");

/* GET users listing. */
router.get('/', usercontroller.showAlluser);
router.get('/1', usercontroller.user1);
router.get('/2', usercontroller.user2);
router.get('/3', usercontroller.user3);

module.exports = router;
