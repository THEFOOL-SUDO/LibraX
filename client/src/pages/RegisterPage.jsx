import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const RegisterPage = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const { register } = useAuth();

  const getErrorMessage = (error) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.errors?.[0]?.msg ||
      error?.message ||
      'Registration failed'
    );
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setPasswordScore(score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setStatus('loading');

    try {
      await register({ ...formData, role });
      setStatus('success');
    } catch (error) {
      setStatus('idle');
      setErrors({ general: getErrorMessage(error) });
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return !value.includes('@') ? 'Please enter a valid email' : '';
      case 'password':
        return value.length < 6 ? 'Password must be at least 6 characters' : '';
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : '';
      case 'studentId':
        return role === 'student' && !value ? 'Student ID is required' : '';
      default:
        return '';
    }
  };

  if (status === 'success') {
    return <Loader />;
  }

  const fieldError = (name) => errors[name];

  return (
    <div className="min-h-screen landing-canvas flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-lg backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20"
      >
        <div className="p-8 pb-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-4a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-violet-600 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-navy-600 dark:text-navy-300 text-lg">
              Join LibraX today
            </p>
          </div>

          {errors.general && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-400 text-red-700 dark:text-red-200 rounded-xl backdrop-blur-sm animate-shake"
            >
              {errors.general}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder=" "
                className={`w-full px-4 py-4 text-lg border-2 border-navy-200 dark:border-navy-700 rounded-2xl bg-white/50 dark:bg-navy-900/50 backdrop-blur-sm focus:outline-none focus:border-emerald-500 transition-all duration-300 peer ${
                  fieldError('name') ? 'border-red-400' : ''
                }`}
              />
              <label className="absolute left-4 top-4 text-lg text-navy-500 dark:text-navy-400 px-2 transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-emerald-600 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-emerald-600 bg-white/70 dark:bg-navy-900/70 rounded-lg peer-focus:bg-emerald-50">
                Full Name
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder=" "
                className={`w-full px-4 py-4 text-lg border-2 border-navy-200 dark:border-navy-700 rounded-2xl bg-white/50 dark:bg-navy-900/50 backdrop-blur-sm focus:outline-none focus:border-emerald-500 transition-all duration-300 peer ${
                  fieldError('email') ? 'border-red-400' : ''
                }`}
              />
              <label className="absolute left-4 top-4 text-lg text-navy-500 dark:text-navy-400 px-2 transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-emerald-600 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-emerald-600 bg-white/70 dark:bg-navy-900/70 rounded-lg peer-focus:bg-emerald-50">
                Email Address
              </label>
            </div>

            {role === 'student' && (
              <div className="relative">
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder=" "
                  className={`w-full px-4 py-4 text-lg border-2 border-navy-200 dark:border-navy-700 rounded-2xl bg-white/50 dark:bg-navy-900/50 backdrop-blur-sm focus:outline-none focus:border-emerald-500 transition-all duration-300 peer ${
                    fieldError('studentId') ? 'border-red-400' : ''
                  }`}
                />
                <label className="absolute left-4 top-4 text-lg text-navy-500 dark:text-navy-400 px-2 transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-emerald-600 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-emerald-600 bg-white/70 dark:bg-navy-900/70 rounded-lg peer-focus:bg-emerald-50">
                  Student ID
                </label>
              </div>
            )}

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  checkPasswordStrength(e.target.value);
                }}
                placeholder=" "
                className={`w-full px-4 py-4 text-lg border-2 border-navy-200 dark:border-navy-700 rounded-2xl bg-white/50 dark:bg-navy-900/50 backdrop-blur-sm focus:outline-none focus:border-emerald-500 transition-all duration-300 peer pr-12 ${
                  fieldError('password') ? 'border-red-400' : ''
                }`}
              />
              <label className="absolute left-4 top-4 text-lg text-navy-500 dark:text-navy-400 px-2 transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-emerald-600 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-emerald-600 bg-white/70 dark:bg-navy-900/70 rounded-lg peer-focus:bg-emerald-50">
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

            {/* Password Strength Bar */}
            <div className="space-y-2">
              <div className="flex space-x-1 h-2 bg-navy-200 dark:bg-navy-700 rounded-full overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-full transition-all duration-300 flex-1 ${
                      passwordScore > i
                        ? i < 2 ? 'bg-red-400' : i < 3 ? 'bg-yellow-400' : i < 4 ? 'bg-gold-400' : 'bg-emerald-400'
                        : 'bg-transparent'
                    }`}
                    style={{ width: passwordScore > i ? '100%' : '20%' }}
                  />
                ))}
              </div>
              <p className="text-xs text-navy-500 dark:text-navy-400">
                Password strength: {passwordScore < 3 ? 'Weak' : passwordScore < 4 ? 'Good' : 'Strong'}
              </p>
            </div>

            <div className="flex space-x-1 mb-8">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 p-3 rounded-xl font-semibold transition-all duration-200 ${
                  role === 'student' 
                    ? 'bg-emerald-500 text-white shadow-lg' 
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
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg' 
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
              disabled={status === 'loading' || passwordScore < 3}
              className="w-full py-4 px-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-violet-600 hover:from-emerald-600 hover:via-teal-600 hover:to-violet-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Create Account</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-navy-500 dark:text-navy-400">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

