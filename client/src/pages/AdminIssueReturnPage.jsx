import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import borrowApi from '../api/borrow.api';
import booksApi from '../api/books.api';
import studentsApi from '../api/students.api';
import Loader from '../components/Loader';
import TopCornerLogout from '../components/TopCornerLogout';

const AdminIssueReturnPage = () => {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [issueForm, setIssueForm] = useState({ studentId: '', bookId: '' });
  const [loading, setLoading] = useState(true);
  const [busyBorrowId, setBusyBorrowId] = useState(null);
  const [submittingIssue, setSubmittingIssue] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setError('');
      const [booksRes, studentsRes, borrowsRes] = await Promise.all([
        booksApi.getBooks({ limit: 100 }),
        studentsApi.getStudents(),
        borrowApi.getAllBorrows({ status: 'active', limit: 50 })
      ]);
      setBooks(Array.isArray(booksRes?.data?.books) ? booksRes.data.books : []);
      setStudents(Array.isArray(studentsRes?.data) ? studentsRes.data : []);
      const borrows = Array.isArray(borrowsRes?.data?.borrows)
        ? borrowsRes.data.borrows.map((borrow) => ({
          ...borrow,
          book: borrow.book || borrow.Book || null
        }))
        : [];
      setActiveBorrows(borrows);
    } catch (err) {
      setError('Failed to load issue/return data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const issueBook = async (e) => {
    e.preventDefault();
    setSubmittingIssue(true);
    setError('');
    setMessage('');

    try {
      await borrowApi.issueBook({
        studentId: Number(issueForm.studentId),
        bookId: Number(issueForm.bookId)
      });
      setMessage('Book issued successfully.');
      setIssueForm({ studentId: '', bookId: '' });
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to issue book.');
    } finally {
      setSubmittingIssue(false);
    }
  };

  const returnBook = async (borrowRecordId) => {
    setBusyBorrowId(borrowRecordId);
    setError('');
    setMessage('');
    try {
      await borrowApi.returnBook({ borrowRecordId });
      setMessage('Book returned successfully.');
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to return book.');
    } finally {
      setBusyBorrowId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen scene-bg p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-4xl font-playfair font-bold text-navy-900 dark:text-white">Issue / Return Books</h1>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="px-5 py-3 rounded-xl bg-white/70 dark:bg-navy-800/70 border border-navy-200 dark:border-navy-700 font-semibold hover:shadow-md transition-all"
          >
            Back to Dashboard
          </Link>
          <TopCornerLogout />
        </div>
      </div>

      {message && (
        <div className="mb-4 p-4 rounded-xl border border-emerald-300 bg-emerald-100/60 text-emerald-900">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 rounded-xl border border-red-300 bg-red-100/60 text-red-900">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-hover p-6 rounded-2xl border border-navy-200/60">
          <h2 className="text-2xl font-bold mb-5 text-navy-900 dark:text-white">Issue Book</h2>
          <form onSubmit={issueBook} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Student</label>
              <select
                value={issueForm.studentId}
                onChange={(e) => setIssueForm((prev) => ({ ...prev, studentId: e.target.value }))}
                required
                className="w-full p-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/80 dark:bg-navy-900/60"
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.studentId || student.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Book</label>
              <select
                value={issueForm.bookId}
                onChange={(e) => setIssueForm((prev) => ({ ...prev, bookId: e.target.value }))}
                required
                className="w-full p-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/80 dark:bg-navy-900/60"
              >
                <option value="">Select a book</option>
                {books
                  .filter((book) => Number(book.availableCopies) > 0)
                  .map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} (available: {book.availableCopies})
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submittingIssue}
              className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold disabled:opacity-60"
            >
              {submittingIssue ? 'Issuing...' : 'Issue Book'}
            </button>
          </form>
        </div>

        <div className="glass-hover p-6 rounded-2xl border border-navy-200/60">
          <h2 className="text-2xl font-bold mb-5 text-navy-900 dark:text-white">Active Borrows</h2>
          <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-2">
            {activeBorrows.map((borrow) => (
              <div key={borrow.id} className="p-4 rounded-xl border border-navy-200/60 bg-white/70 dark:bg-navy-900/40">
                <div className="font-semibold">{borrow.book?.title || 'Unknown Book'}</div>
                <div className="text-sm text-navy-600 dark:text-navy-300">
                  {borrow.student?.name || 'Unknown Student'} ({borrow.student?.studentId || '-'})
                </div>
                <div className="text-xs text-navy-500 mt-1">
                  Due: {borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : '-'}
                </div>
                <button
                  onClick={() => returnBook(borrow.id)}
                  disabled={busyBorrowId === borrow.id}
                  className="mt-3 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {busyBorrowId === borrow.id ? 'Returning...' : 'Mark Returned'}
                </button>
              </div>
            ))}
            {activeBorrows.length === 0 && (
              <div className="text-navy-500 text-center py-8">No active borrows found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIssueReturnPage;
