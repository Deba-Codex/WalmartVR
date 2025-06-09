import React from 'react';
import { Search, ShoppingCart, User, Moon, Sun, Coins } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const {
    isDarkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    cartItems,
    getCartItemsCount,
    user,
    isAuthenticated
  } = useStore();

  const cartItemsCount = getCartItemsCount();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-500">
              WalmartVR
            </div>
            <div className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
              AR/VR Shopping
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* ShopCoins Display */}
            {isAuthenticated && user && (
              <motion.div 
                className="flex items-center space-x-2 bg-gradient-to-r from-accent-400 to-accent-500 text-white px-3 py-1 rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Coins className="w-4 h-4" />
                <span className="font-semibold">{user.shopCoins}</span>
                <span className="text-xs opacity-80">Coins</span>
              </motion.div>
            )}

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>

            {/* Cart */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ShoppingCart className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
              <AnimatePresence>
                {cartItemsCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
                  >
                    {cartItemsCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* User Profile */}
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              {isAuthenticated && user && (
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-xs text-accent-500 font-medium">
                    {user.tier} Member
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}