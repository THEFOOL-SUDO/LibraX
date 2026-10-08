import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import borrowApi from '../api/borrow.api';
import requestsApi from '../api/requests.api';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import TopCornerLogout from '../components/TopCornerLogout';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    activeBorrows: [],
    borrowHistory: [],
    overdueCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [requestForm, setRequestForm] = useState({
    bookTitle: '',
    author: '',
    reason: ''
  });
  const [requestStatus, setRequestStatus] = useState('idle');
  const [requestMessage, setRequestMessage] = useState('');
  const [returnRequestingId, setReturnRequestingId] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;
    const fetchData = async () => {
      try {
        const borrowsRes = await borrowApi.getStudentBorrows(user.id);
        const rawBorrows = Array.isArray(borrowsRes?.data)
          ? borrowsRes.data
          : (borrowsRes?.data ? [borrowsRes.data] : []);
        const borrowHistory = rawBorrows.map((borrow) => ({
          ...borrow,
          book: borrow.book || borrow.Book || null
        }));
        const now = new Date();
        const activeBorrows = borrowHistory.filter((borrow) => borrow.status === 'active');
        const overdueCount = borrowHistory.filter((borrow) => (
          borrow.status === 'overdue' ||
          (borrow.status === 'active' && new Date(borrow.dueDate) < now)
        )).length;

        if (!cancelled) {
          setData({
            activeBorrows,
            borrowHistory,
            overdueCount
          });
        }
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handleRequestInputChange = (e) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({ ...prev, [name]: value }));
    if (requestStatus !== 'idle') {
      setRequestStatus('idle');
      setRequestMessage('');
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestStatus('loading');
    setRequestMessage('');

    try {
      await requestsApi.createRequest({
        bookTitle: requestForm.bookTitle.trim(),
        author: requestForm.author.trim(),
        reason: requestForm.reason.trim()
      });

      setRequestForm({
        bookTitle: '',
        author: '',
        reason: ''
      });
      setRequestStatus('success');
      setRequestMessage('Request submitted successfully.');
    } catch (error) {
      setRequestStatus('error');
      setRequestMessage(
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.msg ||
        'Could not submit request.'
      );
    }
  };

  const handleReturnRequest = async (borrow) => {
    setReturnRequestingId(borrow.id);
    setRequestStatus('loading');
    setRequestMessage('');

    try {
      await requestsApi.createRequest({
        bookTitle: (borrow.book || borrow.Book)?.title || 'Unknown Book',
        author: (borrow.book || borrow.Book)?.author || 'Unknown Author',
        reason: `Return request for borrow record #${borrow.id}`
      });
      setRequestStatus('success');
      setRequestMessage('Return request submitted successfully.');
    } catch (error) {
      setRequestStatus('error');
      setRequestMessage(
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.msg ||
        'Could not submit return request.'
      );
    } finally {
      setReturnRequestingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen scene-bg p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg text-2xl font-bold text-white">
              {user.name.split(' ').map((name) => name[0]).join('')}
            </div>
            <div>
              <h1 className="text-4xl font-playfair font-bold text-navy-900 dark:text-white">
                Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {user.name}
              </h1>
              <p className="text-navy-600 dark:text-navy-300 text-lg">
                Student ID: <span className="font-mono font-semibold">{user.studentId}</span>
              </p>
            </div>
          </div>

          {/* Top Right Corner Controls */}
          <TopCornerLogout />
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
      >
        <StatCard title="Active Borrows" value={data.activeBorrows.length} trend="0" icon="B" color="emerald" />
        <StatCard title="Total History" value={data.borrowHistory.length} trend="+2" trendType="up" icon="H" color="blue" />
        <StatCard title="Overdue" value={data.overdueCount} trend="0" icon="!" color="red" />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-8">Currently Borrowed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto pb-4 -mx-2 px-2">
          {data.activeBorrows.length ? (
            data.activeBorrows.map((borrow) => (
              <motion.div
                key={borrow.id}
                className="glass-hover p-6 rounded-2xl border border-navy-200/50 hover:border-emerald-400/50 group"
                whileHover={{ y: -4 }}
              >
                <div className="w-20 h-28 rounded-xl mb-4 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-navy-700 dark:to-slate-800">
                  {borrow.book?.coverImage ? (
                    <img
                      src={borrow.book.coverImage}
                      alt={`${borrow.book.title || 'Book'} cover`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-300 text-xl font-bold">
                      {borrow.book?.title?.charAt(0) || 'B'}
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-navy-900 dark:text-white mb-2 truncate">
                  {borrow.book?.title || 'Book Title'}
                </h4>
                <p className="text-sm text-navy-500 dark:text-navy-400 mb-4">
                  {borrow.book?.author || 'Author Name'}
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-navy-500 dark:text-navy-400">Issued:</span>
                    <span className="font-mono">{new Date(borrow.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-emerald-600">
                    <span>Due:</span>
                    <span>{new Date(borrow.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-navy-200/50">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    ACTIVE
                  </span>
                  <button
                    onClick={() => handleReturnRequest(borrow)}
                    disabled={returnRequestingId === borrow.id}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors disabled:opacity-60"
                  >
                    {returnRequestingId === borrow.id ? 'Submitting...' : 'Request Return'}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full glass-hover p-16 rounded-2xl text-center border-2 border-dashed border-navy-200/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">No Active Borrows</h3>
              <p className="text-navy-500 dark:text-navy-400 mb-6">Great job keeping up with returns!</p>
              <Link
                to="/student/catalog"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1"
              >
                Browse Books -&gt;
              </Link>
            </motion.div>
          )}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-hover p-8 rounded-3xl border border-navy-200/50"
      >
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-8">Request a Book</h2>

        {requestStatus === 'success' && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-300 bg-emerald-100/60 text-emerald-900">
            {requestMessage}
          </div>
        )}
        {requestStatus === 'error' && (
          <div className="mb-6 p-4 rounded-xl border border-red-300 bg-red-100/60 text-red-900">
            {requestMessage}
          </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={handleRequestSubmit}>
          <div>
            <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-2">Book Title</label>
            <input
              name="bookTitle"
              type="text"
              required
              value={requestForm.bookTitle}
              onChange={handleRequestInputChange}
              className="w-full p-4 border border-navy-200 dark:border-navy-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800/50 bg-white/50 dark:bg-navy-900/50 backdrop-blur-sm"
              placeholder="Enter book title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-2">Author</label>
            <input
              name="author"
              type="text"
              required
              value={requestForm.author}
              onChange={handleRequestInputChange}
              className="w-full p-4 border border-navy-200 dark:border-navy-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800/50 bg-white/50 dark:bg-navy-900/50 backdrop-blur-sm"
              placeholder="Author name"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-2">Reason</label>
            <textarea
              name="reason"
              value={requestForm.reason}
              onChange={handleRequestInputChange}
              className="flex-1 p-4 border border-navy-200 dark:border-navy-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800/50 bg-white/50 dark:bg-navy-900/50 backdrop-blur-sm resize-none"
              rows="3"
              placeholder="Why do you need this book?"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={requestStatus === 'loading'}
            className="md:col-span-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 col-span-full disabled:opacity-60"
          >
            {requestStatus === 'loading' ? 'Submitting...' : 'Submit Request'}
          </motion.button>
        </form>
      </motion.section>
    </div>
  );
};

export default StudentDashboard;
