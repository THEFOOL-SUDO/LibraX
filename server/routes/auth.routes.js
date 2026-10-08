const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  body('role').isIn(['admin', 'student']).withMessage('Invalid role'),
  body('studentId')
    .if(body('role').equals('student'))
    .trim()
    .notEmpty()
    .withMessage('Student ID is required for student registration')
], authController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').isIn(['admin', 'student']).withMessage('Invalid role')
], authController.login);

router.get('/me', auth, authController.getMe);

router.put('/change-password', [
  auth,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], authController.changePassword);

module.exports = router;

