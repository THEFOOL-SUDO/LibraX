import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import booksApi from '../api/books.api';
import borrowApi from '../api/borrow.api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import TopCornerLogout from '../components/TopCornerLogout';

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  }
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const CatalogPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [search, setSearch] = useState('');

  // Fetch unique genres once
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await booksApi.getGenres();
        setGenres(res.data || []);
      } catch (err) {
        // Fallback gracefully
      }
    };
    fetchGenres();
  }, []);

  // Fetch books
  useEffect(() => {
    let cancelled = false;
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await booksApi.getBooks({
          limit: 100,
          search: search.trim() || undefined,
          genre: selectedGenre !== 'all' ? selectedGenre : undefined
        });
        const rows = res?.data?.books ?? [];
        if (!cancelled) {
          setBooks(rows);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load catalog.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBooks();
    return () => {
      cancelled = true;
    };
  }, [search, selectedGenre]);

  const handleQuickBorrow = async (book) => {
    if (user?.role !== 'student') return;
    if (book.availableCopies <= 0) return;

    try {
      setBorrowingId(book.id);
      await borrowApi.borrowBook({ bookId: book.id, days: 14 });
      setToast({ show: true, message: `Successfully borrowed "${book.title}"! Due in 14 days.`, type: 'success' });
      // Update local state
      setBooks(prev => prev.map(b => b.id === book.id ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b));
    } catch (err) {
      setToast({ show: true, message: err?.response?.data?.message || 'Failed to borrow book.', type: 'error' });
    } finally {
      setBorrowingId(null);
    }
  };

  const isAdmin = user?.role === 'admin';
  const dashboardPath = isAdmin ? '/admin/dashboard' : '/student/dashboard';
  const title = isAdmin ? 'Master Book Catalog' : 'Explore Library Catalog';

  const stats = useMemo(() => {
    const total = books.length;
    const available = books.filter((book) => Number(book.availableCopies) > 0).length;
    return { total, available };
  }, [books]);

  if (loading && books.length === 0) return <Loader />;

  return (
    <div className="min-h-screen p-6 md:p-10 relative">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Header Banner */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20 mb-2">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
              Live Catalog • Spring Boot 3 & MySQL
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{title}</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Curated volume collection: <span className="font-semibold text-slate-900 dark:text-white">{stats.total} titles</span> • Available now: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.available} titles</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={dashboardPath}
              className="px-5 py-2.5 rounded-xl glass font-semibold text-slate-800 dark:text-slate-100 hover:scale-105 transition-all shadow-md"
            >
              ← Back to Dashboard
            </Link>
            <TopCornerLogout />
          </div>
        </div>
      </motion.div>

      {/* Search & Genre Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or keyword..."
            className="w-full px-4 py-3 pl-11 rounded-xl glass-card text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
          />
          <svg className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Genre Pill Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedGenre('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre === 'all'
                ? 'bg-slate-900 text-white dark:bg-gold-500 dark:text-slate-950 shadow-md'
                : 'glass text-slate-600 dark:text-slate-300 hover:bg-white/30'
            }`}
          >
            All Genres
          </button>
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === g
                  ? 'bg-slate-900 text-white dark:bg-gold-500 dark:text-slate-950 shadow-md'
                  : 'glass text-slate-600 dark:text-slate-300 hover:bg-white/30'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Book Grid */}
      {books.length === 0 ? (
        <div className="glass-card p-16 text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center text-2xl">
            📖
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No Books Matched</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your keyword or choosing a different genre.</p>
        </div>
      ) : (
        <motion.div
          key={`${search.trim()}-${selectedGenre}-${books.length}`}
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {books.map((book) => {
            const isAvailable = Number(book.availableCopies) > 0;
            return (
              <motion.div
                key={book.id}
                variants={cardVariants}
                className="group glass-card-hover p-4 flex flex-col justify-between"
              >
                <div>
                  {/* Cover Container */}
                  <div className="h-56 rounded-xl bg-slate-200 dark:bg-slate-800 mb-4 overflow-hidden relative shadow-inner">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={`${book.title} cover`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-4xl font-serif text-slate-400 dark:text-slate-600 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                        <span>📚</span>
                        <span className="text-xs font-sans uppercase tracking-widest mt-2 text-slate-400">Library Edition</span>
                      </div>
                    )}

                    {/* Genre Badge */}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md bg-black/60 text-white shadow-sm">
                      {book.genre || 'General'}
                    </span>

                    {/* Stock Status Indicator */}
                    <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm flex items-center gap-1.5 ${
                      isAvailable ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40' : 'bg-red-950/70 text-red-300 border border-red-500/40'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                      {isAvailable ? `${book.availableCopies} Left` : 'Checked Out'}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-gold-500 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                    by {book.author}
                  </p>

                  {/* Description preview */}
                  {book.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                      {book.description}
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/80 mt-auto">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                    <span>ISBN: {book.isbn ? book.isbn.slice(0, 13) : 'N/A'}</span>
                    <span>Total: {book.totalCopies}</span>
                  </div>

                  {user?.role === 'student' && (
                    <button
                      onClick={() => handleQuickBorrow(book)}
                      disabled={!isAvailable || borrowingId === book.id}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${
                        isAvailable
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 hover:scale-[1.02] active:scale-95'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {borrowingId === book.id ? (
                        <span>Borrowing...</span>
                      ) : isAvailable ? (
                        <>
                          <span>⚡ Borrow Volume (14 Days)</span>
                        </>
                      ) : (
                        <span>Currently Unavailable</span>
                      )}
                    </button>
                  )}

                  {isAdmin && (
                    <div className="text-center py-1">
                      <span className="text-xs text-slate-400">Managed via Admin Dashboard</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default CatalogPage;
