import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Gift, Trophy, Zap, TrendingUp } from 'lucide-react';
import { useSafeStore } from '../store/useStore';

export function RewardsPanel() {
  const { user, getCoinsToNextTier, rewardActivities } = useSafeStore();

  if (!user) return null;

  const coinsToNextTier = getCoinsToNextTier();
  const tierProgress = coinsToNextTier > 0 ? ((user.shopCoins / (user.shopCoins + coinsToNextTier)) * 100) : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-accent-50 to-yellow-50 dark:from-accent-900 dark:to-yellow-900 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            className="bg-accent-500 p-3 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Coins className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              ShopCoins Rewards
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {user.tier} Member
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-accent-600 dark:text-accent-400">
            {user.shopCoins}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Available Coins
          </div>
        </div>
      </div>

      {/* Progress to Next Tier */}
      {coinsToNextTier > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress to Next Tier
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {coinsToNextTier} coins needed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-accent-400 to-accent-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${tierProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center hover:shadow-lg transition-shadow cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Gift className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Daily Spin
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Win up to 500 coins
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center hover:shadow-lg transition-shadow cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trophy className="w-8 h-8 text-gold-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Leaderboard
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Top earners
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center hover:shadow-lg transition-shadow cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Flash Deals
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Extra coins
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center hover:shadow-lg transition-shadow cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Referrals
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            500 coins per friend
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Recent Activities
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {rewardActivities.slice(0, 5).map((activity) => (
            <motion.div
              key={activity.id}
              className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'earned' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-900 dark:text-white">
                  {activity.description}
                </span>
              </div>
              <span className={`text-sm font-medium ${
                activity.type === 'earned' ? 'text-green-600' : 'text-red-600'
              }`}>
                {activity.type === 'earned' ? '+' : '-'}{activity.amount}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}