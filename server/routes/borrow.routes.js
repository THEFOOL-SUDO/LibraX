const express = require('express');
const { body } = require('express-validator');
const borrowController = require('../controllers/borrowController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.post('/issue', 
  auth, 
  roleCheck(['admin']),
  [
    body('studentId').isInt(),
    body('bookId').isInt()
  ],
  borrowController.issueBook
);

router.post('/return', 
  auth, 
  roleCheck(['admin']),
  body('borrowRecordId').isInt(),
  borrowController.returnBook
);

router.get('/all', auth, roleCheck(['admin']), borrowController.getAllBorrows);
router.get('/student/:studentId', auth, borrowController.getStudentBorrows);
router.get('/overdue', auth, roleCheck(['admin']), borrowController.getOverdue);

module.exports = router;

