'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

type Cloud = {
  id: number;
  x: number;
  y: number;
  speed: number;
  scale: number;
  opacity: number;
  image: string;
};

export const Clouds = () => {
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const cloudImages = [
    '/pixel-art/cloud_blue1.png',
    '/pixel-art/cloud_blue2.png',
    '/pixel-art/cloud_white1.png',
    '/pixel-art/cloud_white2.png',
  ];

  // Initialize clouds
  const initClouds = useCallback(() => {
    const newClouds: Cloud[] = [];
    const cloudCount = Math.floor(Math.random() * 2) + 2; // 2-3 clouds
    
    for (let i = 0; i < cloudCount; i++) {
      newClouds.push(createCloud(i, windowSize.width));
    }
    
    setClouds(newClouds);
  }, [windowSize.width]);

  // Create a single cloud with random properties
  const createCloud = (id: number, maxWidth: number): Cloud => ({
    id,
    x: Math.random() * maxWidth * 0.5,
    y: Math.random() * (windowSize.height * 0.1), // Only in top 10% of screen
    speed: 0.1 + Math.random() * 0.3, // Slower speed for more natural movement
    scale: 0.3 + Math.random() * 0.5, // Smaller scale for better composition
    opacity: 0.4 + Math.random() * 0.5, // More transparent clouds
    image: cloudImages[Math.floor(Math.random() * cloudImages.length)],
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize clouds when window size changes
  useEffect(() => {
    if (windowSize.width > 0) {
      initClouds();
    }
  }, [windowSize, initClouds]);

  // Animate clouds
  useEffect(() => {
    if (clouds.length === 0) return;

    const animate = () => {
      setClouds(currentClouds => 
        currentClouds.map(cloud => {
          let newX = cloud.x + cloud.speed;
          
          // Reset cloud to left side if it goes off screen
          if (newX > windowSize.width) {
            return createCloud(cloud.id, 0);
          }
          
          return { ...cloud, x: newX };
        })
      );
      
      animationId.current = requestAnimationFrame(animate);
    };

    const animationId = { current: 0 };
    animationId.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [clouds.length, windowSize.width]);

  return (
    <div className="fixed top-0 left-0 w-full h-1/3 pointer-events-none z-0">
      {clouds.map(cloud => (
        <div
          key={cloud.id}
          className="absolute"
          style={{
            transform: `translate(${cloud.x}px, ${cloud.y}px) scale(${cloud.scale})`,
            opacity: cloud.opacity,
            willChange: 'transform',
            maxWidth: '15%', // Limit cloud size
            maxHeight: '10%', // Limit cloud size
            transition: 'transform 0.1s linear',
          }}
        >
          <Image
            src={cloud.image}
            alt="Cloud"
            width={200} // Base size that will be scaled
            height={100}
            className="w-auto h-auto"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
};

export default Clouds;
