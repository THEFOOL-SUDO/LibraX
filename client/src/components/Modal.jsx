import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className={`glass-hover w-full max-h-[90vh] overflow-y-auto ${sizeClasses[size]} rounded-2xl shadow-2xl border-white/30`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white/20 dark:bg-navy-900/30 backdrop-blur-sm z-10 border-b border-white/20 rounded-t-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-playfair font-semibold text-navy-900 dark:text-white">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-6 pb-12">
            {children}
          </div>

          <div className="sticky bottom-0 bg-white/20 dark:bg-navy-900/30 backdrop-blur-sm z-10 border-t border-white/20 rounded-b-2xl p-6">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-white/20 hover:bg-white/30 dark:bg-navy-800/50 dark:hover:bg-navy-700/70 backdrop-blur-sm border border-white/30 rounded-xl font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;

