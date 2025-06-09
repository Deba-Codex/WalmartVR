import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, ZoomIn, ZoomOut, Move3d, Smartphone, Monitor } from 'lucide-react';
import { CustomARScene } from './CustomARScene';
import { useStore } from '../store/useStore';

interface ARViewerProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  model3D?: string;
  arType: 'furniture' | 'electronics' | 'apparel';
}

export function ARViewer({ isOpen, onClose, productName, model3D, arType }: ARViewerProps) {
  const modelViewerRef = useRef<any>(null);
  const [viewMode, setViewMode] = useState<'model-viewer' | 'custom'>('custom');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const { updateShopCoins, addAnalyticsEvent } = useStore();

  useEffect(() => {
    if (isOpen) {
      // Track AR viewer open
      addAnalyticsEvent('ar_viewer_opened', {
        product: productName,
        arType,
        timestamp: Date.now()
      });

      // Reward coins for AR engagement
      updateShopCoins(10, `Viewed ${productName} in AR`);

      if (modelViewerRef.current && viewMode === 'model-viewer') {
        const modelViewer = modelViewerRef.current;
        modelViewer.setAttribute('ar', '');
        modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
      }
    }
  }, [isOpen, viewMode, productName, arType]);

  const getARInstructions = () => {
    switch (arType) {
      case 'furniture':
        return 'Place this furniture in your room using AR to see how it fits your space';
      case 'electronics':
        return 'View this device in 360° and experience it in your environment';
      case 'apparel':
        return 'Try on this item virtually and see different color options';
      default:
        return 'Experience this product in augmented reality';
    }
  };

  const getModelUrl = () => {
    // Real GLTF models for different product types
    const modelUrls = {
      furniture: 'https://threejs.org/examples/models/gltf/DamagedHelmet/DamagedHelmet.gltf',
      electronics: 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
      apparel: 'https://threejs.org/examples/models/gltf/Soldier.glb'
    };
    
    return model3D || modelUrls[arType] || modelUrls.furniture;
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    addAnalyticsEvent('color_customization', {
      product: productName,
      color,
      timestamp: Date.now()
    });
    
    // Reward coins for customization
    updateShopCoins(5, `Customized ${productName} color`);
  };

  const handleAnalyticsEvent = (event: string, data: any) => {
    addAnalyticsEvent(event, data);
    
    // Reward coins for various interactions
    const coinRewards = {
      'model_interaction': 2,
      'ar_session': 20,
      'customization': 5,
      'control': 1
    };
    
    const reward = coinRewards[event as keyof typeof coinRewards] || 0;
    if (reward > 0) {
      updateShopCoins(reward, `AR interaction: ${event}`);
    }
  };

  const handleClose = () => {
    addAnalyticsEvent('ar_viewer_closed', {
      product: productName,
      sessionDuration: Date.now() - (Date.now() - 30000), // Approximate
      timestamp: Date.now()
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    AR Experience
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {productName}
                  </p>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <motion.button
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'custom'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                    onClick={() => setViewMode('custom')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Enhanced AR</span>
                  </motion.button>
                  <motion.button
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'model-viewer'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                    onClick={() => setViewMode('model-viewer')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Monitor className="w-4 h-4" />
                    <span>Standard View</span>
                  </motion.button>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* AR Viewer Content */}
            <div className="p-6">
              {viewMode === 'custom' ? (
                <CustomARScene
                  modelUrl={getModelUrl()}
                  productName={productName}
                  onColorChange={handleColorChange}
                  onAnalyticsEvent={handleAnalyticsEvent}
                />
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-96 flex items-center justify-center relative overflow-hidden">
                  <model-viewer
                    ref={modelViewerRef}
                    src={getModelUrl()}
                    alt={productName}
                    auto-rotate
                    camera-controls
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    ios-src=""
                    style={{ width: '100%', height: '100%' }}
                    className="rounded-xl"
                    onLoad={() => handleAnalyticsEvent('model_loaded', { viewer: 'model-viewer' })}
                  />

                  {/* Standard Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2">
                    <motion.button
                      className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAnalyticsEvent('control', { action: 'reset' })}
                    >
                      <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                    <motion.button
                      className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAnalyticsEvent('control', { action: 'zoom_in' })}
                    >
                      <ZoomIn className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                    <motion.button
                      className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAnalyticsEvent('control', { action: 'zoom_out' })}
                    >
                      <ZoomOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                    <motion.button
                      className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAnalyticsEvent('control', { action: 'move' })}
                    >
                      <Move3d className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-center font-medium">
                  {getARInstructions()}
                </p>
                <div className="flex items-center justify-center mt-2 space-x-4 text-sm text-blue-600 dark:text-blue-300">
                  <span>✨ Earn coins for interactions</span>
                  <span>🎨 Customize colors</span>
                  <span>📱 Full AR support</span>
                </div>
              </div>

              {/* AR Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <motion.button
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleAnalyticsEvent('ar_button_clicked', { type: 'view_in_space' });
                    // This would trigger AR mode in a real implementation
                  }}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>View in Your Space (AR)</span>
                </motion.button>
                
                <motion.button
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleAnalyticsEvent('share_ar_experience', { product: productName });
                    updateShopCoins(15, 'Shared AR experience');
                  }}
                >
                  <span>📤</span>
                  <span>Share AR Experience</span>
                </motion.button>
              </div>

              {/* Performance Stats */}
              <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Selected Color: <span className="font-medium" style={{ color: selectedColor }}>{selectedColor}</span></p>
                <p>Viewer Mode: <span className="font-medium capitalize">{viewMode}</span></p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}