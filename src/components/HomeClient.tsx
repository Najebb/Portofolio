'use client';

import Scene from '@/components/canvas/Scene';
import MagicalLoader from '@/components/MagicalLoader';

export default function HomeClient() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-background">
      {/* 3D Canvas Context */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Scene />
      </div>
      {/* Magical Loading Screen */}
      <MagicalLoader />
    </main>
  );
}
