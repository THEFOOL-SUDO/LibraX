const { Book, BorrowRecord, User, Op } = require('../models');
const { validationResult } = require('express-validator');

exports.getAllBooks = async (req, res) => {
  try {
    const {
      genre,
      availability,
      search,
      sortBy = 'createdAt',
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (genre) where.genre = genre;
    if (search) where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { author: { [Op.like]: `%${search}%` } }
    ];
    if (availability === 'available') where.availableCopies = { [Op.gt]: 0 };

    const { count, rows } = await Book.findAndCountAll({
      where,
      order: [[sortBy, 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: User, as: 'addedByUser', attributes: ['name'] }]
    });

    res.json({
      books: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, isbn, genre, totalCopies, coverImage, description } = req.body;
    
    const book = await Book.create({
      title,
      author,
      isbn,
      genre,
      totalCopies: parseInt(totalCopies),
      availableCopies: parseInt(totalCopies),
      coverImage,
      description,
      addedBy: req.user.id
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.update(req.body);
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const activeBorrows = await BorrowRecord.count({
      where: { bookId: req.params.id, status: 'active' }
    });

    if (activeBorrows > 0) {
      return res.status(400).json({ 
        message: `Cannot delete book. ${activeBorrows} active borrows found.` 
      });
    }

    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

