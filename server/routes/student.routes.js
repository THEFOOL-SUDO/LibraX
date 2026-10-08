const express = require('express');
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.get('/', auth, roleCheck(['admin']), studentController.getAllStudents);
router.get('/:id', auth, roleCheck(['admin']), studentController.getStudentById);
router.delete('/:id', auth, roleCheck(['admin']), studentController.deactivateStudent);

module.exports = router;

