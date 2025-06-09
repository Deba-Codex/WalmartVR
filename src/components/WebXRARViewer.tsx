import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  useGLTF, 
  Environment, 
  Html,
  useProgress
} from '@react-three/drei';
import { XR, ARButton, useXR, Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Palette, RotateCcw, Smartphone, AlertTriangle } from 'lucide-react';
import { useManualHitTest } from '../hooks/useManualHitTest';

interface WebXRARViewerProps {
  modelUrl: string;
  productName: string;
  arSupported: boolean;
  onColorChange?: (color: string) => void;
  onAnalyticsEvent?: (event: string, data: any) => void;
}

// Loading component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading 3D Model...</p>
          <p className="text-sm text-gray-500">{Math.round(progress)}%</p>
        </div>
      </div>
    </Html>
  );
}

// Reticle component for AR placement
function Reticle() {
  const reticleRef = useRef<THREE.Mesh>(null);
  const { isPresenting } = useXR();
  
  useManualHitTest((hitMatrix) => {
    if (reticleRef.current && isPresenting) {
      reticleRef.current.visible = true;
      reticleRef.current.matrix.fromArray(hitMatrix);
    }
  });

  useFrame(() => {
    if (reticleRef.current && !isPresenting) {
      reticleRef.current.visible = false;
    }
  });

  return (
    <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[0.1, 0.25, 32]} />
      <meshBasicMaterial color="white" transparent opacity={0.5} />
      <mesh>
        <planeGeometry args={[0.2, 0.2]} />
        <meshBasicMaterial color="white" transparent opacity={0.3} />
      </mesh>
    </mesh>
  );
}

// AR Model component with placement functionality
function ARModel({ 
  url, 
  selectedColor = '#ffffff', 
  onAnalyticsEvent,
  onPlacement 
}: any) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  const [placed, setPlaced] = useState(false);
  const { isPresenting } = useXR();
  
  // Clone the scene to avoid modifying the original
  const clonedScene = scene.clone();
  
  // Apply color customization
  useEffect(() => {
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat: any) => {
            if (mat.color) {
              mat.color.setHex(selectedColor.replace('#', '0x'));
            }
          });
        } else if (child.material.color) {
          child.material.color.setHex(selectedColor.replace('#', '0x'));
        }
      }
    });
  }, [selectedColor, clonedScene]);

  // Handle placement in AR using manual hit test
  useManualHitTest((hitMatrix) => {
    if (group.current && isPresenting && !placed) {
      group.current.matrix.fromArray(hitMatrix);
      group.current.visible = true;
    }
  });

  const handleSelect = () => {
    if (isPresenting && !placed) {
      setPlaced(true);
      onAnalyticsEvent?.('ar_placement', { 
        model: url, 
        color: selectedColor,
        timestamp: Date.now() 
      });
      onPlacement?.();
    }
  };

  // Animation for placed objects
  useFrame((state) => {
    if (group.current && placed) {
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <Interactive onSelect={handleSelect}>
      <group 
        ref={group} 
        visible={!isPresenting || placed}
        scale={isPresenting ? [0.5, 0.5, 0.5] : [1, 1, 1]}
        position={isPresenting ? [0, 0, 0] : [0, 0, 0]}
      >
        <primitive object={clonedScene} />
      </group>
    </Interactive>
  );
}

// AR Session Manager
function ARSessionManager({ onAnalyticsEvent }: any) {
  const { isPresenting } = useXR();
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    if (isPresenting && !sessionStarted) {
      setSessionStarted(true);
      onAnalyticsEvent?.('ar_session_started', { timestamp: Date.now() });
    } else if (!isPresenting && sessionStarted) {
      setSessionStarted(false);
      onAnalyticsEvent?.('ar_session_ended', { timestamp: Date.now() });
    }
  }, [isPresenting, sessionStarted, onAnalyticsEvent]);

  return null;
}

export function WebXRARViewer({ 
  modelUrl, 
  productName, 
  arSupported, 
  onColorChange, 
  onAnalyticsEvent 
}: WebXRARViewerProps) {
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [modelPlaced, setModelPlaced] = useState(false);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorChange?.(color);
  };

  const handleAnalyticsEvent = (event: string, data: any) => {
    onAnalyticsEvent?.(event, { ...data, product: productName });
  };

  const colors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'
  ];

  if (!arSupported) {
    return (
      <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
        <div className="text-center p-8">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            AR Not Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your device doesn't support WebXR AR. Try using:
          </p>
          <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <li>• Chrome on Android with ARCore</li>
            <li>• Safari on iOS 15.4+ with ARKit</li>
            <li>• Edge on Windows with Mixed Reality</li>
          </ul>
          <motion.button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://immersiveweb.dev/', '_blank')}
          >
            Learn More About WebXR
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
      {/* AR Button */}
      <div className="absolute top-4 right-4 z-10">
        <ARButton
          onClick={() => handleAnalyticsEvent('ar_button_clicked', { action: 'enter_ar' })}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg flex items-center space-x-2"
        >
          <Smartphone className="w-5 h-5" />
          <span>Enter AR</span>
        </ARButton>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg max-w-xs">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {modelPlaced 
            ? "Great! Your product is placed. Move around to see it from different angles."
            : "Tap 'Enter AR' then point your camera around and tap to place the product."
          }
        </p>
      </div>

      <Canvas
        camera={{ position: [0, 1.6, 3], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        onCreated={() => handleAnalyticsEvent('webxr_scene_loaded', { model: modelUrl })}
      >
        <XR>
          <ARSessionManager onAnalyticsEvent={handleAnalyticsEvent} />
          
          <Suspense fallback={<Loader />}>
            {/* Lighting for AR */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />

            {/* Environment for non-AR mode */}
            <Environment preset="studio" />

            {/* AR Model */}
            <ARModel
              url={modelUrl}
              selectedColor={selectedColor}
              onAnalyticsEvent={handleAnalyticsEvent}
              onPlacement={() => setModelPlaced(true)}
            />

            {/* AR Reticle */}
            <Reticle />
          </Suspense>
        </XR>
      </Canvas>

      {/* Color Picker Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col space-y-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Customize Color
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <motion.button
                key={color}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === color ? 'border-blue-500' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  handleColorChange(color);
                  handleAnalyticsEvent('color_customization', { color });
                }}
              />
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
          <motion.button
            className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setModelPlaced(false);
              handleAnalyticsEvent('ar_reset', { action: 'reset_placement' });
            }}
          >
            <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}