const { FineRecord, User, BorrowRecord } = require('../models');

exports.getStudentFines = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    
    if (req.user.role !== 'admin' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const fines = await FineRecord.findAll({
      where: { studentId },
      include: [
        { model: User, attributes: ['name', 'studentId', 'email'] },
        { model: BorrowRecord }
      ],
      order: [['createdAt', 'DESC']]
    });

    const totalOutstanding = fines
      .filter(fine => !fine.isPaid)
      .reduce((sum, fine) => sum + fine.amount, 0);

    res.json({
      fines,
      totalOutstanding: totalOutstanding.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFines = async (req, res) => {
  try {
    const fines = await FineRecord.findAll({
      include: [
        { 
          model: User, 
          attributes: ['name', 'studentId', 'email'] 
        },
        { model: BorrowRecord }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.payFine = async (req, res) => {
  try {
    const fine = await FineRecord.findByPk(req.params.id);
    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }

    await fine.update({ isPaid: true });
    res.json(fine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

