import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  ContactShadows, 
  PresentationControls,
  Stage,
  Html,
  useProgress
} from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Palette, RotateCcw, ZoomIn, ZoomOut, Maximize2, Play } from 'lucide-react';

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

// Enhanced 3D Model Component with animations and interactions
function Model({ 
  url, 
  scale = 1, 
  position = [0, 0, 0], 
  selectedColor = '#ffffff', 
  onAnalyticsEvent,
  autoRotate = true 
}: any) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Clone the scene to avoid modifying the original
  const clonedScene = scene.clone();
  
  // Apply color customization to materials
  useEffect(() => {
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Handle both single materials and material arrays
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        
        materials.forEach((mat: any) => {
          if (mat.color) {
            // Create a new material to avoid affecting other instances
            const newMat = mat.clone();
            newMat.color.setHex(selectedColor.replace('#', '0x'));
            
            // Apply some visual enhancements
            if (newMat.metalness !== undefined) newMat.metalness = 0.1;
            if (newMat.roughness !== undefined) newMat.roughness = 0.4;
            
            if (Array.isArray(child.material)) {
              const index = child.material.indexOf(mat);
              child.material[index] = newMat;
            } else {
              child.material = newMat;
            }
          }
        });
      }
    });
  }, [selectedColor, clonedScene]);

  // Animation and interaction logic
  useFrame((state) => {
    if (group.current) {
      // Auto rotation
      if (autoRotate && !clicked) {
        group.current.rotation.y += 0.005;
      }
      
      // Hover effect
      const targetScale = hovered ? scale * 1.1 : scale;
      group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Floating animation
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const handleClick = () => {
    setClicked(!clicked);
    onAnalyticsEvent?.('model_interaction', { 
      action: 'click', 
      model: url,
      color: selectedColor 
    });
  };

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
    onAnalyticsEvent?.('model_interaction', { action: 'hover', model: url });
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
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
      
      {/* Glow effect when hovered */}
      {hovered && (
        <pointLight 
          position={[0, 0, 0]} 
          intensity={0.5} 
          color={selectedColor}
          distance={3}
        />
      )}
    </group>
  );
}

// Interactive Controls Component
function InteractiveControls({ onColorChange, selectedColor, onAnalyticsEvent, onAction }: any) {
  const colors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'
  ];

  const actions = [
    { icon: RotateCcw, label: 'Reset', action: 'reset' },
    { icon: ZoomIn, label: 'Zoom In', action: 'zoom_in' },
    { icon: ZoomOut, label: 'Zoom Out', action: 'zoom_out' },
    { icon: Maximize2, label: 'Fullscreen', action: 'fullscreen' },
    { icon: Play, label: 'Animate', action: 'animate' }
  ];

  return (
    <div className="absolute bottom-4 left-4 right-4 flex flex-col space-y-4">
      {/* Color Picker */}
      <motion.div 
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-90"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-2 mb-3">
          <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Customize Color
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color, index) => (
            <motion.button
              key={color}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                onColorChange(color);
                onAnalyticsEvent?.('customization', { type: 'color', value: color });
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-2">
        {actions.map((action, index) => (
          <motion.button
            key={action.action}
            className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg backdrop-blur-sm bg-opacity-90 hover:bg-gray-50 dark:hover:bg-gray-700"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            onClick={() => {
              onAction?.(action.action);
              onAnalyticsEvent?.('control', { action: action.action });
            }}
            title={action.label}
          >
            <action.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Camera Controller
function CameraController({ action }: { action: string | null }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (!action) return;
    
    switch (action) {
      case 'zoom_in':
        camera.position.multiplyScalar(0.8);
        break;
      case 'zoom_out':
        camera.position.multiplyScalar(1.2);
        break;
      case 'reset':
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        break;
    }
  }, [action, camera]);
  
  return null;
}

export function CustomARScene({ modelUrl, productName, onColorChange, onAnalyticsEvent }: CustomARSceneProps) {
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraAction, setCameraAction] = useState<string | null>(null);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorChange?.(color);
  };

  const handleAnalyticsEvent = (event: string, data: any) => {
    onAnalyticsEvent?.(event, { ...data, product: productName, timestamp: Date.now() });
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'animate':
        setAutoRotate(!autoRotate);
        break;
      case 'fullscreen':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        break;
      default:
        setCameraAction(action);
        setTimeout(() => setCameraAction(null), 100);
    }
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden">
      {/* Performance Indicator */}
      <div className="absolute top-4 left-4 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
        3D Preview Mode
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: "high-performance"
        }}
        onCreated={() => handleAnalyticsEvent('3d_scene_loaded', { model: modelUrl })}
      >
        <CameraController action={cameraAction} />
        
        <Suspense fallback={<Loader />}>
          {/* Enhanced Lighting Setup */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ffa500" />
          <spotLight 
            position={[0, 10, 0]} 
            angle={0.3} 
            penumbra={1} 
            intensity={0.5}
            castShadow
          />

          {/* Environment */}
          <Environment preset="studio" />

          {/* 3D Model with Enhanced Controls */}
          <PresentationControls
            global
            rotation={[0.13, 0.1, 0]}
            polar={[-0.4, 0.2]}
            azimuth={[-1, 0.75]}
            config={{ mass: 1, tension: 170 }}
            snap={{ mass: 4, tension: 1500 }}
          >
            <Stage 
              contactShadow={{ 
                opacity: 0.4, 
                blur: 2,
                color: selectedColor 
              }}
              environment="studio"
              intensity={0.5}
            >
              <Model
                url={modelUrl}
                scale={1}
                selectedColor={selectedColor}
                onAnalyticsEvent={handleAnalyticsEvent}
                autoRotate={autoRotate}
              />
            </Stage>
          </PresentationControls>

          {/* Enhanced Ground and Shadows */}
          <ContactShadows
            position={[0, -1.4, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4}
            color={selectedColor}
          />

          {/* Orbit Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>

      {/* Interactive Controls Overlay */}
      <InteractiveControls
        onColorChange={handleColorChange}
        selectedColor={selectedColor}
        onAnalyticsEvent={handleAnalyticsEvent}
        onAction={handleAction}
      />

      {/* Info Panel */}
      <motion.div 
        className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg max-w-xs"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
          {productName}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Drag to rotate • Scroll to zoom • Click model to interact
        </p>
        <div className="mt-2 flex items-center space-x-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${autoRotate ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-gray-500">Auto-rotate {autoRotate ? 'ON' : 'OFF'}</span>
        </div>
      </motion.div>
    </div>
  );
}