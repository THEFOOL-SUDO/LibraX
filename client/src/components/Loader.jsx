import { motion } from 'framer-motion';

const Loader = () => (
  <div className="fixed inset-0 bg-white dark:bg-navy-900 flex items-center justify-center z-50">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full"
    />
  </div>
);

export default Loader;

