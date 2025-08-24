'use client';

import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { GameManager } from './game/GameManager';

class GameScene extends Phaser.Scene {
    private gameManager: GameManager | null = null;

    preload() {
        this.gameManager = new GameManager(this);
        this.gameManager.preloadAssets();
    }

    create() {
        if (!this.gameManager) {
            console.error('GameManager not initialized');
            return;
        }
        
        if (!this.gameManager.create()) {
            console.error('Failed to create game');
            return;
        }
    }



    update() {
        if (this.gameManager) {
            this.gameManager.update();
        }
    }
}

const PhaserGame: React.FC = () => {
    const gameContainer = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (!gameContainer.current || gameInstance.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: gameContainer.current,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: false,
                    fps: 60,
                    timeScale: 1
                } as Phaser.Types.Physics.Arcade.ArcadeWorldConfig
            },
            scene: [GameScene],
            scale: {
                mode: Phaser.Scale.RESIZE,
                width: '100%',
                height: '100%',
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        };

        gameInstance.current = new Phaser.Game(config);

        return () => {
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
                gameInstance.current = null;
            }
        };
    }, []);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden m-0 p-0" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          {/* Logo in top-left corner */}
          <div className="absolute top-4 left-4 z-10 bg-black/70 p-3 rounded-lg">
            <img 
              src="/logos/k_icon.png" 
              alt="Konductor Town" 
              className="h-12 w-auto"
            />
          </div>
          
          {/* Game container */}
          <div className="w-full h-full m-0 p-0" style={{ width: '100vw', height: '100vh' }}>
            <div 
              ref={gameContainer} 
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                margin: 0,
                padding: 0,
                overflow: 'hidden',
                display: 'block'
              }} 
              className="w-full h-full"
            />
          </div>
        </div>
    );
};

export default PhaserGame;
