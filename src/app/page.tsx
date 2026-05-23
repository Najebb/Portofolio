import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'Akhmad Najib Alfaizi — Digital Sorcerer | Creative Developer Portfolio',
  description:
    'Welcome to the magical realm of Akhmad Najib Alfaizi. A creative full-stack developer specializing in React, Three.js, and immersive 3D web experiences.',
  keywords: [
    'Akhmad Najib Alfaizi',
    'portfolio',
    'creative developer',
    'React',
    'Three.js',
    'Next.js',
    'WebGL',
    '3D web',
    'frontend developer',
    'full-stack developer',
  ],
  authors: [{ name: 'Akhmad Najib Alfaizi' }],
  creator: 'Akhmad Najib Alfaizi',
  openGraph: {
    title: 'Akhmad Najib Alfaizi — Digital Sorcerer',
    description:
      'Explore a magical 3D portfolio crafted with React Three Fiber, featuring immersive scroll-driven animations and interactive experiences.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Najib Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akhmad Najib Alfaizi — Digital Sorcerer',
    description:
      'A magical 3D portfolio built with React, Three.js, and Next.js.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return <HomeClient />;
}
