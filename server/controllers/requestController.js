const { BookRequest, User } = require('../models');
const { validationResult } = require('express-validator');

exports.createRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookTitle, author, reason } = req.body;

    const request = await BookRequest.create({
      studentId: req.user.id,
      bookTitle,
      author,
      reason
    });

    const populatedRequest = await BookRequest.findByPk(request.id, {
      include: [{ model: User, as: 'student', attributes: ['name', 'studentId'] }]
    });

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const requests = await BookRequest.findAll({
      where,
      include: [{ model: User, as: 'student', attributes: ['name', 'studentId', 'email'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await BookRequest.findAll({
      where: { studentId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await BookRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await request.update({ status });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

