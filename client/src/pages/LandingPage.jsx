import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BookOpenIcon, ChartBarIcon, UsersIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
  const [stats, setStats] = useState({ books: 0, students: 0, borrows: 0, genres: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => {
        const next = {
          ...prev,
          books: Math.min(prev.books + 100, 10000),
          students: Math.min(prev.students + 8, 500),
          borrows: Math.min(prev.borrows + 5, 99)
        };

        if (next.books === 10000 && next.students === 500 && next.borrows === 99) {
          clearInterval(timer);
        }

        return next;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: 'Smart Catalog',
      description: 'Find books instantly with advanced search, filters and recommendations.',
      icon: BookOpenIcon
    },
    {
      title: 'Easy Borrowing',
      description: 'Issue, return and track books with real-time availability updates.',
      icon: ChartBarIcon
    },
    {
      title: 'Admin Control',
      description: 'Complete management dashboard for administrators with analytics.',
      icon: UsersIcon
    },
    {
      title: 'Request System',
      description: 'Request new books that you want - library staff will notify you.',
      icon: LightBulbIcon
    }
  ];

  const testimonials = [
    { quote: 'LibraX transformed our library operations completely!', name: 'Library Admin', role: 'Admin' },
    { quote: 'Super easy to find and borrow books now!', name: 'Sarah Johnson', role: 'Student' },
    { quote: 'Best library management system we\'ve used!', name: 'David Chen', role: 'Librarian' },
    { quote: 'Love the mobile experience and notifications!', name: 'Emily Davis', role: 'Student' }
  ];

  return (
    <div className="min-h-screen landing-canvas overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-navy-900/20 to-transparent"
          style={{ 
            transform: `translateY(${scrollY * 0.3}px)` 
          }}
        />
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute left-20 bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="text-center text-white relative z-10 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl bg-white/10 dark:bg-slate-900/40 border border-white/20 text-gold-300 mb-6 shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Spring Boot 3 • Spring Data JPA • MySQL 8.0 • Interactive 3D Canvas
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold bg-gradient-to-r from-gold-300 via-white to-gold-100 bg-clip-text text-transparent mb-6 leading-tight drop-shadow-sm"
          >
            LibraX
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent text-3xl md:text-5xl lg:text-6xl mt-3 font-semibold">
              Where Knowledge Meets 3D Innovation
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-100 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Step into the next dimension of learning. Discover, borrow, and immerse yourself in a universe of infinite knowledge.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/login"
              className="group relative px-9 py-4 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-lg font-bold text-slate-950 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden flex items-center gap-2"
            >
              <span>Explore Library Portal</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/login"
              className="px-9 py-4 glass text-lg font-semibold text-white rounded-2xl backdrop-blur-xl hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 border border-white/30"
            >
              Staff & Admin Console
            </Link>
          </motion.div>
        </div>

        {/* Floating 3D Book */}
        <motion.div 
          animate={{ rotateY: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 right-20 w-32 h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-navy-700 dark:to-slate-800 rounded-2xl shadow-2xl rotate-12"
          style={{ transformStyle: 'preserve-3d' }}
        />
      </section>

      {/* Stats Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent mb-4">
                {Math.floor(stats.books).toLocaleString()}
              </div>
              <div className="text-xl text-navy-600 dark:text-navy-300 font-semibold">Books</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-4">
                {stats.students}
              </div>
              <div className="text-xl text-navy-600 dark:text-navy-300 font-semibold">Students</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent mb-4">
                {stats.borrows}%
              </div>
              <div className="text-xl text-navy-600 dark:text-navy-300 font-semibold">Uptime</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent mb-4">
                6+
              </div>
              <div className="text-xl text-navy-600 dark:text-navy-300 font-semibold">Years</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-slate-50 to-transparent dark:from-navy-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-navy-900 to-slate-800 dark:from-white dark:to-gold-200 bg-clip-text text-transparent mb-6"
            >
              Everything you need
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl text-navy-600 dark:text-navy-300 max-w-2xl mx-auto"
            >
              Powerful features for both students and administrators. 
              Built with modern technology for lightning fast performance.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group p-8 glass-hover rounded-2xl h-full border border-navy-200/50 hover:border-gold-300/50 hover:shadow-xl transition-all duration-500 cursor-pointer"
                  style={{ '--i': index }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm shadow-lg">
                    <Icon className="w-8 h-8 text-gold-500 group-hover:text-gold-400" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-4 group-hover:text-gold-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/3 via-transparent to-emerald-500/3" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-navy-900 to-slate-800 dark:from-gold-400 dark:to-white bg-clip-text text-transparent mb-6">
              What people are saying
            </h2>
            <p className="text-xl text-navy-600 dark:text-navy-300 max-w-2xl mx-auto">
              Don't just take our word for it
            </p>
          </div>

          <div className="overflow-hidden">
            <motion.div 
              className="flex gap-8"
              animate={{ x: [0, -50 * (testimonials.length)] }}
              transition={{ 
                duration: 40, 
                repeat: Infinity, 
                ease: 'linear' 
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  className="glass-hover min-w-[400px] p-10 rounded-3xl backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 flex-shrink-0 border border-white/20 hover:border-gold-300/50 hover:cursor-grab active:cursor-grabbing"
                >
                  <p className="text-xl text-navy-700 dark:text-navy-200 italic mb-6 leading-relaxed font-medium">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-navy-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-navy-500 dark:text-navy-400">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-navy-900 via-slate-800 to-navy-900 bg-clip-text text-transparent mb-6"
          >
            Ready to get started?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-navy-600 dark:text-navy-300 mb-12 max-w-2xl mx-auto"
          >
            Join thousands of students and administrators who trust LibraX for their library management.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/login"
              className="group px-12 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-xl font-semibold text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 w-full sm:w-auto"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-12 py-4 border-2 border-navy-200 dark:border-navy-700 text-xl font-semibold text-navy-900 dark:text-white rounded-2xl backdrop-blur-sm hover:bg-navy-50 dark:hover:bg-navy-800/50 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
            >
              View Dashboard
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

