import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Eye, Smartphone, Headset as VrHeadset, Coins, Zap, Palette } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { ARViewer } from './ARViewer';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateShopCoins, addAnalyticsEvent } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [showARViewer, setShowARViewer] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  const handleAddToCart = () => {
    addToCart(product);
    
    // Animate coin reward
    setShowCoinAnimation(true);
    setTimeout(() => setShowCoinAnimation(false), 2000);
    
    // Add coins for engagement
    updateShopCoins(5, 'Added item to cart');
    
    // Track analytics
    addAnalyticsEvent('add_to_cart', {
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category,
      timestamp: Date.now()
    });
  };

  const handleARView = () => {
    setShowARViewer(true);
    addAnalyticsEvent('ar_view_initiated', {
      productId: product.id,
      productName: product.name,
      arType: product.arType,
      timestamp: Date.now()
    });
    updateShopCoins(10, `Viewed ${product.name} in AR`);
  };

  const handleVRView = () => {
    addAnalyticsEvent('vr_view_initiated', {
      productId: product.id,
      productName: product.name,
      timestamp: Date.now()
    });
    updateShopCoins(15, `Viewed ${product.name} in VR`);
    // VR implementation would go here
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const colorOptions = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'];

  return (
    <>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
        whileHover={{ y: -8, scale: 1.02 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Discount Badge */}
          {product.discount && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
            >
              {product.discount}% OFF
            </motion.div>
          )}

          {/* AR/VR Badges */}
          <div className="absolute top-3 right-3 flex space-x-2">
            {product.hasAR && (
              <motion.div
                className="bg-purple-500 text-white p-2 rounded-full shadow-lg cursor-pointer"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
                onClick={handleARView}
              >
                <Smartphone className="w-4 h-4" />
              </motion.div>
            )}
            {product.hasVR && (
              <motion.div
                className="bg-blue-500 text-white p-2 rounded-full shadow-lg cursor-pointer"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
                onClick={handleVRView}
              >
                <VrHeadset className="w-4 h-4" />
              </motion.div>
            )}
          </div>

          {/* Hover Overlay with Enhanced Features */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center space-y-3"
              >
                {product.hasAR && (
                  <motion.button
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleARView}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>AR View</span>
                  </motion.button>
                )}
                {product.hasVR && (
                  <motion.button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleVRView}
                  >
                    <VrHeadset className="w-4 h-4" />
                    <span>VR View</span>
                  </motion.button>
                )}
                
                {/* Quick Color Preview */}
                <div className="flex space-x-1">
                  {colorOptions.slice(0, 4).map((color) => (
                    <motion.div
                      key={color}
                      className="w-6 h-6 rounded-full border-2 border-white cursor-pointer"
                      style={{ backgroundColor: color }}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6">
          {/* Brand */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{product.brand}</p>
          
          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Enhanced Features */}
          <div className="flex items-center justify-between mb-4">
            {/* AR/VR Indicators */}
            <div className="flex space-x-2">
              {product.hasAR && (
                <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                  AR Ready
                </span>
              )}
              {product.hasVR && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                  VR Ready
                </span>
              )}
            </div>
            
            {/* Customization Indicator */}
            <motion.div
              className="flex items-center space-x-1 text-gray-500 dark:text-gray-400"
              whileHover={{ scale: 1.1 }}
            >
              <Palette className="w-4 h-4" />
              <span className="text-xs">Customizable</span>
            </motion.div>
          </div>

          {/* Coin Reward */}
          <motion.div
            className="flex items-center space-x-2 bg-gradient-to-r from-accent-50 to-yellow-50 dark:from-accent-900 dark:to-yellow-900 p-3 rounded-lg mb-4"
            animate={showCoinAnimation ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={showCoinAnimation ? { rotate: 360 } : {}}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <Coins className="w-5 h-5 text-accent-500" />
            </motion.div>
            <span className="text-sm font-medium text-accent-600 dark:text-accent-400">
              Earn {product.coinReward} ShopCoins
            </span>
            <AnimatePresence>
              {showCoinAnimation && (
                <motion.div
                  initial={{ scale: 0, y: 0 }}
                  animate={{ scale: 1, y: -20 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="text-accent-500 font-bold"
                >
                  +{product.coinReward}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
            <motion.div
              animate={showCoinAnimation ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Zap className="w-4 h-4 text-accent-300" />
            </motion.div>
          </motion.button>

          {/* Stock Status */}
          <div className="mt-3 text-center">
            {product.inStock ? (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ In Stock
              </span>
            ) : (
              <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                ✗ Out of Stock
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* AR Viewer Modal */}
      <ARViewer
        isOpen={showARViewer}
        onClose={() => setShowARViewer(false)}
        productName={product.name}
        model3D={product.model3D}
        arType={product.arType || 'electronics'}
      />
    </>
  );
}