'use client';

import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function MagicalLoader() {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);

  useEffect(() => {
    // If loading is not active (nothing to load or already done), auto-dismiss
    // Use a minimum display time of 2s so the loader feels intentional
    if (!active) {
      const t = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(t);
    }
  }, [active]);

  useEffect(() => {
    // When progress hits 100, add a small delay before hiding
    if (progress >= 100) {
      const t = setTimeout(() => setShow(false), 600);
      return () => clearTimeout(t);
    }
  }, [progress]);

  // Fake progress when nothing is being loaded (no heavy 3D models)
  const [fakeProgress, setFakeProgress] = useState(0);
  useEffect(() => {
    if (!active && show) {
      const interval = setInterval(() => {
        setFakeProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          // Fast acceleration curve
          return prev + (100 - prev) * 0.15;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [active, show]);

  const displayProgress = active ? progress : fakeProgress;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#050508' }}
        >
          {/* Animated Magic Circle */}
          <div className="relative w-40 h-40 mb-8">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-500/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            {/* Middle ring */}
            <motion.div
              className="absolute inset-3 rounded-full border border-pink-500/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner ring */}
            <motion.div
              className="absolute inset-6 rounded-full border border-cyan-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* Rune orbs rotating around the circle */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div
                key={deg}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  background: i % 2 === 0 ? '#a855f7' : '#ec4899',
                  boxShadow: `0 0 12px ${i % 2 === 0 ? '#a855f780' : '#ec489980'}`,
                  transform: `rotate(${deg}deg) translateY(-70px) translateX(-50%)`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}

            {/* Center glow */}
            <motion.div
              className="absolute inset-12 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Progress Text */}
          <motion.p
            className="text-purple-300/80 text-sm tracking-[0.3em] uppercase font-light mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Summoning Realm...
          </motion.p>

          {/* Progress Bar */}
          <div className="w-48 h-1 bg-purple-950/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, #a855f7, #ec4899, #06b6d4)',
              }}
              animate={{ width: `${displayProgress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          <p className="text-purple-400/60 text-xs mt-3 font-mono">
            {displayProgress.toFixed(0)}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
