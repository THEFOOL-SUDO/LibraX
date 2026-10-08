const bcrypt = require('bcryptjs');
const db = require('./models');
const importedBooks = require('./data/importedBooks');
const { User, Book, BorrowRecord, FineRecord, BookRequest } = db;

const normalizeIsbn = (isbn = '') => isbn.replace(/[^0-9Xx]/g, '');

const seed = async () => {
  try {
    // Clear existing data
    await db.sequelize.query('PRAGMA foreign_keys = OFF;');
    await BookRequest.destroy({ truncate: true, cascade: true });
    await FineRecord.destroy({ truncate: true, cascade: true });
    await BorrowRecord.destroy({ truncate: true, cascade: true });
    await Book.destroy({ truncate: true, cascade: true });
    await User.destroy({ truncate: true, cascade: true });
    await db.sequelize.query('PRAGMA foreign_keys = ON;');

    console.log('Database cleared');

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@library.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1234567890'
    });

    // Create Students
    const studentPassword = await bcrypt.hash('Student@123', salt);
    const john = await User.create({
      name: 'John Doe',
      email: 'john@student.com',
      password: studentPassword,
      role: 'student',
      studentId: 'STU001',
      phone: '+1987654321'
    });

    const jane = await User.create({
      name: 'Jane Smith',
      email: 'jane@student.com',
      password: studentPassword,
      role: 'student',
      studentId: 'STU002',
      phone: '+1122334455'
    });

    console.log('Users created');

    // Create Books from imported catalog
    const booksData = importedBooks.map((book) => {
      const totalCopies = Math.max(1, Number(book.totalCopies) || 1);
      const available = Number(book.availableCopies);
      const availableCopies = Number.isFinite(available)
        ? Math.max(0, Math.min(available, totalCopies))
        : totalCopies;

      return {
        title: (book.title || '').trim(),
        author: (book.author || '').trim(),
        isbn: normalizeIsbn(book.isbn),
        genre: book.genre || 'Other',
        totalCopies,
        availableCopies,
        coverImage: book.coverImage || null,
        description: book.description || null
      };
    });

    const books = await Book.bulkCreate(booksData.map(book => ({
      ...book,
      availableCopies: book.availableCopies,
      addedBy: admin.id
    })));

    console.log(`Created ${books.length} books`);

    // Create sample borrow records
    const borrow1 = await BorrowRecord.create({
      studentId: john.id,
      bookId: books[0].id, // To Kill a Mockingbird
      issuedBy: admin.id
    });

    const borrow2 = await BorrowRecord.create({
      studentId: jane.id,
      bookId: books[5].id, // The Catcher in the Rye
      issuedBy: admin.id
    });

    // Update available copies
    await books[0].decrement('availableCopies', { by: 1 });
    await books[5].decrement('availableCopies', { by: 1 });

    // Create overdue fine
    const overdueFine = await FineRecord.create({
      studentId: john.id,
      borrowRecordId: borrow1.id,
      amount: 25,
      reason: 'Overdue by 5 days',
      isPaid: false
    });

    console.log('Sample data created successfully');
    console.log(`
Admin: admin@library.com / Admin@123
John: john@student.com / Student@123  
Jane: jane@student.com / Student@123
    `);
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await db.sequelize.close();
  }
};

seed();

