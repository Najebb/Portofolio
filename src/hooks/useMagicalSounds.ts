'use client';

import { useCallback, useRef } from 'react';

export function useMagicalSounds() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (typeof window === 'undefined') return;
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playHoverSound = useCallback(() => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }, []);

  const playClickSound = useCallback(() => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }, []);

  const playMagicSound = useCallback(() => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Arpeggio for a magical chime effect
    const frequencies = [440, 554.37, 659.25, 880]; // A major chord
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
      
      // Slight vibrato
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 5;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 10;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(ctx.currentTime + i * 0.05);

      gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.05);
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + i * 0.05 + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 1.0);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 1.0);
      lfo.stop(ctx.currentTime + i * 0.05 + 1.0);
    });
  }, []);

  return { playHoverSound, playClickSound, playMagicSound };
}
