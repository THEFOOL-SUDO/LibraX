import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, ArrowRightOnRectangleIcon, ShieldCheckIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const TopCornerLogout = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Smooth exit delay to allow animation to play
    setTimeout(() => {
      logout();
    }, 350);
  };

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <motion.div
      initial={{ opacity: 0, y: -15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-navy-900/70 border border-white/50 dark:border-white/10 shadow-lg shadow-navy-950/5 relative"
    >
      {/* User Info Chip */}
      <div className="flex items-center gap-2.5 pr-2 border-r border-navy-200/50 dark:border-navy-700/50">
        <div className="relative">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-md ${
            isAdmin
              ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/20'
              : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20'
          }`}>
            {initials}
          </div>
          {/* Pulsing online status indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white dark:ring-navy-900"></span>
          </span>
        </div>

        <div className="hidden sm:block text-left">
          <div className="text-xs font-bold text-navy-900 dark:text-white leading-tight flex items-center gap-1">
            <span>{user.name}</span>
            {isAdmin ? (
              <ShieldCheckIcon className="w-3.5 h-3.5 text-red-500" title="Administrator" />
            ) : (
              <AcademicCapIcon className="w-3.5 h-3.5 text-emerald-500" title="Student" />
            )}
          </div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-navy-400 dark:text-navy-400">
            {isAdmin ? 'System Admin' : `ID: ${user.studentId || 'Student'}`}
          </div>
        </div>
      </div>

      {/* Dark / Light Mode Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="p-2 rounded-xl text-navy-600 dark:text-navy-300 hover:text-gold-500 dark:hover:text-gold-400 hover:bg-white/50 dark:hover:bg-navy-800/50 transition-all duration-200"
        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {darkMode ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SunIcon className="w-5 h-5 text-amber-400" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MoonIcon className="w-5 h-5 text-navy-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* The Logout Button with All Effects */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleLogout}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          disabled={isLoggingOut}
          className={`
            relative overflow-hidden group
            px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide
            flex items-center gap-2 transition-all duration-300
            ${isLoggingOut
              ? 'bg-red-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.7)]'
              : 'bg-gradient-to-r from-red-500/10 via-rose-500/15 to-red-500/10 hover:from-red-600 hover:via-rose-600 hover:to-red-700 text-red-600 dark:text-red-300 hover:text-white border border-red-300/40 dark:border-red-500/30 hover:border-transparent hover:shadow-[0_0_25px_rgba(239,68,68,0.5),0_8px_20px_rgba(225,29,72,0.35)]'
            }
          `}
        >
          {/* Continuous subtle ambient glow pulsing behind */}
          <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300 -z-10" />

          {/* Shimmer / Light sweep beam across the button on hover */}
          <span className="absolute inset-0 w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

          {/* Red pulse notification dot */}
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>

          {/* Animated Door / Arrow Icon */}
          <motion.div
            animate={isLoggingOut ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="relative"
          >
            <ArrowRightOnRectangleIcon className={`w-4 h-4 transition-transform duration-300 ${
              isLoggingOut ? '' : 'group-hover:translate-x-1'
            }`} />
          </motion.div>

          {/* Button Text */}
          <span className="relative font-bold">
            {isLoggingOut ? 'Signing Out...' : 'Logout'}
          </span>
        </motion.button>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {showTooltip && !isLoggingOut && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute -bottom-8 right-0 px-2.5 py-1 rounded-lg bg-navy-900/90 text-white text-[11px] font-medium tracking-wide whitespace-nowrap shadow-xl border border-white/10 pointer-events-none z-50 backdrop-blur-md"
            >
              Sign out of session
              <div className="absolute -top-1 right-5 w-2 h-2 bg-navy-900/90 rotate-45 border-l border-t border-white/10" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TopCornerLogout;
