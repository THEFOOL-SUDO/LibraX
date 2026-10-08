import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BellIcon, UserCircleIcon, Bars3Icon, XMarkIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import Loader from './Loader';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user, loading, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (loading) return <Loader />;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled ? 'glass backdrop-blur-md shadow-lg py-3' : 'glass py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-2xl font-playfair font-bold bg-gradient-to-r from-navy-900 to-slate-800 dark:from-gold-400 dark:to-gold-300 bg-clip-text text-transparent">
                LibraX
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="relative">
                    <button className="p-2 rounded-xl hover:bg-white/20 transition-colors relative">
                      <BellIcon className="w-6 h-6 text-navy-700 dark:text-gold-300" />
                      {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs text-white rounded-full flex items-center justify-center font-bold animate-pulse">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="w-px h-6 bg-navy-200 dark:bg-navy-700 mx-4" />

                  <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-xl hover:bg-white/20 transition-colors"
                    title={darkMode ? 'Light mode' : 'Dark mode'}
                  >
                    {darkMode ? (
                      <SunIcon className="w-6 h-6 text-yellow-400" />
                    ) : (
                      <MoonIcon className="w-6 h-6 text-navy-700" />
                    )}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-navy-900 dark:text-white bg-white/50 dark:bg-navy-800/50 backdrop-blur-sm rounded-xl hover:bg-white/70 dark:hover:bg-navy-700/70 border border-white/30 hover:border-transparent transition-all duration-200 flex items-center space-x-2 group"
                  >
                    <UserCircleIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="px-6 py-2.5 text-sm font-semibold text-gold-600 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

