const express = require('express');
const { body } = require('express-validator');
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

router.post('/', 
  auth, 
  roleCheck(['admin']),
  [
    body('title').notEmpty(),
    body('author').notEmpty(),
    body('totalCopies').isInt({ min: 1 })
  ],
  bookController.createBook
);

router.put('/:id', 
  auth, 
  roleCheck(['admin']),
  bookController.updateBook
);

router.delete('/:id', 
  auth, 
  roleCheck(['admin']),
  bookController.deleteBook
);

module.exports = router;

