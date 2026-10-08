const sequelize = require('../config/db');
const User = require('./User');
const Book = require('./Book');
const BorrowRecord = require('./BorrowRecord');
const FineRecord = require('./FineRecord');
const BookRequest = require('./BookRequest');

// Associations
User.hasMany(BorrowRecord, { foreignKey: 'studentId' });
BorrowRecord.belongsTo(User, { as: 'student', foreignKey: 'studentId' });

User.hasMany(BorrowRecord, { foreignKey: 'issuedBy' });
BorrowRecord.belongsTo(User, { as: 'admin', foreignKey: 'issuedBy' });

Book.hasMany(BorrowRecord, { foreignKey: 'bookId' });
BorrowRecord.belongsTo(Book, { foreignKey: 'bookId' });

User.hasMany(FineRecord, { foreignKey: 'studentId' });
FineRecord.belongsTo(User, { foreignKey: 'studentId' });

BorrowRecord.hasOne(FineRecord, { foreignKey: 'borrowRecordId' });
FineRecord.belongsTo(BorrowRecord, { foreignKey: 'borrowRecordId' });

User.hasMany(BookRequest, { foreignKey: 'studentId' });
BookRequest.belongsTo(User, { as: 'student', foreignKey: 'studentId' });

// User.belongsToMany(Book, { through: BorrowRecord, foreignKey: 'studentId', otherKey: 'bookId' });
User.hasMany(Book, { foreignKey: 'addedBy', as: 'addedByUser' });
Book.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser' });

const db = {
  sequelize,
  User,
  Book,
  BorrowRecord,
  FineRecord,
  BookRequest
};

module.exports = db;

