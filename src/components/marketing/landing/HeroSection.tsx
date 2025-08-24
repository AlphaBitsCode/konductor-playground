'use client';

import { useEffect, useState } from 'react';

export const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Floating Cubes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array.from({ length: 6 })].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-cyan-400 opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
              animation: `float-${i % 3} ${12 + i * 3}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      <style jsx>
        {`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(15deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(-3px) rotate(5deg); }
          50% { transform: translateY(-12px) rotate(20deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(-2px) rotate(10deg); }
          50% { transform: translateY(-10px) rotate(25deg); }
        }
      `}
      </style>

      {/* Main Content */}
      <div className={`relative z-10 text-center px-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      >

        {/* Tagline */}
        <div className="mb-8 space-y-4">
          <h1 className="pixel-font text-2xl md:text-4xl text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI-First ERP Platform
            </span>
          </h1>
          <p className="font-jersey text-gray-300 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
            This is the future of work, an immersive pixelart interface
            where AI&nbsp;Minions help you get things done.
          </p>
        </div>

        {/* Beta Badge */}
        <div className="mb-12 flex justify-center">
          <div className="glassmorphism px-6 py-3 rounded-lg pixel-border">
            <span className="pixel-font text-sm text-cyan-300">Invite Only</span>
          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
          <div className="flex flex-col items-center space-y-2 animate-bounce">
            <span className="pixel-font text-xs text-gray-400">START YOUR JOURNEY</span>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-cyan-400 opacity-60" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-cyan-400 opacity-60" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-purple-400 opacity-60" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-purple-400 opacity-60" />
    </section>
  );
};
