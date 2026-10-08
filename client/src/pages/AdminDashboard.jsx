import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import booksApi from '../api/books.api';
import borrowApi from '../api/borrow.api';
import studentsApi from '../api/students.api';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import TopCornerLogout from '../components/TopCornerLogout';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeBorrows: 0,
    totalStudents: 0,
    overdueBooks: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentBorrows, setRecentBorrows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [booksRes, borrowsRes, studentsRes, overdueRes] = await Promise.allSettled([
        booksApi.getBooks({ limit: 1 }),
        borrowApi.getAllBorrows({ limit: 10 }),
        studentsApi.getStudents(),
        borrowApi.getOverdue()
      ]);

      const booksData = booksRes.status === 'fulfilled' ? booksRes.value.data : { total: 0 };
      const borrowsData = borrowsRes.status === 'fulfilled' ? borrowsRes.value.data : { total: 0, borrows: [] };
      const studentsData = studentsRes.status === 'fulfilled' ? studentsRes.value.data : [];
      const overdueData = overdueRes.status === 'fulfilled' ? overdueRes.value.data : [];

      if (booksRes.status === 'rejected') console.error('Books API failed:', booksRes.reason);
      if (borrowsRes.status === 'rejected') console.error('Borrows API failed:', borrowsRes.reason);
      if (studentsRes.status === 'rejected') console.error('Students API failed:', studentsRes.reason);
      if (overdueRes.status === 'rejected') console.error('Overdue API failed:', overdueRes.reason);

      setStats({
        totalBooks: Number(booksData?.total || 0),
        activeBorrows: Number(borrowsData?.total || 0),
        totalStudents: Array.isArray(studentsData) ? studentsData.length : 0,
        overdueBooks: Array.isArray(overdueData) ? overdueData.length : 0
      });

      const normalizedBorrows = Array.isArray(borrowsData?.borrows)
        ? borrowsData.borrows.map((borrow) => ({
          ...borrow,
          book: borrow.book || borrow.Book || null
        }))
        : [];
      setRecentBorrows(normalizedBorrows.slice(0, 5));
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen scene-bg p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-4a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-playfair font-bold text-navy-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-navy-600 dark:text-navy-300">
                Welcome back, <span className="font-semibold">{user.name}</span>
              </p>
            </div>
          </div>

          {/* Top Right Corner Controls */}
          <TopCornerLogout />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
      >
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          trend="+12%"
          trendType="up"
          icon="📚"
          color="gold"
        />
        <StatCard
          title="Active Borrows"
          value={stats.activeBorrows}
          trend="-3%"
          trendType="down"
          icon="📖"
          color="emerald"
        />
        <StatCard
          title="Students"
          value={stats.totalStudents}
          trend="+8%"
          trendType="up"
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Overdue"
          value={stats.overdueBooks}
          trend="+2"
          trendType="up"
          icon="⚠️"
          color="red"
        />
      </motion.section>

      {/* Quick Actions */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-8">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.button
            onClick={() => navigate('/admin/catalog')}
            className="group glass-hover p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 h-32 flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-semibold text-lg text-navy-900 dark:text-white group-hover:text-blue-600">Manage Books</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/admin/issue-return')}
            className="group glass-hover p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 h-32 flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <span className="font-semibold text-lg text-navy-900 dark:text-white group-hover:text-emerald-600">Issue/Return</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/admin/students')}
            className="group glass-hover p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 h-32 flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-semibold text-lg text-navy-900 dark:text-white group-hover:text-purple-600">Manage Students</span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/admin/requests')}
            className="group glass-hover p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 h-32 flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="font-semibold text-lg text-navy-900 dark:text-white group-hover:text-orange-600">Book Requests</span>
          </motion.button>
        </div>
      </motion.section>

      {/* Recent Activity & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-hover p-8 rounded-3xl"
        >
          <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-8">Recent Transactions</h3>
          <div className="space-y-4">
            {recentBorrows.length ? (
              recentBorrows.map((borrow, index) => (
                <div key={borrow.id} className="flex items-center p-4 glass-hover rounded-2xl border border-navy-200/50 hover:border-gold-300/50 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4">
                    {borrow.book?.title?.[0] || 'B'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy-900 dark:text-white truncate">
                      {borrow.book?.title}
                    </p>
                    <p className="text-sm text-navy-500 dark:text-navy-400 truncate">
                      {borrow.student?.name} • {borrow.student?.studentId}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      borrow.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                      borrow.status === 'returned' ? 'bg-slate-100 text-slate-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {borrow.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-navy-500 dark:text-navy-400">
                No recent transactions
              </div>
            )}
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-hover p-8 rounded-3xl"
        >
          <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-8">Overdue Alerts</h3>
          <div className="space-y-4">
            {stats.overdueBooks > 0 ? (
              Array.from({ length: stats.overdueBooks }, (_, i) => (
                <div key={i} className="flex items-center p-4 bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-2xl">
                  <div className="w-10 h-10 bg-red-500/20 border-2 border-red-500/50 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-red-900 dark:text-red-100 mb-1">
                      Book overdue
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Student - STU001 • 3 days overdue
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">
                    Send Reminder
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-emerald-600 dark:text-emerald-400">
                🎉 No overdue books! Everything is on track.
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AdminDashboard;

