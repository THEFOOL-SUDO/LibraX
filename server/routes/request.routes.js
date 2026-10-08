const express = require('express');
const { body } = require('express-validator');
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.post('/',
  auth,
  roleCheck(['student']),
  [
    body('bookTitle').notEmpty(),
    body('author').notEmpty()
  ],
  requestController.createRequest
);

router.get('/', auth, roleCheck(['admin']), requestController.getAllRequests);
router.get('/my', auth, roleCheck(['student']), requestController.getMyRequests);
router.put('/:id',
  auth,
  roleCheck(['admin']),
  body('status').isIn(['pending', 'approved', 'rejected']),
  requestController.updateRequestStatus
);

module.exports = router;

