const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BorrowRecord = sequelize.define('BorrowRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  issueDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'returned', 'overdue'),
    defaultValue: 'active'
  },
  issuedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'BorrowRecords',
  timestamps: true,
  hooks: {
    beforeValidate: (record) => {
      if (!record.dueDate) {
        const issueDate = record.issueDate || new Date();
        record.dueDate = new Date(issueDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      }
    }
  }
});

module.exports = BorrowRecord;

