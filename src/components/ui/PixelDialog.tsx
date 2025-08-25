"use client";

import React from 'react';
import { X } from 'lucide-react';

interface PixelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function PixelDialog({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}: PixelDialogProps) {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return (
    <div className="pixel-dialog-overlay" onClick={onClose}>
      <div 
        className={`pixel-dialog ${sizeStyles[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 3D Shadow Effect */}
        <div className="pixel-dialog-shadow dark:bg-black/90 bg-stone-800/70" />
        
        {/* Main Dialog */}
        <div className="pixel-dialog-content dark:border-slate-300 border-stone-700 dark:bg-slate-900/95 bg-stone-100/95 backdrop-blur-sm">
          {/* Header */}
          <div className="pixel-dialog-header dark:bg-black/20 bg-white/30">
            <h2 className="font-press-start text-sm dark:text-white text-stone-900 uppercase tracking-wider">
              {title}
            </h2>
            <button 
              onClick={onClose}
              className="pixel-dialog-close-btn dark:border-slate-400 border-stone-600 dark:text-slate-300 text-stone-700 dark:hover:border-red-400 hover:border-red-500 dark:hover:text-red-400 hover:text-red-600 dark:hover:bg-red-500/20 hover:bg-red-100/50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Body */}
          <div className="pixel-dialog-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}