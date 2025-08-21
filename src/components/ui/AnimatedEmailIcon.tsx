'use client';

import { useEffect, useState } from 'react';

interface AnimatedEmailIconProps {
  isVisible: boolean;
  onAnimationComplete: () => void;
}

export const AnimatedEmailIcon = ({ isVisible, onAnimationComplete }: AnimatedEmailIconProps) => {
  const [animationPhase, setAnimationPhase] = useState<'hidden' | 'flying' | 'completed'>('hidden');

  useEffect(() => {
    if (isVisible) {
      setAnimationPhase('flying');
      
      // Complete animation after 2 seconds
      const timer = setTimeout(() => {
        setAnimationPhase('completed');
        onAnimationComplete();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setAnimationPhase('hidden');
    }
  }, [isVisible, onAnimationComplete]);

  if (animationPhase === 'hidden') {
    return null;
  }

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${animationPhase === 'flying' ? 'animate-email-fly' : ''}`}>
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          animation: animationPhase === 'flying' ? 'email-send 2s ease-out forwards' : undefined,
        }}
      >
        <div className="text-6xl filter drop-shadow-lg">✉️</div>
      </div>

      <style jsx>{`
        @keyframes email-send {
          0% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% { 
            transform: translate(-50%, -150%) scale(1.2) rotate(10deg);
            opacity: 0.8;
          }
          100% { 
            transform: translate(-50%, -300%) scale(0.5) rotate(20deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
