
const express = require('express');
const router  = express.Router();
const studentController = require('../controller/studentController');

router.get( '/'   ,  studentController.showAllStudents   );
router.get('/:id' , studentController.showStudentsByID);
router.post('/insert'  , studentController.InsertStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;