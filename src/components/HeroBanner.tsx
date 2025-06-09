import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Headset as VrHeadset, Coins, Sparkles } from 'lucide-react';

export function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 border-2 border-white rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Sparkles className="w-5 h-5 text-accent-300" />
              <span className="text-sm font-medium">New AR/VR Experience</span>
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Shop in the
              <span className="block text-accent-300">Future</span>
            </h1>
            
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Experience immersive shopping with AR/VR technology. Try products virtually, earn ShopCoins, and revolutionize your shopping journey.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <motion.div
                className="flex items-center space-x-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              >
                <Smartphone className="w-6 h-6 text-purple-300" />
                <span className="font-medium">AR Try-On</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              >
                <VrHeadset className="w-6 h-6 text-blue-300" />
                <span className="font-medium">VR Shopping</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              >
                <Coins className="w-6 h-6 text-accent-300" />
                <span className="font-medium">ShopCoins Rewards</span>
              </motion.div>
            </div>

            <motion.button
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-2xl"
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Shopping
            </motion.button>
          </motion.div>

          {/* Right Content - 3D Visualization */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full h-96 bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 flex items-center justify-center">
              <motion.div
                className="text-center"
                animate={{ 
                  rotateY: [0, 15, -15, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="text-8xl mb-4">🛒</div>
                <h3 className="text-2xl font-bold mb-2">Virtual Shopping</h3>
                <p className="text-gray-200">Experience products before you buy</p>
              </motion.div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute top-4 right-4 bg-purple-500 p-3 rounded-full"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Smartphone className="w-6 h-6" />
              </motion.div>
              
              <motion.div
                className="absolute bottom-4 left-4 bg-blue-500 p-3 rounded-full"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <VrHeadset className="w-6 h-6" />
              </motion.div>
              
              <motion.div
                className="absolute top-1/2 left-4 bg-accent-500 p-3 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Coins className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}