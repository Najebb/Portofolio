'use client';

import { useFrame } from '@react-three/fiber';
import { useScroll, Float, Text, Sparkles, Text3D, Center, Ring } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useMagicalSounds } from '../../hooks/useMagicalSounds';

// Magic circle floor component — lightweight (just rings + rotation)
function MagicCircle({ isHighPerf }: { isHighPerf: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.15;
    }
  });

  if (!isHighPerf) return null; // Skip entirely on low perf

  return (
    <group ref={groupRef} position={[0, -0.98, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer ring */}
      <Ring args={[3.8, 4, 32]}>
        <meshBasicMaterial color="#a855f7" transparent opacity={0.12} side={THREE.DoubleSide} />
      </Ring>
      {/* Middle ring */}
      <Ring args={[2.8, 2.85, 32]}>
        <meshBasicMaterial color="#ec4899" transparent opacity={0.08} side={THREE.DoubleSide} />
      </Ring>
      {/* Inner ring */}
      <Ring args={[1.5, 1.55, 32]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} side={THREE.DoubleSide} />
      </Ring>
      {/* Rune markers on the outer ring */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh key={deg} position={[Math.cos(rad) * 3.9, Math.sin(rad) * 3.9, 0.01]}>
            <circleGeometry args={[0.08, 6]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

// Floating crystal component
function FloatingCrystal({ position, color, speed = 2 }: { position: [number, number, number]; color: string; speed?: number }) {
  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={1.5}>
      <mesh position={position}>
        <octahedronGeometry args={[0.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

export default function WizardDesk({ isHighPerf = true }: { isHighPerf?: boolean }) {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const { playMagicSound, playClickSound } = useMagicalSounds();
  
  // Interaction States
  const [isCandleLit, setIsCandleLit] = useState(true);
  const [isBookActive, setIsBookActive] = useState(false);

  // Refs for animation
  const bookRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const flameRef = useRef<THREE.Mesh>(null);

  // Simple Mobile Detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GEOMETRY & MATERIAL REUSE
  const geometries = useMemo(() => ({
    deskPlane: new THREE.PlaneGeometry(10, 10),
    bookCover: new THREE.BoxGeometry(2.1, 0.05, 1.6),
    bookSpine: new THREE.BoxGeometry(0.05, 0.35, 1.6),
    bookPages: new THREE.BoxGeometry(1.9, 0.25, 1.5),
    emblem: new THREE.CylinderGeometry(0.3, 0.3, 0.02, 6),
    candleBody: new THREE.CylinderGeometry(0.1, 0.1, 0.6),
    flame: new THREE.ConeGeometry(0.05, 0.15)
  }), []);

  const materials = useMemo(() => ({
    deskMat: new THREE.MeshStandardMaterial({ color: "#1a1a24", roughness: 0.8, metalness: 0.2 }),
    bookPagesMat: new THREE.MeshStandardMaterial({ color: "#d4b48c", roughness: 1 }),
    candleMat: new THREE.MeshStandardMaterial({ color: "#fff4e6" }),
    flameMat: new THREE.MeshBasicMaterial({ color: "#ffaa00" }),
    textMat: new THREE.MeshStandardMaterial({ color: "#a855f7", emissive: "#a855f7", emissiveIntensity: 0.5, roughness: 0.2, metalness: 0.8 })
  }), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Animate camera and group based on scroll
    groupRef.current.position.z = scroll.offset * 15;
    groupRef.current.rotation.y = scroll.offset * Math.PI * 0.5;

    // Animate Book Interaction
    if (bookRef.current) {
      const targetY = isBookActive ? 0.5 : 0;
      const targetRotX = isBookActive ? -0.5 : 0;
      bookRef.current.position.y = THREE.MathUtils.lerp(bookRef.current.position.y, targetY, 0.1);
      bookRef.current.rotation.x = THREE.MathUtils.lerp(bookRef.current.rotation.x, targetRotX, 0.1);
    }

    // Animate Candle Interaction
    if (lightRef.current) {
      const targetIntensity = isCandleLit ? 0.5 : 0;
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, 0.1);
    }
    if (flameRef.current) {
      const targetScale = isCandleLit ? 1 : 0;
      flameRef.current.scale.setScalar(THREE.MathUtils.lerp(flameRef.current.scale.x, targetScale, 0.2));
    }
  });

  return (
    <group ref={groupRef}>
      {/* Magical Particles — reduced heavily on low perf */}
      <Sparkles count={isHighPerf ? 60 : 15} scale={12} size={isHighPerf ? 2 : 3} speed={0.4} opacity={0.5} color="#a855f7" />

      {/* Magic Circle on Floor — high perf only */}
      <MagicCircle isHighPerf={isHighPerf} />

      {/* Desk Base */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={geometries.deskPlane} material={materials.deskMat} />

      {/* Floating 3D Title — high perf only */}
      {isHighPerf && (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Center position={[0, 2.5, -3]}>
            <Text3D 
              font="/fonts/helvetiker_bold.typeface.json"
              size={0.8}
              height={0.2}
              curveSegments={4}
              bevelEnabled
              bevelThickness={0.01}
              bevelSize={0.01}
              bevelOffset={0}
              bevelSegments={2}
            >
              Najebb
              <primitive object={materials.textMat} attach="material" />
            </Text3D>
          </Center>
        </Float>
      )}

      {/* The Grimoire (Book) */}  
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group 
          position={[0, 0.5, 0]} 
          ref={bookRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsBookActive(!isBookActive);
            playMagicSound();
          }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          {/* Back Cover */}
          <mesh position={[0, -0.15, 0]} rotation={[0.2, -0.3, 0]} geometry={geometries.bookCover}>
            <meshStandardMaterial color={isBookActive ? "#3a2313" : "#2a1508"} roughness={0.9} />
          </mesh>
          
          {/* Spine */}
          <mesh position={[-1.02, 0, 0]} rotation={[0.2, -0.3, 0]} geometry={geometries.bookSpine}>
            <meshStandardMaterial color={isBookActive ? "#4a2e1b" : "#3a1a0b"} roughness={0.9} />
          </mesh>

          {/* Pages */}
          <mesh position={[0.05, 0, 0]} rotation={[0.2, -0.3, 0]} geometry={geometries.bookPages} material={materials.bookPagesMat} />

          {/* Front Cover */}
          <mesh position={[0, 0.15, 0]} rotation={[0.2, -0.3, 0]} geometry={geometries.bookCover}>
            <meshStandardMaterial color={isBookActive ? "#5a3e2b" : "#4a2e1b"} roughness={0.9} />
          </mesh>

          {/* Center Emblem */}
          <mesh position={[0, 0.18, 0]} rotation={[0.2, -0.3, 0]} geometry={geometries.emblem}>
            <meshStandardMaterial color={isBookActive ? "#eab308" : "#854d0e"} metalness={0.8} roughness={0.2} />
          </mesh>
          <Text
            position={[0, 0.22, 0]}
            rotation={[-1.3, -0.3, 0]}
            fontSize={0.15}
            color={isBookActive ? "#ffecb3" : "#e2a054"}
            maxWidth={1.8}
            textAlign="center"
            letterSpacing={0.1}
          >
            Digital Sorcery
          </Text>
        </group>
      </Float>

      {/* Floating Runes — main ones */}
      <Float speed={3} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[-2, 1.5, -1]}>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[2, 1, -2]}>
          <dodecahedronGeometry args={[0.4]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </Float>

      {/* Extra floating crystals — high perf only */}
      {isHighPerf && (
        <>
          <FloatingCrystal position={[-3, 0.8, -2]} color="#a855f7" speed={1.8} />
          <FloatingCrystal position={[3, 2, -3]} color="#eab308" speed={2.2} />
          <FloatingCrystal position={[1, 3, -4]} color="#ec4899" speed={1.5} />
        </>
      )}

      {/* Candle */}
      <group 
        position={[1.5, -0.5, 0.5]}
        onClick={(e) => {
          e.stopPropagation();
          setIsCandleLit(!isCandleLit);
          playClickSound();
        }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <mesh geometry={geometries.candleBody} material={materials.candleMat} />
        {/* Light distance reduced for low perf */}
        <pointLight ref={lightRef} position={[0, 0.4, 0]} color="#ffaa00" intensity={0.5} distance={isHighPerf ? 3 : 2} />
        {/* Flame */}
        <mesh ref={flameRef} position={[0, 0.4, 0]} geometry={geometries.flame} material={materials.flameMat} />
      </group>
    </group>
  );
}
