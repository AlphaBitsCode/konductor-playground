'use client';

import { useEffect, useRef, useState } from 'react';

type SlidingDoorProps = {
  scrollY: number;
  totalSections: number;
};

export const SlidingDoor = ({ scrollY, totalSections: _totalSections }: SlidingDoorProps) => {
  const [doorPosition, setDoorPosition] = useState(100); // Start completely hidden (100% = fully below screen)
  const [totalPageHeight, setTotalPageHeight] = useState(0);
  const doorRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Calculate when the character is approaching the bottom
  const animateDoor = () => {
    if (doorRef.current) {
      const scrollProgress = totalPageHeight > 0 ? Math.min(scrollY / totalPageHeight, 1) : 0;

      // Start showing the door when we're 85% through the page (character approaching bottom)
      const doorTriggerPoint = 0.85;

      if (scrollProgress >= doorTriggerPoint) {
        // Calculate how much the door should slide up
        const doorProgress = (scrollProgress - doorTriggerPoint) / (1 - doorTriggerPoint);

        // Smooth easing function for door animation
        const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;
        const easedProgress = easeOutCubic(Math.min(doorProgress, 1));

        // Door position: 100% = hidden, 0% = fully visible
        const newPosition = 100 - (easedProgress * 60); // Show 60% of the door
        setDoorPosition(newPosition);
      } else {
        // Keep door hidden when not near the bottom
        setDoorPosition(100);
      }
    }

    animationFrameRef.current = requestAnimationFrame(animateDoor);
  };

  // Animation loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animateDoor);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scrollY, totalPageHeight]);

  // Calculate total page height
  useEffect(() => {
    const calculateTotalHeight = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      setTotalPageHeight(documentHeight - windowHeight);
    };

    calculateTotalHeight();
    window.addEventListener('resize', calculateTotalHeight);

    const initialTimer = setTimeout(calculateTotalHeight, 1000);

    return () => {
      window.removeEventListener('resize', calculateTotalHeight);
      clearTimeout(initialTimer);
    };
  }, []);

  return (
    <div
      className="fixed z-[99] pointer-events-none"
      ref={doorRef}
      style={{
        left: '14%', // Position to the left of the walking character (which is at 15%)
        bottom: '2%',
        transform: `translateY(${doorPosition}%)`,
        transition: 'none', // We're handling animation manually
        willChange: 'transform',
      }}
    >
      <div className="door-container relative">
        {/* Door Frame */}
        <div className="door-frame">
          {/* Left Door Panel */}
          <div className="door-panel door-left">
            <div className="door-window"></div>
            <div className="door-handle door-handle-left"></div>
          </div>

          {/* Right Door Panel */}
          <div className="door-panel door-right">
            <div className="door-window"></div>
            <div className="door-handle door-handle-right"></div>
          </div>

          {/* Door Sign */}
          <div className="door-sign">
            <span className="pixel-font text-gray-300" style={{ fontSize: '7px', lineHeight: '1' }}>
              PLAYGROUND
            </span>
          </div>
        </div>

        {/* Door Shadow */}
        <div className="door-shadow"></div>
      </div>

      <style jsx>
        {`
        .door-container {
          width: 100px; /* Twice bigger: 50px * 2 = 100px */
          height: 150px; /* Twice bigger: 75px * 2 = 150px */
          position: relative;
        }
        
        .door-frame {
          width: 100%;
          height: 100%;
          background: #8B4513;
          border: 2px solid #654321; /* Bigger border */
          border-radius: 4px 4px 0 0; /* Bigger radius */
          position: relative;
          display: flex;
          image-rendering: pixelated;
          box-shadow: 
            inset 0 0 0 2px #A0522D,
            0 -2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .door-panel {
          flex: 1;
          height: 100%;
          position: relative;
          background: linear-gradient(
            to right,
            #8B4513 0%,
            #A0522D 50%,
            #8B4513 100%
          );
          border: 2px solid #654321; /* Bigger border */
        }
        
        .door-left {
          border-right: 1px solid #654321;
          border-radius: 2px 0 0 0;
        }
        
        .door-right {
          border-left: 1px solid #654321;
          border-radius: 0 2px 0 0;
        }
        
        .door-window {
          width: 60%;
          height: 40%;
          background: rgba(0, 50, 100, 0.8);
          border: 1px solid #4A5568; /* Bigger border */
          border-radius: 2px; /* Bigger radius */
          position: absolute;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 
            inset 0 0 4px rgba(0, 0, 0, 0.5),
            0 0 2px rgba(100, 200, 255, 0.3);
        }
        
        .door-window::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #4A5568;
          transform: translateY(-50%);
        }
        
        .door-window::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: #4A5568;
          transform: translateX(-50%);
        }
        
        .door-handle {
          width: 4px; /* Twice bigger handles */
          height: 4px;
          background: #FFD700;
          border: 1px solid #B8860B;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .door-handle-left {
          right: 6px; /* Adjusted for bigger door */
        }
        
        .door-handle-right {
          left: 6px; /* Adjusted for bigger door */
        }
        
        .door-sign {
          position: absolute;
          top: -24px; /* Bigger offset */
          left: 50%;
          transform: translateX(-50%);
          background: rgba(139, 69, 19, 0.9);
          border: 1px solid #654321;
          border-radius: 2px;
          padding: 2px 6px; /* Bigger padding */
          text-align: center;
          min-width: 60px; /* Bigger sign */
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          font-size: 8px !important; /* Bigger text */
        }
        
        .door-shadow {
          position: absolute;
          bottom: -6px; /* Bigger offset */
          left: 50%;
          transform: translateX(-50%);
          width: 120px; /* Twice bigger shadow */
          height: 16px; /* Twice bigger shadow */
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.2) 50%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(2px);
        }
        
        /* Mobile responsive styles - bigger on mobile too */
        @media (max-width: 768px) {
          .door-container {
            width: 60px; /* Twice bigger on mobile */
            height: 90px;
          }
          
          .door-frame {
            border: 1px solid #654321;
            border-radius: 2px 2px 0 0;
          }
          
          .door-panel {
            border: 1px solid #654321;
          }
          
          .door-window {
            border: 1px solid #4A5568;
            border-radius: 2px;
          }
          
          .door-handle {
            width: 2px;
            height: 2px;
          }
          
          .door-handle-left {
            right: 4px;
          }
          
          .door-handle-right {
            left: 4px;
          }
          
          .door-sign {
            top: -16px;
            padding: 2px 4px;
            min-width: 40px;
            font-size: 6px !important;
            border: 1px solid #654321;
          }
          
          .door-shadow {
            bottom: -4px;
            width: 70px;
            height: 8px;
          }
        }
        
        /* Subtle glow effect for interactivity hint */
        .door-frame:hover {
          box-shadow: 
            inset 0 0 0 2px #A0522D,
            0 -4px 8px rgba(0, 0, 0, 0.3),
            0 0 16px rgba(255, 215, 0, 0.2);
        }
        
        /* Add subtle wood grain texture */
        .door-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(101, 67, 33, 0.1) 1px,
              rgba(101, 67, 33, 0.1) 2px,
              transparent 3px
            );
          pointer-events: none;
        }
        
        /* Pixelated rendering for retro aesthetic */
        * {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `}
      </style>
    </div>
  );
};
