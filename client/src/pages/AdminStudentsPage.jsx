import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import studentsApi from '../api/students.api';
import Loader from '../components/Loader';
import TopCornerLogout from '../components/TopCornerLogout';

const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadStudents = async () => {
    try {
      setError('');
      const res = await studentsApi.getStudents();
      setStudents(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const deactivateStudent = async (id) => {
    setBusyId(id);
    try {
      await studentsApi.deactivateStudent(id);
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to deactivate student.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen scene-bg p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-4xl font-playfair font-bold text-navy-900 dark:text-white">Manage Students</h1>
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

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-300 bg-red-100/60 text-red-900">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-navy-200/60 bg-white/70 dark:bg-navy-900/40">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy-200/60">
              <th className="p-4">Name</th>
              <th className="p-4">Student ID</th>
              <th className="p-4">Email</th>
              <th className="p-4">Borrows</th>
              <th className="p-4">Unpaid Fines</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-navy-100/70">
                <td className="p-4 font-semibold">{student.name}</td>
                <td className="p-4">{student.studentId || '-'}</td>
                <td className="p-4">{student.email}</td>
                <td className="p-4">{student.borrowCount || 0}</td>
                <td className="p-4">{student.unpaidFinesCount || 0}</td>
                <td className="p-4">
                  <button
                    onClick={() => deactivateStudent(student.id)}
                    disabled={busyId === student.id}
                    className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold disabled:opacity-60"
                  >
                    {busyId === student.id ? 'Deactivating...' : 'Deactivate'}
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td className="p-8 text-center text-navy-500" colSpan={6}>No active students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStudentsPage;
