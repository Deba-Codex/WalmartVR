import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSafeStore } from './store/useStore';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { RewardsPanel } from './components/RewardsPanel';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroBanner />
      <CategoryFilter />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductGrid />
          </div>
          <div className="space-y-8">
            <RewardsPanel />
            <AnalyticsDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { isDarkMode, addAnalyticsEvent } = useSafeStore();

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.warn('Theme toggle error:', error);
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      // Track app initialization
      addAnalyticsEvent('app_initialized', {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });

      // Track page visibility changes
      const handleVisibilityChange = () => {
        try {
          addAnalyticsEvent('page_visibility_changed', {
            hidden: document.hidden,
            timestamp: Date.now()
          });
        } catch (error) {
          console.warn('Analytics event error:', error);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } catch (error) {
      console.warn('App initialization error:', error);
    }
  }, [addAnalyticsEvent]);

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'dark' : ''
      }`}>
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;