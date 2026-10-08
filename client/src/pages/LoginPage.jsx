import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle, loading, success
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const getErrorMessage = (error) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.errors?.[0]?.msg ||
      error?.message ||
      'Login failed'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setStatus('loading');

    try {
      await login(formData.email, formData.password, role);
      setStatus('success');
    } catch (error) {
      setStatus('idle');
      setErrors({ general: getErrorMessage(error) });
    }
  };

  const validateField = (name, value) => {
    if (name === 'email' && !value.includes('@')) {
      return 'Please enter a valid email';
    }
    if (name === 'password' && value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  if (status === 'success') {
    return <Loader />;
  }

  return (
    <div className="min-h-screen landing-canvas flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20"
      >
        <div className="p-8 pb-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gold-400 to-gold-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold bg-gradient-to-r from-navy-900 via-slate-800 to-navy-900 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-navy-600 dark:text-navy-300 text-lg">
              Sign in to your account
            </p>
          </div>

          {errors.general && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-400 text-red-700 dark:text-red-200 rounded-xl backdrop-blur-sm"
            >
              {errors.general}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder=" "
                className={`w-full px-4 py-4 text-lg border-2 border-navy-200 dark:border-navy-700 rounded-2xl bg-white/50 dark:bg-navy-900/50 backdrop-blur-sm focus:outline-none focus:border-gold-500 transition-all duration-300 peer ${
                  errors.email ? 'border-red-400 focus:border-red-400' : ''
                }`}
              />
              <label className="absolute left-4 top-4 text-lg text-navy-500 dark:text-navy-400 px-2 transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-gold-600 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-gold-600 bg-white/70 dark:bg-navy-900/70 rounded-lg peer-focus:bg-gold-50">
                Email Address
              </label>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder=" "
                className={`w-full px-4 py-4 text-lg border-2 border-navy-200 dark:border-navy-700 rounded-2xl bg-white/50 dark:bg-navy-900/50 backdrop-blur-sm focus:outline-none focus:border-gold-500 transition-all duration-300 peer pr-12 ${
                  errors.password ? 'border-red-400 focus:border-red-400' : ''
                }`}
              />
              <label className="absolute left-4 top-4 text-lg text-navy-500 dark:text-navy-400 px-2 transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-gold-600 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-gold-600 bg-white/70 dark:bg-navy-900/70 rounded-lg peer-focus:bg-gold-50">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/30 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  )}
                </svg>
              </button>
            </div>

            <div className="flex space-x-1 mb-8">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 p-3 rounded-xl font-semibold transition-all duration-200 ${
                  role === 'student' 
                    ? 'bg-gold-500 text-white shadow-lg' 
                    : 'glass-hover border border-navy-200 dark:border-navy-700'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 p-3 rounded-xl font-semibold transition-all duration-200 ${
                  role === 'admin' 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                    : 'glass-hover border border-navy-200 dark:border-navy-700'
                }`}
              >
                Admin
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 px-8 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                  </svg>
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 dark:border-navy-700/50">
            <p className="text-xs text-center text-slate-400 mb-2 font-medium">Quick Demo Credentials:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  setFormData({ email: 'admin@library.com', password: 'Admin@123' });
                }}
                className="flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-gold-400 border border-gold-500/30 transition-all"
              >
                ⚡ Fill Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('student');
                  setFormData({ email: 'john@student.com', password: 'Student@123' });
                }}
                className="flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-emerald-400 border border-emerald-500/30 transition-all"
              >
                ⚡ Fill Student
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-navy-500 dark:text-navy-400">
              Don't have an account?{' '}
              <a href="/register" className="font-semibold text-gold-600 hover:text-gold-700 transition-colors">
                Create one
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

