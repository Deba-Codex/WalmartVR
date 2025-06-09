import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  ContactShadows, 
  PresentationControls,
  Stage,
  Text,
  Html,
  useProgress
} from '@react-three/drei';
import { XR, ARButton, useXR } from '@react-three/xr';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Palette, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface CustomARSceneProps {
  modelUrl: string;
  productName: string;
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

// Enhanced 3D Model Component with LOD and customization
function Model({ url, scale = 1, position = [0, 0, 0], selectedColor = '#ffffff', onAnalyticsEvent }: any) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState(false);
  const { isPresenting } = useXR();
  
  // Clone the scene to avoid modifying the original
  const clonedScene = scene.clone();
  
  // Apply color customization
  useEffect(() => {
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat: any) => {
            if (mat.name.includes('fabric') || mat.name.includes('color')) {
              mat.color.setHex(selectedColor.replace('#', '0x'));
            }
          });
        } else {
          if (child.material.name.includes('fabric') || child.material.name.includes('color')) {
            child.material.color.setHex(selectedColor.replace('#', '0x'));
          }
        }
      }
    });
  }, [selectedColor, clonedScene]);

  // Animation and interaction
  useFrame((state) => {
    if (group.current) {
      if (isPresenting) {
        // AR mode - keep model stable
        group.current.rotation.y = 0;
      } else {
        // Regular mode - gentle rotation
        group.current.rotation.y += 0.005;
      }
      
      // Hover effect
      if (hovered) {
        group.current.scale.setScalar(scale * 1.1);
      } else {
        group.current.scale.setScalar(scale);
      }
    }
  });

  const handleClick = () => {
    onAnalyticsEvent?.('model_interaction', { action: 'click', model: url });
  };

  const handlePointerOver = () => {
    setHovered(true);
    onAnalyticsEvent?.('model_interaction', { action: 'hover', model: url });
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  return (
    <group 
      ref={group} 
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

// AR Controls Component
function ARControls({ onColorChange, selectedColor, onAnalyticsEvent }: any) {
  const colors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'
  ];

  return (
    <div className="absolute bottom-4 left-4 right-4 flex flex-col space-y-4">
      {/* Color Picker */}
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
                onColorChange(color);
                onAnalyticsEvent?.('customization', { type: 'color', value: color });
              }}
            />
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-2">
        <motion.button
          className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAnalyticsEvent?.('control', { action: 'reset' })}
        >
          <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>
        <motion.button
          className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAnalyticsEvent?.('control', { action: 'zoom_in' })}
        >
          <ZoomIn className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>
        <motion.button
          className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAnalyticsEvent?.('control', { action: 'zoom_out' })}
        >
          <ZoomOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>
        <motion.button
          className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAnalyticsEvent?.('control', { action: 'fullscreen' })}
        >
          <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>
      </div>
    </div>
  );
}

export function CustomARScene({ modelUrl, productName, onColorChange, onAnalyticsEvent }: CustomARSceneProps) {
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [isARSupported, setIsARSupported] = useState(false);

  useEffect(() => {
    // Check AR support
    if ('xr' in navigator) {
      (navigator as any).xr?.isSessionSupported('immersive-ar').then((supported: boolean) => {
        setIsARSupported(supported);
      });
    }
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorChange?.(color);
  };

  const handleAnalyticsEvent = (event: string, data: any) => {
    onAnalyticsEvent?.(event, { ...data, product: productName, timestamp: Date.now() });
  };

  return (
    <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
      {/* AR Button */}
      {isARSupported && (
        <div className="absolute top-4 right-4 z-10">
          <ARButton
            onClick={() => handleAnalyticsEvent('ar_session', { action: 'start' })}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
          />
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        onCreated={() => handleAnalyticsEvent('scene_loaded', { model: modelUrl })}
      >
        <XR>
          <Suspense fallback={<Loader />}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />

            {/* Environment */}
            <Environment preset="studio" />

            {/* 3D Model with LOD */}
            <PresentationControls
              global
              rotation={[0.13, 0.1, 0]}
              polar={[-0.4, 0.2]}
              azimuth={[-1, 0.75]}
              config={{ mass: 1, tension: 170 }}
              snap={{ mass: 4, tension: 1500 }}
            >
              <Stage contactShadow={{ opacity: 0.4, blur: 2 }}>
                <Model
                  url={modelUrl}
                  scale={1}
                  selectedColor={selectedColor}
                  onAnalyticsEvent={handleAnalyticsEvent}
                />
              </Stage>
            </PresentationControls>

            {/* Ground plane for AR */}
            <ContactShadows
              position={[0, -1.4, 0]}
              opacity={0.75}
              scale={10}
              blur={2.5}
              far={4}
            />

            {/* Controls for non-AR mode */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
            />
          </Suspense>
        </XR>
      </Canvas>

      {/* Custom Controls Overlay */}
      <ARControls
        onColorChange={handleColorChange}
        selectedColor={selectedColor}
        onAnalyticsEvent={handleAnalyticsEvent}
      />
    </div>
  );
}