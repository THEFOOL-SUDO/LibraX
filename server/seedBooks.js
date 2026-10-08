const bcrypt = require('bcryptjs');
const db = require('./models');
const importedBooks = require('./data/importedBooks');

const { User, Book } = db;

const normalizeIsbn = (isbn = '') => isbn.replace(/[^0-9Xx]/g, '');

const normalizeBook = (book) => {
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
};

const mockBooks = importedBooks.map(normalizeBook);

const ensureAdmin = async () => {
  let admin = await User.findOne({ where: { email: 'admin@library.com' } });
  if (admin) return admin;

  const password = await bcrypt.hash('Admin@123', 10);
  admin = await User.create({
    name: 'Admin User',
    email: 'admin@library.com',
    password,
    role: 'admin',
    phone: '+1234567890',
    isActive: true
  });
  return admin;
};

const seedBooks = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();

    const admin = await ensureAdmin();
    let inserted = 0;
    let updated = 0;

    for (const book of mockBooks) {
      const [record, created] = await Book.findOrCreate({
        where: { isbn: book.isbn },
        defaults: {
          ...book,
          addedBy: admin.id
        }
      });

      if (created) {
        inserted += 1;
      } else {
        await record.update({
          title: book.title,
          author: book.author,
          genre: book.genre,
          totalCopies: book.totalCopies,
          availableCopies: Math.min(
            Number.isFinite(record.availableCopies) ? record.availableCopies : book.availableCopies,
            book.totalCopies
          ),
          coverImage: book.coverImage,
          description: book.description,
          addedBy: record.addedBy || admin.id
        });
        updated += 1;
      }
    }

    console.log(`Catalog seed complete. Inserted: ${inserted}, Updated: ${updated}, Total mock books: ${mockBooks.length}`);
  } catch (error) {
    console.error('Catalog seed failed:', error);
    process.exitCode = 1;
  } finally {
    await db.sequelize.close();
  }
};

seedBooks();
