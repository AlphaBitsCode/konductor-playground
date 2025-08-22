'use client';

import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    private player: Phaser.Physics.Arcade.Sprite | null = null;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    private map: Phaser.Tilemaps.Tilemap | null = null;
    private tileset: Phaser.Tilemaps.Tileset | null = null;
    private groundLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private worldLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private playerSpeed: number = 175;

    preload() {
        // Load the map
        this.load.tilemapTiledJSON('map', '/assets/tilemaps/tuxemon-town.json');
        
        // Load the tileset images
        this.load.image('tileset', '/assets/tilesets/tuxmon-sample-32px-extruded.png');
        
        // Load character sprites
        this.load.image('player-front', '/assets/atlas/tuxemon-misa/misa-front.png');
        this.load.image('player-back', '/assets/atlas/tuxemon-misa/misa-back.png');
        this.load.image('player-left', '/assets/atlas/tuxemon-misa/misa-left.png');
        this.load.image('player-right', '/assets/atlas/tuxemon-misa/misa-right.png');
    }

    create() {
        // Create the map
        this.map = this.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('tuxmon-sample-32px-extruded', 'tileset');
        
        if (!this.tileset || !this.map) {
            console.error('Failed to load tileset or map');
            return;
        }
        
        // Create map layers
        this.groundLayer = this.map.createLayer('Base', this.tileset, 0, 0);
        this.worldLayer = this.map.createLayer('Objects', this.tileset, 0, 0);
        
        if (!this.groundLayer || !this.worldLayer) {
            console.error('Failed to create map layers');
            return;
        }
        
        // Set up collision for the world layer
        this.worldLayer.setCollisionByProperty({ collides: true });
        
        // Create player
        this.player = this.physics.add.sprite(100, 100, 'player-front');
        if (!this.player) {
            console.error('Failed to create player sprite');
            return;
        }
        
        this.player.setCollideWorldBounds(true);
        this.player.setSize(16, 16).setOffset(8, 16);
        
        // Set up physics
        if (this.map) {
            this.physics.world.bounds.width = this.map.widthInPixels;
            this.physics.world.bounds.height = this.map.heightInPixels;
        }
        
        // Set up camera
        if (this.map && this.player) {
            this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
            this.cameras.main.startFollow(this.player);
        }
        
        // Set up collision between player and world layer
        if (this.player && this.worldLayer) {
            this.physics.add.collider(this.player, this.worldLayer);
        }
        
        // Set up keyboard input
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
    }

    update() {
        if (!this.cursors || !this.player) return;
        
        const player = this.player;
        const left = this.cursors.left;
        const right = this.cursors.right;
        const up = this.cursors.up;
        const down = this.cursors.down;
        
        // Reset velocity
        player.setVelocity(0);
        
        // Handle movement and change texture based on direction
        if (left.isDown) {
            player.setVelocityX(-this.playerSpeed);
            player.setTexture('player-left');
        } else if (right.isDown) {
            player.setVelocityX(this.playerSpeed);
            player.setTexture('player-right');
        }
        
        if (up.isDown) {
            player.setVelocityY(-this.playerSpeed);
            if (!left.isDown && !right.isDown) {
                player.setTexture('player-back');
            }
        } else if (down.isDown) {
            player.setVelocityY(this.playerSpeed);
            if (!left.isDown && !right.isDown) {
                player.setTexture('player-front');
            }
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
            width: '100%',
            height: '100%',
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
        <div 
            ref={gameContainer} 
            style={{ 
                width: '100%', 
                height: '100vh',
                overflow: 'hidden'
            }} 
        />
    );
};

export default PhaserGame;
