'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import PhaserGame with no SSR
const PhaserGame = dynamic(
  () => import('@/components/PhaserGame'),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-screen bg-black text-white">Loading game...</div>
  }
);

export default function TownPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Konductor Town</h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </header>
      <div className="flex-1 w-full">
        {isClient && <PhaserGame />}
      </div>
    </div>
  );
}
