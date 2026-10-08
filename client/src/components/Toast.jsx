import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'success', onClose, id }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.95 }}
        className={`glass fixed top-20 right-6 p-4 rounded-xl shadow-2xl z-[10000] max-w-sm ${
          type === 'success' ? 'border-green-400 bg-green-500/10 text-green-100' :
          type === 'error' ? 'border-red-400 bg-red-500/10 text-red-100' :
          'border-gold-400 bg-gold-500/10 text-gold-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{message}</p>
          </div>
          <button
            onClick={() => onClose(id)}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-white font-bold text-sm"
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;

