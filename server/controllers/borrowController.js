const { BorrowRecord, Book, User, FineRecord, Op } = require('../models');
const env = require('../config/env');

exports.issueBook = async (req, res) => {
  try {
    const { studentId, bookId } = req.body;

    const book = await Book.findByPk(bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book not available' });
    }

    const student = await User.findByPk(studentId);
    if (!student || student.role !== 'student') {
      return res.status(400).json({ message: 'Invalid student' });
    }

    const borrowRecord = await BorrowRecord.create({
      studentId,
      bookId,
      issuedBy: req.user.id
    });

    await book.decrement('availableCopies', { by: 1 });

    const populatedRecord = await BorrowRecord.findByPk(borrowRecord.id, {
      include: [
        { model: User, as: 'student', attributes: ['name', 'studentId'] },
        { model: User, as: 'admin', attributes: ['name'] },
        { model: Book }
      ]
    });

    res.status(201).json(populatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { borrowRecordId } = req.body;
    const borrowRecord = await BorrowRecord.findByPk(borrowRecordId, {
      include: [Book]
    });

    if (!borrowRecord || borrowRecord.status !== 'active') {
      return res.status(400).json({ message: 'Invalid borrow record' });
    }

    const returnDate = new Date();
    borrowRecord.returnDate = returnDate;
    borrowRecord.status = 'returned';

    await borrowRecord.save();
    await borrowRecord.Book.increment('availableCopies', { by: 1 });

    let fine = 0;
    const fineRecord = await FineRecord.findOne({ where: { borrowRecordId } });

    if (returnDate > borrowRecord.dueDate) {
      const daysOverdue = Math.ceil((returnDate - borrowRecord.dueDate) / (24 * 60 * 60 * 1000));
      fine = daysOverdue * env.FINE_PER_DAY;

      if (!fineRecord) {
        await FineRecord.create({
          studentId: borrowRecord.studentId,
          borrowRecordId,
          amount: fine,
          reason: `Overdue by ${daysOverdue} days`,
          isPaid: false
        });
      }
    } else if (fineRecord) {
      await fineRecord.destroy();
    }

    const populatedRecord = await BorrowRecord.findByPk(borrowRecordId, {
      include: [
        { model: User, as: 'student', attributes: ['name', 'studentId'] },
        { model: Book }
      ]
    });

    res.json({ 
      message: 'Book returned successfully',
      fine,
      borrowRecord: populatedRecord 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBorrows = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (search) where[Op.or] = [
      { '$student.name$': { [Op.like]: `%${search}%` } },
      { '$book.title$': { [Op.like]: `%${search}%` } }
    ];

    const { count, rows } = await BorrowRecord.findAndCountAll({
      where,
      include: [
        { model: User, as: 'student', attributes: ['name', 'studentId', 'email'] },
        { model: User, as: 'admin', attributes: ['name'] },
        { model: Book, attributes: ['title', 'author', 'coverImage'] }
      ],
      order: [['issueDate', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      borrows: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentBorrows = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    
    if (req.user.role !== 'admin' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const borrows = await BorrowRecord.findAll({
      where: { studentId },
      include: [
        { model: Book, attributes: ['title', 'author'] },
        { model: User, as: 'admin', attributes: ['name'] }
      ],
      order: [['issueDate', 'DESC']]
    });

    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOverdue = async (req, res) => {
  try {
    const today = new Date();
    const overdueBorrows = await BorrowRecord.findAll({
      where: {
        dueDate: { [Op.lt]: today },
        status: 'active'
      },
      include: [
        { model: User, as: 'student', attributes: ['name', 'studentId', 'phone'] },
        { model: Book }
      ]
    });

    // Update status to overdue
    await BorrowRecord.update(
      { status: 'overdue' },
      {
        where: {
          dueDate: { [Op.lt]: today },
          status: 'active'
        }
      }
    );

    res.json(overdueBorrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

