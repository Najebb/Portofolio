'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, PerformanceMonitor, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';
import WizardDesk from './WizardDesk';
import HTMLOverlay from '../HTMLOverlay';

// Parallax Camera Component
function CameraRig({ children }: { children: React.ReactNode }) {
  useFrame((state) => {
    // Move camera slightly based on mouse cursor position
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 2 + state.pointer.y * 0.2, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return <>{children}</>;
}

export default function Scene() {
  // DPR and Performance State
  const [dpr, setDpr] = useState(1.5);
  const [isHighPerf, setIsHighPerf] = useState(true);
  
  // Detect mobile for conditional rendering
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768;
    setIsMobile(checkMobile());
    setIsHighPerf(!checkMobile()); // Start low perf on mobile
    
    const handleResize = () => {
      setIsMobile(checkMobile());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 45 }}
      gl={{ antialias: !isMobile, alpha: false, powerPreference: 'high-performance' }}
      dpr={dpr}
      shadows={false}
    >
      {/* Adaptive Performance: Drops DPR and turns off heavy effects if FPS drops */}
      <PerformanceMonitor 
        onDecline={() => {
          setDpr(1);
          setIsHighPerf(false);
        }} 
        onIncline={() => {
          // Only re-enable high perf if not on mobile
          if (!isMobile) {
            setDpr(1.5);
            setIsHighPerf(true);
          }
        }} 
      />
      
      {/* Background color (Deep Magical Blue/Purple) and Fog */}
      <color attach="background" args={['#0a0514']} />
      <fog attach="fog" args={['#0a0514', 5, 25]} />

      {/* Cosmic stars background — heavily reduced on low performance */}
      <Stars radius={50} depth={50} count={isHighPerf ? 1500 : 300} factor={4} saturation={0.5} fade speed={1} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Suspense fallback={null}>
        <CameraRig>
          <ScrollControls pages={6} damping={0.25}>
            <WizardDesk isHighPerf={isHighPerf} />
            <HTMLOverlay />
          </ScrollControls>
        </CameraRig>
      </Suspense>

      {/* Post-processing — ONLY ON HIGH PERFORMANCE */}
      {isHighPerf && (
        <EffectComposer>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
