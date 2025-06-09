import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, ZoomIn, ZoomOut, Move3d, Smartphone, Monitor, AlertCircle, CheckCircle } from 'lucide-react';
import { CustomARScene } from './CustomARScene';
import { WebXRARViewer } from './WebXRARViewer';
import { useStore } from '../store/useStore';

interface ARViewerProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  model3D?: string;
  arType: 'furniture' | 'electronics' | 'apparel';
}

export function ARViewer({ isOpen, onClose, productName, model3D, arType }: ARViewerProps) {
  const [viewMode, setViewMode] = useState<'webxr' | 'custom'>('webxr');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [arError, setArError] = useState<string | null>(null);
  const { updateShopCoins, addAnalyticsEvent } = useStore();

  useEffect(() => {
    if (isOpen) {
      checkARSupport();
      addAnalyticsEvent('ar_viewer_opened', {
        product: productName,
        arType,
        timestamp: Date.now()
      });
      updateShopCoins(10, `Viewed ${productName} in AR`);
    }
  }, [isOpen, productName, arType]);

  const checkARSupport = async () => {
    try {
      if (!('xr' in navigator)) {
        setArSupported(false);
        setArError('WebXR not supported on this device');
        return;
      }

      const xr = (navigator as any).xr;
      if (!xr) {
        setArSupported(false);
        setArError('WebXR API not available');
        return;
      }

      const supported = await xr.isSessionSupported('immersive-ar');
      setArSupported(supported);
      
      if (!supported) {
        setArError('AR mode not supported on this device. Try on a mobile device with ARCore/ARKit support.');
      }
    } catch (error) {
      console.error('AR support check failed:', error);
      setArSupported(false);
      setArError('Failed to check AR support');
    }
  };

  const getARInstructions = () => {
    switch (arType) {
      case 'furniture':
        return 'Point your camera at the floor and tap to place furniture in your room';
      case 'electronics':
        return 'Find a flat surface like a table and tap to place the device';
      case 'apparel':
        return 'Use AR to see how this item looks in different environments';
      default:
        return 'Point your camera around and tap to place the product in your space';
    }
  };

  const getModelUrl = () => {
    const modelUrls = {
      furniture: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Duck/glTF-Binary/Duck.glb',
      electronics: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Avocado/glTF-Binary/Avocado.glb',
      apparel: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/BoomBox/glTF-Binary/BoomBox.glb'
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
    updateShopCoins(5, `Customized ${productName} color`);
  };

  const handleAnalyticsEvent = (event: string, data: any) => {
    addAnalyticsEvent(event, data);
    
    const coinRewards = {
      'model_interaction': 2,
      'ar_session_started': 25,
      'ar_placement': 15,
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
                
                {/* AR Support Status */}
                <div className="flex items-center space-x-2">
                  {arSupported === null ? (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Checking AR support...</span>
                    </div>
                  ) : arSupported ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">AR Ready</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">AR Not Available</span>
                    </div>
                  )}
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <motion.button
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'webxr'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                    onClick={() => setViewMode('webxr')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Real AR</span>
                  </motion.button>
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
                    <Monitor className="w-4 h-4" />
                    <span>3D Preview</span>
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

            {/* AR Error Message */}
            {arError && (
              <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                    {arError}
                  </p>
                </div>
                <p className="text-red-600 dark:text-red-300 text-xs mt-1">
                  For best AR experience, use Chrome on Android or Safari on iOS 15.4+
                </p>
              </div>
            )}

            {/* AR Viewer Content */}
            <div className="p-6">
              {viewMode === 'webxr' ? (
                <WebXRARViewer
                  modelUrl={getModelUrl()}
                  productName={productName}
                  arSupported={arSupported || false}
                  onColorChange={handleColorChange}
                  onAnalyticsEvent={handleAnalyticsEvent}
                />
              ) : (
                <CustomARScene
                  modelUrl={getModelUrl()}
                  productName={productName}
                  onColorChange={handleColorChange}
                  onAnalyticsEvent={handleAnalyticsEvent}
                />
              )}

              {/* Instructions */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-center font-medium">
                  {getARInstructions()}
                </p>
                <div className="flex items-center justify-center mt-2 space-x-4 text-sm text-blue-600 dark:text-blue-300">
                  <span>📱 Point camera around</span>
                  <span>👆 Tap to place</span>
                  <span>🎨 Customize colors</span>
                  <span>💰 Earn coins</span>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Selected Color: <span className="font-medium" style={{ color: selectedColor }}>{selectedColor}</span></p>
                <p>Viewer Mode: <span className="font-medium capitalize">{viewMode === 'webxr' ? 'Real AR' : '3D Preview'}</span></p>
                <p>AR Support: <span className="font-medium">{arSupported ? 'Available' : 'Not Available'}</span></p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}