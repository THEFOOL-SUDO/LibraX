const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FineRecord = sequelize.define('FineRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  borrowRecordId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  reason: {
    type: DataTypes.STRING
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'FineRecords',
  timestamps: true
});

module.exports = FineRecord;

