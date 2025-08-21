'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './playground.module.css';

type Position = {
  x: number;
  y: number;
};

export default function Playground() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState(1);
  const [tasks, setTasks] = useState({ completed: 0, total: 5 });
  const [targetPosition, setTargetPosition] = useState<Position>({ x: 50, y: 50 });
  const [currentPosition, setCurrentPosition] = useState<Position>({ x: 50, y: 50 });
  const animationRef = useRef<number | null>(null);
  const speed = 0.05; // Adjust speed as needed

  const moveCharacter = useCallback(() => {
    if (!characterRef.current) return;

    const dx = targetPosition.x - currentPosition.x;
    const dy = targetPosition.y - currentPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 1) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const newX = currentPosition.x + dx * speed;
    const newY = currentPosition.y + dy * speed;
    
    setCurrentPosition({ x: newX, y: newY });
    characterRef.current.style.transform = `translate(calc(${newX}% - 40px), calc(${newY}% - 40px))`;
    
    animationRef.current = requestAnimationFrame(moveCharacter);
  }, [currentPosition, targetPosition]);

  const handleGameClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!gameContainerRef.current) return;
    
    const rect = gameContainerRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // This is a TouchEvent
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // This is a MouseEvent
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = (clientX - rect.left) / rect.width * 100;
    const y = (clientY - rect.top) / rect.height * 100;
    
    setTargetPosition({ x, y });
    
    if (!animationRef.current) {
      moveCharacter();
    }
  }, [moveCharacter]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Simulate day progression
  useEffect(() => {
    const timer = setInterval(() => {
      setDays(prev => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.playgroundContainer}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <Image 
          src="/logos/k_logo.png" 
          alt="Konductor.AI" 
          width={40} 
          height={40} 
          className={styles.logo}
          unoptimized
          priority
        />
        <div className={styles.metrics}>
          <div className={styles.metricItem}>
            <span className={styles.metricIcon}>👥</span>
            <span>4</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricIcon}>📅</span>
            <span>Day {days}</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricIcon}>✅</span>
            <span>{tasks.completed}/{tasks.total} Tasks</span>
          </div>
        </div>
      </div>

      {/* Game World */}
      <div 
        ref={gameContainerRef} 
        className={styles.gameWorld}
        onClick={handleGameClick}
        onTouchStart={handleGameClick}
      >
        {/* Character Areas */}
        <div className={styles.characterArea} style={{ top: '20%', left: '15%' }}>
          <div className={styles.character} style={{ backgroundImage: 'url(/avatars/avatar3.png)' }} />
          <div className={styles.characterLabel}>Tech Guy</div>
          <div className={styles.characterStats}>🛠️ Working on AI</div>
        </div>
        
        <div 
          ref={characterRef}
          className={styles.characterArea} 
          style={{ 
            position: 'absolute',
            left: `${currentPosition.x}%`,
            top: `${currentPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className={styles.mainCharacter} style={{ backgroundImage: 'url(/avatars/avatar1.png)' }} />
          <div className={styles.characterLabel}>You</div>
        </div>
        
        <div className={styles.characterArea} style={{ top: '20%', right: '15%' }}>
          <div className={styles.character} style={{ backgroundImage: 'url(/avatars/avatar2.png)' }} />
          <div className={styles.characterLabel}>Admin Lady</div>
          <div className={styles.characterStats}>📊 Managing Data</div>
        </div>
        
        <div className={styles.characterArea} style={{ top: '70%', left: '50%', transform: 'translateX(-50%)' }}>
          <div className={styles.character} style={{ backgroundImage: 'url(/avatars/avatar4.png)' }} />
          <div className={styles.characterLabel}>Chief of Staff</div>
          <div className={styles.characterStats}>📈 Planning Strategy</div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className={styles.bottomBar}>
        <button 
          className={styles.actionButton}
          onClick={() => setTasks(prev => ({
            completed: Math.min(prev.completed + 1, prev.total),
            total: prev.total
          }))}
        >
          Complete Task
        </button>
        <div className={styles.controls}>
          <button className={styles.controlButton}>←</button>
          <button className={styles.controlButton}>↑</button>
          <button className={styles.controlButton}>↓</button>
          <button className={styles.controlButton}>→</button>
        </div>
      </div>
    </div>
  );
}
