'use client';

import { useEffect, useState } from 'react';
import { HeroSection } from './landing/HeroSection';
import { DepartmentSection } from './landing/DepartmentSection';
import { LockedDoorSection } from './landing/LockedDoorSection';
import { WalkingCharacter } from './landing/WalkingCharacter';
import { SlidingDoor } from './landing/SlidingDoor';
import { PixelNavigation } from './landing/PixelNavigation';
import { Copyright } from './landing/Copyright';

export const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    setIsLoaded(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const departments = [
    {
      id: 'hr',
      name: 'Human Resources',
      description: 'AI-powered talent management and employee experience',
      emoji: '👥',
      color: 'from-blue-500 to-cyan-500',
      characterPosition: 'left',
    },
    {
      id: 'finance',
      name: 'Finance & Accounting',
      description: 'Intelligent financial planning and real-time analytics',
      emoji: '💰',
      color: 'from-green-500 to-emerald-500',
      characterPosition: 'right',
    },
    {
      id: 'operations',
      name: 'Operations',
      description: 'Streamlined workflows and automated processes',
      emoji: '⚙️',
      color: 'from-purple-500 to-violet-500',
      characterPosition: 'left',
    },
    {
      id: 'marketing',
      name: 'Marketing & Sales',
      description: 'Data-driven campaigns and customer insights',
      emoji: '📈',
      color: 'from-orange-500 to-red-500',
      characterPosition: 'right',
    },
    {
      id: 'it',
      name: 'IT & Development',
      description: 'Smart infrastructure and code automation',
      emoji: '💻',
      color: 'from-indigo-500 to-blue-500',
      characterPosition: 'left',
    },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="pixel-loader">
          <div className="pixel-block"></div>
          <div className="pixel-block"></div>
          <div className="pixel-block"></div>
          <div className="pixel-block"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Pixel Art Styling */}
      <style jsx global>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pixel-font {
          font-family: 'Press Start 2P', monospace;
          line-height: 1.4;
        }
        
        @media (max-width: 768px) {
          .pixel-font {
            line-height: 1.6;
          }
        }
        
        .pixel-loader {
          display: flex;
          gap: 4px;
        }
        
        .pixel-block {
          width: 12px;
          height: 12px;
          background: #00ffff;
          animation: pixel-pulse 1s infinite;
        }
        
        .pixel-block:nth-child(1) { animation-delay: 0s; }
        .pixel-block:nth-child(2) { animation-delay: 0.2s; }
        .pixel-block:nth-child(3) { animation-delay: 0.4s; }
        .pixel-block:nth-child(4) { animation-delay: 0.6s; }
        
        @keyframes pixel-pulse {
          0%, 70%, 100% { opacity: 0.3; }
          35% { opacity: 1; }
        }
        
        .glassmorphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .pixel-border {
          border-image: url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m0,0l0,20l20,0l0,20l80,0l0,-20l20,0l0,-80l-20,0l0,-20l-80,0l0,20l-20,0l0,80z' fill='none' stroke='%23ffffff' stroke-width='2'/%3e%3c/svg%3e") 20;
        }
        
        .parallax-bg {
          will-change: transform;
        }
        
        .walking-animation {
          animation: walk 2s steps(4, end) infinite;
        }
        
        @keyframes walk {
          0% { background-position-x: 0px; }
          100% { background-position-x: -128px; }
        }
        
        .pixel-button {
          transition: all 0.1s;
          image-rendering: pixelated;
        }
        
        .pixel-button:hover {
          transform: scale(1.05);
        }
        
        .simple-bg-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(45deg, transparent 49%, rgba(0, 255, 255, 0.05) 50%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, rgba(255, 0, 255, 0.03) 50%, transparent 51%);
          background-size: 40px 40px, 60px 60px;
          animation: simple-drift 120s infinite linear;
          pointer-events: none;
          will-change: background-position;
        }
        
        @keyframes simple-drift {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 40px 40px, -60px 60px; }
        }
        
        /* Subtle pulsing overlay for depth */
        .subtle-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.02) 0%, transparent 50%);
          animation: subtle-pulse 8s ease-in-out infinite;
          pointer-events: none;
        }
        
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}
      </style>

      {/* Navigation */}
      <PixelNavigation />

      {/* Walking Character - Fixed position that follows scroll */}
      <WalkingCharacter scrollY={scrollY} totalSections={7} />

      {/* Sliding Door - Appears at bottom when character approaches */}
      <SlidingDoor scrollY={scrollY} />

      {/* Hero Section */}
      <HeroSection />

      {/* Department Sections */}
      {departments.map((department, index) => (
        <DepartmentSection
          key={department.id}
          department={department}
          index={index}
          isFirst={index === 0}
        />
      ))}

      {/* Locked Door Section */}
      <LockedDoorSection />

      {/* Copyright */}
      <Copyright />

      {/* Background Elements - Optimized for better performance */}
      <div className="fixed inset-0 simple-bg-animation pointer-events-none" />
      <div className="fixed inset-0 subtle-overlay pointer-events-none" />
    </div>
  );
};
