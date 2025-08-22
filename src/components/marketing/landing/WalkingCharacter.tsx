'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type WalkingCharacterProps = {
  scrollY: number;
  totalSections: number;
  xPosition: number;
  isWalking: boolean;
};

export const WalkingCharacter = ({ 
  scrollY, 
  totalSections, 
  xPosition,
  isWalking 
}: WalkingCharacterProps) => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [totalPageHeight, setTotalPageHeight] = useState(0);
  const [currentCharacterY, setCurrentCharacterY] = useState(0);
  const characterRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Simple linear function for character Y position with 5% margins
  const animatePosition = useCallback(() => {
    if (characterRef.current) {
      // Calculate scroll progress as a percentage
      const scrollProgress = totalPageHeight > 0 ? Math.min(scrollY / totalPageHeight, 1) : 0;

      // Apply 10% margin at top and bottom (use 890% of available viewport height)
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
      const marginPercent = 0.10; // 10% margin
      const availableHeight = viewportHeight * (1 - (marginPercent * 2)); // 80% of viewport
      const topMargin = viewportHeight * marginPercent; // 10% of viewport

      // Simple linear function: startPos + (progress * availableDistance)
      const newY = topMargin + (scrollProgress * availableHeight);

      // Small amount of smoothing for better visual experience
      setCurrentCharacterY((prevY) => {
        const diff = newY - prevY;
        // Lower smoothing factor for more direct response
        const smoothingFactor = 0.2;
        return prevY + (diff * smoothingFactor);
      });

      // Apply the transform directly for better performance
      const roundedY = Math.round(currentCharacterY * 100) / 100;
      characterRef.current.style.transform = `translate3d(0, ${roundedY}px, 0)`;
    }

    animationFrameRef.current = requestAnimationFrame(animatePosition);
  }, [scrollY, totalPageHeight, currentCharacterY]);

  // Start/stop animation loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animatePosition);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animatePosition]);

  // Handle walking state
  useEffect(() => {
    const scrollDelta = Math.abs(scrollY - lastScrollY);
    if (scrollDelta > 5) {
      const timer = setTimeout(() => {}, 300);
      setLastScrollY(scrollY);
      return () => clearTimeout(timer);
    }
    // Always update lastScrollY to prevent jumpiness
    setLastScrollY(scrollY);
    return undefined;
  }, [scrollY, lastScrollY]);

  // Calculate total page height on component mount and resize
  useEffect(() => {
    const calculateTotalHeight = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      setTotalPageHeight(documentHeight - windowHeight);
    };

    calculateTotalHeight();
    window.addEventListener('resize', calculateTotalHeight);

    // Recalculate when content loads and periodically to handle dynamic content
    const initialTimer = setTimeout(calculateTotalHeight, 1000);

    // Add periodic recalculation to handle any dynamic content changes
    const intervalTimer = setInterval(calculateTotalHeight, 5000);

    return () => {
      window.removeEventListener('resize', calculateTotalHeight);
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  // Calculate current section based on scroll progress
  // We have: Hero (0), HR (1), Finance (2), Operations (3), Marketing (4), IT (5), LockedDoor (6)
  const scrollProgress = totalPageHeight > 0 ? Math.min(scrollY / totalPageHeight, 1) : 0;
  const currentSection = Math.floor(scrollProgress * totalSections);

  // Define section-based speech bubbles with smooth transitions
  const getSpeechBubble = () => {
    // Intro section - appears right when user starts scrolling (extended duration)
    if (scrollY >= 20 && scrollY < 300) {
      const introProgress = (scrollY - 20) / 280;
      let opacity = 1;
      if (introProgress < 0.15) {
        opacity = introProgress / 0.15; // Fade in
      } else if (introProgress > 0.75) {
        opacity = (1 - introProgress) / 0.25; // Fade out
      }
      return { text: 'Let\'s go!', color: 'cyan', opacity };
    }

    // HR section - after intro
    if (scrollY >= 320 && scrollY < totalPageHeight * 0.25) {
      const hrStart = 320;
      const hrEnd = totalPageHeight * 0.25;
      const hrProgress = (scrollY - hrStart) / (hrEnd - hrStart);

      let opacity = 1;
      if (hrProgress < 0.1) {
        opacity = hrProgress / 0.1; // Fade in
      } else if (hrProgress > 0.8) {
        opacity = (1 - hrProgress) / 0.2; // Fade out
      }

      return { text: 'The Minions are helping with interviews today!', color: 'cyan', opacity };
    }

    // For other sections, use normal section-based logic
    const sectionProgress = (scrollProgress * totalSections) % 1;
    const fadeInThreshold = 0.2;
    const fadeOutThreshold = 0.8;

    let opacity = 1;
    if (sectionProgress < fadeInThreshold) {
      opacity = sectionProgress / fadeInThreshold;
    } else if (sectionProgress > fadeOutThreshold) {
      opacity = (1 - sectionProgress) / (1 - fadeOutThreshold);
    }

    switch (currentSection) {
      case 2: // Finance Department
        return { text: 'They also are watching for fraud transactions!', color: 'green', opacity };
      case 3: // Operations Department
        return { text: 'IoT Minions are optimizing our supply chain right now', color: 'purple', opacity };
      case 4: // Marketing Department
        return { text: 'Our marketing Minions are creating campaigns while we sleep', color: 'orange', opacity };
      case 5: // IT Department
        return { text: 'Code Minions are debugging and deploying all day', color: 'blue', opacity };
      case 6: // Locked Door
        return { text: 'Get a ticket and follow me!', color: 'red', opacity: 1, locked: true };
      default:
        return null;
    }
  };

  const speechBubble = getSpeechBubble();

  return (
    <div
      className="fixed z-[100] pointer-events-none"
      style={{ 
        left: `${xPosition}%`,
        transform: 'translateX(-50%)',
        transition: 'left 0.2s ease-out',
        willChange: 'left',
      }}
      ref={characterRef}
    >
      <div
        className="character-container"
        style={{
          willChange: 'transform',
        }}
      >
        {/* Character Sprite */}
        <div
          className={`character-sprite ${isWalking ? 'walking' : 'idle'}`}
          style={{
            backgroundImage: 'url("/avatars/avatar1.png")',
            backgroundPosition: '0 0',
            imageRendering: 'pixelated',
          }}
        />

        {/* Character Shadow */}
        <div className="character-shadow" />

        {/* Speech Bubble - appears based on current section */}
        {speechBubble && (
          <div
            className={`speech-bubble ${speechBubble.locked ? 'locked' : ''}`}
            style={{
              marginLeft: '-75%',
              opacity: speechBubble.opacity,
              willChange: 'opacity, transform',
            }}
            data-color={speechBubble.color}
          >
            <span className="text-[18px] sm:text-[16px] font-jersey">{speechBubble.text}</span>
          </div>
        )}
      </div>

      <style jsx>
        {`
        /* Desktop sizes (default) */
        .character-container {
          will-change: transform;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          /* Remove CSS transition - we're handling smooth animation with JS */
        }
        
        .character-sprite {
          width: 72px;
          height: 95px;
          background-size: 72px 95px;
          transform: translate3d(0, 0, 0);
        }
        
        .character-sprite.walking {
          /* Subtle jitter to simulate movement with a static image */
          animation: walk-jitter 0.2s linear infinite alternate;
        }

        /* No idle animation: stays centered when not walking */
        .character-sprite.idle {
          animation: none;
          transform: translate3d(0, 0, 0);
        }

        /* Jitter by ±1px vertically */
        @keyframes walk-jitter {
          from { transform: translate3d(0, -1px, 0); }
          to { transform: translate3d(0, 1px, 0); }
        }
        
        /* Desktop sizes for shadow and speech bubble */
        .character-shadow {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 8px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          filter: blur(2px);
        }
        
        .speech-bubble {
          position: absolute;
          bottom: 120px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          border: 2px solid #00ffff;
          white-space: normal;
          word-wrap: break-word;
          max-width: 300px;
          min-width: 180px;
          text-align: center;
          transition: opacity 0.3s ease-in-out;
          line-height: 1.3;
          /* Ensure bubble doesn't go off left edge */
          max-width: min(300px, calc(100vw - 40px));
          left: max(50%, calc(150px + 20px));
          transform: translateX(min(-50%, calc(-150px - 20px)));
        }
        
        /* Mobile responsive styles - 50% smaller */
        @media (max-width: 768px) {
          .character-sprite {
            width: 36px;
            height: 47px;
            background-size: 36px 47px;
          }
          
          /* Mobile keeps the same jitter scale */
          
          .character-shadow {
            bottom: -2px;
            width: 16px;
            height: 4px;
            filter: blur(1px);
          }
          
          /* 50% smaller speech bubble for mobile (1.5x wider) */
          .speech-bubble {
            bottom: 60px;
            padding: 4px 6px;
            border-radius: 4px;
            min-width: 120px;
            max-width: min(210px, calc(100vw - 30px));
            font-size: 9px;
            line-height: 1.3;
            /* Better mobile positioning to prevent edge overflow */
            left: max(50%, calc(105px + 15px));
            transform: translateX(min(-50%, calc(-105px - 15px))) scale(0.8);
          }
          
          .speech-bubble::after {
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #00ffff;
          }
          
          .speech-bubble[data-color="cyan"]::after {
            border-top-color: #00ffff;
          }
          
          .speech-bubble[data-color="green"]::after {
            border-top-color: #00ff00;
          }
          
          .speech-bubble[data-color="purple"]::after {
            border-top-color: #ff00ff;
          }
          
          .speech-bubble[data-color="orange"]::after {
            border-top-color: #ffa500;
          }
          
          .speech-bubble[data-color="blue"]::after {
            border-top-color: #0088ff;
          }
          
          .speech-bubble[data-color="red"]::after,
          .speech-bubble.locked::after {
            border-top-color: #ff6b6b;
          }
        }
        
        /* Speech bubble color variants */
        .speech-bubble[data-color="cyan"] {
          border-color: #00ffff;
        }
        
        .speech-bubble[data-color="green"] {
          border-color: #00ff00;
        }
        
        .speech-bubble[data-color="purple"] {
          border-color: #ff00ff;
        }
        
        .speech-bubble[data-color="orange"] {
          border-color: #ffa500;
        }
        
        .speech-bubble[data-color="blue"] {
          border-color: #0088ff;
        }
        
        .speech-bubble[data-color="red"] {
          border-color: #ff6b6b;
        }
        
        .speech-bubble.locked {
          border-color: #ff6b6b;
          background: rgba(139, 69, 19, 0.8);
        }
        
        .speech-bubble::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #00ffff;
        }
        
        .speech-bubble[data-color="cyan"]::after {
          border-top-color: #00ffff;
        }
        
        .speech-bubble[data-color="green"]::after {
          border-top-color: #00ff00;
        }
        
        .speech-bubble[data-color="purple"]::after {
          border-top-color: #ff00ff;
        }
        
        .speech-bubble[data-color="orange"]::after {
          border-top-color: #ffa500;
        }
        
        .speech-bubble[data-color="blue"]::after {
          border-top-color: #0088ff;
        }
        
        .speech-bubble[data-color="red"]::after,
        .speech-bubble.locked::after {
          border-top-color: #ff6b6b;
        }
        
      `}
      </style>
    </div>
  );
};
