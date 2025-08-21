'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './playground.module.css';

export default function Playground() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState(1);
  const [tasks, setTasks] = useState({ completed: 0, total: 5 });

  // Simulate day progression
  useEffect(() => {
    const timer = setInterval(() => {
      setDays(prev => prev + 1);
    }, 60000); // Increment day every minute for demo purposes

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.playgroundContainer}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.logo}>KONDUCTOR.AI</div>
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
      <div ref={gameContainerRef} className={styles.gameWorld}>
        {/* Character Areas */}
        <div className={styles.characterArea} style={{ top: '20%', left: '15%' }}>
          <div className={styles.character} style={{ backgroundImage: 'url(/avatars/avatar3.png)' }} />
          <div className={styles.characterLabel}>Tech Guy</div>
          <div className={styles.characterStats}>🛠️ Working on AI</div>
        </div>
        
        <div className={styles.characterArea} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
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
