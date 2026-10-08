const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BOOK_GENRES = [
  'Fiction',
  'Science',
  'History',
  'Technology',
  'Art',
  'Other',
  'Dystopian',
  'Romance',
  'Magical Realism',
  'Fantasy',
  'Philosophical Fiction',
  'Epic Poetry',
  'Satire',
  'Gothic Romance',
  'Adventure',
  'Historical Fiction',
  'Tragedy',
  'Science Fiction',
  'Horror'
];

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING,
    unique: true
  },
  genre: {
    type: DataTypes.ENUM(...BOOK_GENRES)
  },
  totalCopies: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  availableCopies: {
    type: DataTypes.INTEGER
  },
  coverImage: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  addedBy: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'Books',
  timestamps: true
});

module.exports = Book;

