'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

type Ship = {
  id: number;
  x: number;
  y: number;
  speed: number;
  scale: number;
  rotation: number;
  boatType: number; // 1-10 for boat1.png to boat10.png
};

export const SeaWithShips = () => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number | null>(null);
  const waveOffset = useRef(0);

  // Initialize ships
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Create initial ships
  useEffect(() => {
    if (windowSize.width === 0) return;
    
    const newShips: Ship[] = [];
    const shipCount = Math.min(3, Math.floor(Math.random() * 3) + 1); // 1-3 ships
    
    for (let i = 0; i < shipCount; i++) {
      newShips.push({
        id: i,
        x: Math.random() * windowSize.width * 0.7, // Start at random x position
        y: Math.random() * 10 + 20, // Random y position in the sea area
        speed: 0.2 + Math.random() * 0.5, // Random speed
        scale: 0.6, // Fixed scale for all boats
        rotation: -2 + Math.random() * 4, // Slight random rotation
        boatType: Math.floor(Math.random() * 10) + 1 // Random boat type 1-10
      });
    }
    
    setShips(newShips);
  }, [windowSize]);

  // Animate waves and ships
  useEffect(() => {
    if (ships.length === 0) return;
    
    const animate = () => {
      // Update wave offset for the wave animation
      waveOffset.current = (waveOffset.current + 0.5) % 100;
      
      // Update ship positions
      setShips(currentShips => 
        currentShips.map(ship => {
          const newX = ship.x + ship.speed;
          
          // Reset ship to left side if it goes off screen
          if (newX > windowSize.width * 1.2) {
            return {
              ...ship,
              x: -200, // Start further left to account for boat width
              y: Math.random() * 10 + 20,
              boatType: Math.floor(Math.random() * 10) + 1, // Random boat type when resetting
              scale: 0.6, // Fixed scale for all boats
              rotation: -2 + Math.random() * 4
            };
          }
          
          return { 
            ...ship, 
            x: newX,
            // Add subtle up/down bobbing motion
            y: ship.y + Math.sin(Date.now() * 0.002 + ship.id) * 0.2
          };
        })
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [ships.length, windowSize.width]);

  return (
    <div className="fixed left-0 right-0 h-1/6 z-10 pointer-events-none" 
         style={{ 
           bottom: '33%',
           background: 'transparent',
           overflow: 'hidden'
         }}
    >
      {/* Animated waves */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute w-full h-full" 
             style={{
               backgroundImage: 'url("/pixel-art/wave.png")',
               backgroundSize: '200px 30px',
               backgroundRepeat: 'repeat-x',
               transform: `translateX(${waveOffset.current}px)`,
               animation: 'wave 15s linear infinite',
               opacity: 0.7,
               height: '100%',
               width: '200%',
               mixBlendMode: 'overlay'
             }}
        />
      </div>
      
      {/* Ships */}
      {ships.map(ship => (
        <div 
          key={ship.id}
          className="absolute"
          style={{
            left: `${ship.x}px`,
            bottom: `${ship.y}%`,
            transform: `rotate(${ship.rotation}deg) scale(${ship.scale})`,
            transition: 'transform 0.3s ease-out',
            willChange: 'left, bottom, transform',
            zIndex: 10,
            filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.3))',
            transformOrigin: 'center bottom'
          }}
        >
          <Image
            src={`/pixel-art/boats/boat${ship.boatType}.png`}
            alt={`Boat ${ship.boatType}`}
            width={120}
            height={60}
            className="w-auto h-auto"
            unoptimized
            style={{
              transform: 'translateY(5px)', // Slight vertical adjustment
              transition: 'transform 0.3s ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(5px)';
            }}
          />
        </div>
      ))}
      
      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default SeaWithShips;
