import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import requestsApi from '../api/requests.api';
import Loader from '../components/Loader';
import TopCornerLogout from '../components/TopCornerLogout';

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadRequests = async () => {
    try {
      setError('');
      const res = await requestsApi.getRequests();
      setRequests(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      const res = await requestsApi.updateRequest(id, { status });
      const updated = res?.data;
      setRequests((prev) => prev.map((request) => (
        request.id === id ? { ...request, ...(updated || {}), status } : request
      )));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update request.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen scene-bg p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-4xl font-playfair font-bold text-navy-900 dark:text-white">Book Requests</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((request) => (
          <div key={request.id} className="glass-hover p-6 rounded-2xl border border-navy-200/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white">{request.bookTitle}</h3>
                <p className="text-navy-600 dark:text-navy-300">{request.author}</p>
                <p className="text-sm text-navy-500 mt-1">
                  Requested by: {request.student?.name || '-'} ({request.student?.studentId || '-'})
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                request.status === 'approved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : request.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
              }`}>
                {(request.status || 'pending').toUpperCase()}
              </span>
            </div>

            <p className="mt-4 text-sm text-navy-700 dark:text-navy-200">
              {request.reason || 'No reason provided'}
            </p>

            {request.status === 'pending' && (
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => updateStatus(request.id, 'approved')}
                  disabled={busyId === request.id}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(request.id, 'rejected')}
                  disabled={busyId === request.id}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {requests.length === 0 && (
          <div className="glass-hover p-10 rounded-2xl text-center text-navy-500">
            No requests found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRequestsPage;
