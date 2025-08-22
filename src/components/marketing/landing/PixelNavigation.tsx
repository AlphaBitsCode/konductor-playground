'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export const PixelNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      // Calculate scroll progress
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollY / documentHeight) * 100, 100);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glassmorphism shadow-lg' : 'bg-transparent'
    }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/logos/k_logo_white.png"
              alt="Konductor.AI"
              width={148}
              height={32}
              className="pixel-font"
            />
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              type="button"
              onClick={() => scrollToSection('hero')}
              className="pixel-font text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-200"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('departments')}
              className="pixel-font text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-200"
            >
              Explore
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('signup')}
              className="pixel-button glassmorphism px-4 py-2 rounded border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 transition-all duration-200"
            >
              <span className="pixel-font text-sm">Get Ticket</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button type="button" className="text-white p-2" aria-label="Open menu">
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm"></span>
                <span className="bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm translate-y-1"></span>
                <span className="bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm translate-y-2"></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300"
        style={{
          width: `${scrollProgress}%`,
        }}
      />
    </nav>
  );
};
