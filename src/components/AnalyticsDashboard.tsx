import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Eye, Smartphone, Headset } from 'lucide-react';
import { useStore } from '../store/useStore';

export function AnalyticsDashboard() {
  const { analyticsData, getAnalyticsStats } = useStore();
  const stats = getAnalyticsStats();

  const chartData = [
    { name: 'AR Views', value: stats.arViews, color: '#8b5cf6' },
    { name: 'VR Views', value: stats.vrViews, color: '#3b82f6' },
    { name: 'Customizations', value: stats.customizations, color: '#10b981' },
    { name: 'Cart Additions', value: stats.cartAdditions, color: '#f59e0b' },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 p-3 rounded-full">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AR/VR Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time engagement metrics
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalInteractions}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Interactions
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          className="bg-purple-50 dark:bg-purple-900 p-4 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-3">
            <Smartphone className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.arViews}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                AR Views
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-blue-50 dark:bg-blue-900 p-4 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-3">
            <Headset className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.vrViews}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                VR Views
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-green-50 dark:bg-green-900 p-4 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-3">
            <Eye className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.customizations}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Customizations
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {((stats.cartAdditions / stats.totalInteractions) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">
                Conversion
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Engagement Breakdown
        </h3>
        {chartData.map((item, index) => (
          <motion.div
            key={item.name}
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.name}
            </div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                className="h-3 rounded-full"
                style={{ backgroundColor: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
            <div className="w-12 text-sm font-bold text-gray-900 dark:text-white">
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Recent Events
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {analyticsData.slice(0, 5).map((event) => (
            <motion.div
              key={event.id}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  event.type.includes('ar') ? 'bg-purple-500' :
                  event.type.includes('vr') ? 'bg-blue-500' :
                  event.type.includes('customization') ? 'bg-green-500' :
                  'bg-yellow-500'
                }`} />
                <span className="text-sm text-gray-900 dark:text-white">
                  {event.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}