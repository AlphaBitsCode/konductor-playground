"use client";

import React from 'react';

interface PixelWindowProps {
  title: string;
  stats?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export function PixelWindow({ 
  title, 
  stats, 
  children, 
  className = '', 
  variant = 'default' 
}: PixelWindowProps) {
  const variantStyles = {
    default: 'dark:bg-slate-900/90 bg-stone-100/90 dark:border-slate-300 border-stone-700',
    primary: 'dark:bg-cyan-950/90 bg-cyan-50/90 dark:border-cyan-300 border-cyan-700',
    secondary: 'dark:bg-purple-950/90 bg-purple-50/90 dark:border-purple-300 border-purple-700'
  };

  return (
    <div className={`pixel-window-container ${className}`}>
      {/* 3D Shadow Effect */}
      <div className="pixel-window-shadow dark:bg-black/80 bg-stone-800/60" />
      
      {/* Main Window */}
      <div className={`pixel-window ${variantStyles[variant]} backdrop-blur-sm`}>
        {/* Header Bar */}
        <div className="pixel-window-header dark:bg-black/20 bg-white/30">
          <h3 className="font-press-start text-xs dark:text-white text-stone-900 uppercase tracking-wider">
            {title}
          </h3>
          {stats && (
            <div className="pixel-window-stats dark:bg-black/30 bg-white/50 dark:border-slate-400 border-stone-600">
              <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600">
                {stats}
              </span>
            </div>
          )}
        </div>
        
        {/* Content Area */}
        <div className="pixel-window-content">
          {children}
        </div>
      </div>
    </div>
  );
}