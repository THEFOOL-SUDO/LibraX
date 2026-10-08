const express = require('express');
const fineController = require('../controllers/fineController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.get('/student/:studentId', auth, fineController.getStudentFines);
router.get('/all', auth, roleCheck(['admin']), fineController.getAllFines);
router.put('/:id/pay', auth, roleCheck(['admin']), fineController.payFine);

module.exports = router;

