import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const StatCard = ({ title, value, trend, trendType = 'up', icon, color = 'blue' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const rafRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    hasAnimatedRef.current = false;
    setDisplayValue(0);
    const end = Number(value) || 0;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasAnimatedRef.current) {
        return;
      }

      hasAnimatedRef.current = true;
      observer.disconnect();

      if (end <= 0) {
        setDisplayValue(0);
        return;
      }

      const duration = 900;
      const startTime = performance.now();

      const animate = (timestamp) => {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setDisplayValue(Math.floor(progress * end));

        if (progress < 1) {
          rafRef.current = window.requestAnimationFrame(animate);
        } else {
          setDisplayValue(end);
        }
      };

      rafRef.current = window.requestAnimationFrame(animate);
    }, { threshold: 0.2 });

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [value]);

  const colors = {
    gold: 'from-gold-500 to-gold-600',
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600'
  };

  const trendIcon = trendType === 'up' ? '↗' : '↘';

  return (
    <motion.div 
      ref={ref}
      className="glass-hover p-8 rounded-3xl border border-navy-200/50 hover:border-gold-300/50 hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-2"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`w-14 h-14 bg-gradient-to-br ${colors[color]} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm`}>
          <span className="text-xl font-bold text-white">{icon}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          trendType === 'up' ? 'bg-emerald-100 text-emerald-800 shadow-emerald-200/50' : 'bg-red-100 text-red-800 shadow-red-200/50'
        }`}>
          {trendIcon} {trend}
        </div>
      </div>
      
      <div>
        <div className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-2 group-hover:text-[var(--color)] transition-colors">
          {displayValue.toLocaleString()}
        </div>
        <div className="text-lg font-semibold text-navy-600 dark:text-navy-300">
          {title}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;

