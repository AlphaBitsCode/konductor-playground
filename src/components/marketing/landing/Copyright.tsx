'use client';

import { useEffect, useState } from 'react';

export const Copyright = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      // Show copyright when user is near the bottom (within 300px)
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 300;
      setIsVisible(nearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed bottom-0 left-0 right-0 w-full py-8 flex justify-center items-center z-50 transition-opacity duration-500 ease-in-out ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
    >
      <div className="text-center px-6">
        <p className="pixel-font text-xs text-white/50 tracking-wider">
          A product of
          {' '}
          <a href="https://alphabits.team/?utm_source=konductor&utm_medium=1&utm_campaign-beta" target="_blank" rel="noopener noreferrer" className="hover:text-white/80">Alpha Bits</a>
        </p>
        <div className="mt-2 flex justify-center space-x-2">
          <div className="w-1 h-1 bg-white/30 rounded-full"></div>
          <div className="w-1 h-1 bg-white/30 rounded-full"></div>
          <div className="w-1 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
