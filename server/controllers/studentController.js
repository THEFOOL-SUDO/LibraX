const { User, BorrowRecord, FineRecord } = require('../models');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: 'student', isActive: true },
      attributes: ['id', 'name', 'studentId', 'email', 'phone', 'memberSince'],
      include: [{
        model: BorrowRecord,
        attributes: [],
        required: false
      }, {
        model: FineRecord,
        attributes: [],
        required: false,
        where: { isPaid: false }
      }],
      order: [['name', 'ASC']]
    });

    const studentsWithStats = students.map(student => ({
      ...student.toJSON(),
      borrowCount: student.BorrowRecords?.length || 0,
      unpaidFinesCount: student.FineRecords?.length || 0
    }));

    res.json(studentsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'studentId', 'email', 'phone', 'memberSince', 'isActive'],
      include: [{
        model: BorrowRecord
      }, {
        model: FineRecord
      }]
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deactivateStudent = async (req, res) => {
  try {
    const student = await User.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.update({ isActive: false });
    res.json({ message: 'Student deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

