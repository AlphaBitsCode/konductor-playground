'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import './fonts.css';

// Dynamically import PhaserGame with no SSR
const PhaserGame = dynamic(
  () => import('@/components/PhaserGame'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-screen bg-black">
        <div className="loading-text text-white">Loading world...</div>
      </div>
    )
  }
);

export default function TownPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden m-0 p-0" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Game container */}
      <div className="w-full h-full m-0 p-0" style={{ width: '100vw', height: '100vh' }}>
        {isClient && <PhaserGame />}
      </div>
    </div>
  );
}
