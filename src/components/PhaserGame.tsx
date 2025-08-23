'use client';

import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    private map: Phaser.Tilemaps.Tilemap | null = null;
    private tileset: Phaser.Tilemaps.Tileset | null = null;
    private groundLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private worldLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private playerSpeed: number = 175;
    private targetPosition: { x: number, y: number } | null = null;
    private graphics: Phaser.GameObjects.Graphics | null = null;
    private zoomButtons: { zoomIn: Phaser.GameObjects.Text; zoomOut: Phaser.GameObjects.Text } | null = null;
    private currentZoom: number = 1;
    private minions: {sprite: Phaser.GameObjects.Sprite, type: number}[] = [];

    preload() {
        // Load the map
        this.load.tilemapTiledJSON('map', '/assets/tilemaps/tuxemon-town.json');
        
        // Load the tileset images
        this.load.image('tileset', '/assets/tilesets/tuxmon-sample-32px-extruded.png');
        
        // Load base-boy character sprites
        this.load.spritesheet(
            'player-idle',
            '/assets/characters/base-boy/Unarmed_Idle_with_shadow.png',
            { frameWidth: 64, frameHeight: 64 }
        );
        
        this.load.spritesheet(
            'player-walk',
            '/assets/characters/base-boy/Unarmed_Run_with_shadow.png',
            { frameWidth: 64, frameHeight: 64 }
        );

        // Load player hurt sprite
        this.load.spritesheet(
            'player-hurt',
            '/assets/characters/base-boy/Unarmed_Hurt_with_shadow.png',
            { frameWidth: 64, frameHeight: 64 }
        );

        // Load slime spritesheets
        for (let i = 1; i <= 3; i++) {
            this.load.spritesheet(
                `slime${i}-idle`,
                `/assets/characters/slime/Slime${i}_Idle_full.png`,
                { frameWidth: 64, frameHeight: 64 }
            );
            this.load.spritesheet(
                `slime${i}-walk`,
                `/assets/characters/slime/Slime${i}_Walk_full.png`,
                { frameWidth: 64, frameHeight: 64 }
            );
            // Load slime hurt sprites
            this.load.spritesheet(
                `slime${i}-hurt`,
                `/assets/characters/slime/Slime${i}_Hurt_full.png`,
                { frameWidth: 64, frameHeight: 64 }
            );
        }
    }

    create() {
        // Create animations for base-boy character
        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNumbers('player-idle', { start: 0, end: 5 }),
            frameRate: 6.67,
            repeat: -1
        });
        
        this.anims.create({
            key: 'player-walk',
            frames: this.anims.generateFrameNumbers('player-walk', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        // Player hurt animation
        this.anims.create({
            key: 'player-hurt',
            frames: this.anims.generateFrameNumbers('player-hurt', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });

        // Create animations for each slime type
        for (let i = 1; i <= 3; i++) {
            // Idle animation
            this.anims.create({
                key: `slime${i}-idle`,
                frames: this.anims.generateFrameNumbers(`slime${i}-idle`, { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });

            // Walk animation
            this.anims.create({
                key: `slime${i}-walk`,
                frames: this.anims.generateFrameNumbers(`slime${i}-walk`, { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });

            // Hurt animation
            this.anims.create({
                key: `slime${i}-hurt`,
                frames: this.anims.generateFrameNumbers(`slime${i}-hurt`, { start: 0, end: 3 }),
                frameRate: 10,
                repeat: 0
            });
        }

        // Create the map
        this.map = this.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('tuxmon-sample-32px-extruded', 'tileset');
        
        if (!this.tileset || !this.map) {
            console.error('Failed to load tileset or map');
            return;
        }
        
        // Create all map layers in the correct order
        // 1. Below Player (ground, paths, etc.)
        const belowPlayerLayer = this.map.createLayer('Below Player', this.tileset, 0, 0);
        // 2. World layer (main ground layer)
        this.groundLayer = this.map.createLayer('World', this.tileset, 0, 0);
        // 3. Above Player layer (trees, objects, etc.)
        this.worldLayer = this.map.createLayer('Above Player', this.tileset, 0, 0);
        
        if (!belowPlayerLayer || !this.groundLayer || !this.worldLayer) {
            console.error('Failed to create map layers. Available layers:', this.map.layers.map(l => l.name));
            return;
        }
        
        // Set up collision for all layers that should block the player
        // The 'collides' property is set in Tiled for tiles that should block the player
        const collisionLayers = [this.groundLayer, this.worldLayer];
        
        collisionLayers.forEach(layer => {
            if (layer) {
                // Set collision for any tile with collides=true property
                layer.setCollisionByProperty({ collides: true });
                
                // For debugging: visualize collision boxes
                // this.physics.world.createDebugGraphic();
                // layer.renderDebug(this.add.graphics(), {
                //     tileColor: null,
                //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200),
                //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
                // });
            }
        });
        
        // Find spawn point from the tilemap
        let spawnX = 100; // Default spawn position
        let spawnY = 100;
        
        const objects = this.map.getObjectLayer('Objects');
        if (objects) {
            const spawnPoint = objects.objects.find(obj => obj.name === 'Spawn Point');
            if (spawnPoint && typeof spawnPoint.x === 'number' && typeof spawnPoint.y === 'number') {
                spawnX = spawnPoint.x;
                spawnY = spawnPoint.y;
                console.log(`Found spawn point at ${spawnX}, ${spawnY}`);
            } else {
                console.warn('Spawn Point not found in tilemap, using default position');
            }
        } else {
            console.warn('Objects layer not found in tilemap, using default position');
        }

        // Create player at spawn point
        this.player = this.physics.add.sprite(spawnX, spawnY, 'player-idle');
        if (!this.player) {
            console.error('Failed to create player sprite');
            return;
        }
        
        // Set up player physics body with 32px radius
        this.player.setCircle(32);
        this.player.setCollideWorldBounds(true);
        this.player.play('player-idle');
        
        // Set up physics
        if (this.map) {
            this.physics.world.bounds.width = this.map.widthInPixels;
            this.physics.world.bounds.height = this.map.heightInPixels;
        }
        
        // Set up camera
        if (this.map && this.player) {
            this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
            this.cameras.main.startFollow(this.player);
            this.cameras.main.setZoom(1);
            this.currentZoom = 1; // Update the current zoom state
            
            // Add zoom buttons
            const style = { 
                font: '20px Arial', 
                fill: '#ffffff',
                backgroundColor: '#00000080',
                padding: { x: 10, y: 5 }
            };
            
            const zoomInButton = this.add.text(20, 20, '+', style)
                .setInteractive()
                .on('pointerdown', () => this.zoomCamera(0.1));
                
            const zoomOutButton = this.add.text(20, 60, '-', style)
                .setInteractive()
                .on('pointerdown', () => this.zoomCamera(-0.1));
                
            this.zoomButtons = { zoomIn: zoomInButton, zoomOut: zoomOutButton };
            
            // Make buttons stay in fixed position on screen
            this.cameras.main.setScroll(0, 0);
            this.cameras.main.ignore([zoomInButton, zoomOutButton]);
        }
        
        // Set up collision between player and all collision layers
        if (this.player) {
            collisionLayers.forEach(layer => {
                if (layer) {
                    // The non-null assertion (!) is safe here because we've already checked this.player
                    this.physics.add.collider(this.player!, layer);
                }
            });
        }
        
        // Set up keyboard input
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }

        // Set up click-to-move
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
                const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
                this.targetPosition = { x: worldPoint.x, y: worldPoint.y };
                
                // Debug log click position
                console.log(`Clicked at world position: x=${Math.round(worldPoint.x)}, y=${Math.round(worldPoint.y)}`);
                
                // Draw a temporary marker at the target position
                if (this.graphics) {
                    this.graphics.clear();
                    this.graphics.fillStyle(0x00ff00, 0.5);
                    this.graphics.fillCircle(worldPoint.x, worldPoint.y, 10);
                    this.time.delayedCall(300, () => {
                        if (this.graphics) this.graphics.clear();
                    });
                }
            }
        });
        
        // Create graphics for visual feedback
        this.graphics = this.add.graphics();
        
        // Spawn initial slimes
        this.spawnRandomSlimes(20);
    }

    private spawnRandomSlime(): void {
        if (!this.map || !this.groundLayer || !this.worldLayer) return;
        
        // Get random position within map bounds
        const x = Phaser.Math.Between(100, this.map.widthInPixels - 100);
        const y = Phaser.Math.Between(100, this.map.heightInPixels - 100);
        
        // Random slime type (1-3)
        const slimeType = Phaser.Math.Between(1, 3);
        
        // Spawn the slime
        this.spawnSlimeAt(x, y, slimeType);
    }
    
    private spawnSlimeAt(x: number, y: number, slimeType: number): void {
        if (!this.player || !this.groundLayer || !this.worldLayer) return;
        
        try {
            const slime = this.physics.add.sprite(x, y, `slime${slimeType}-idle`);
            if (!slime) {
                console.error('Failed to create slime sprite');
                return;
            }
            
            // Set up slime physics body with 32px radius
            slime.setCircle(32);
            
            // Store reference to the slime type on the sprite for collision handling
            slime.setData('type', 'slime');
            slime.setData('slimeType', slimeType);
            
            // Set up collision with the map layers
            this.physics.add.collider(slime, this.groundLayer);
            this.physics.add.collider(slime, this.worldLayer);
            
            // Set up collision with the player
            if (this.player.body) {
                this.physics.add.collider(slime, this.player, this.handleCollision);
            }
            
            // Set up collision with other slimes
            this.minions.forEach(({sprite: minion}) => {
                this.physics.add.collider(slime, minion, this.handleSlimeCollision);
            });
            
            // Add to minions array
            this.minions.push({sprite: slime, type: slimeType});
            
            // Configure physics properties
            slime.play(`slime${slimeType}-idle`);
            slime.setCollideWorldBounds(true);
            slime.setImmovable(false);
            slime.setBounce(0.2);
            
            // Add simple AI movement (wander around randomly)
            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    if (slime.active && slime.body) {
                        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
                        const speed = Phaser.Math.FloatBetween(20, 50);
                        slime.setVelocity(
                            Math.cos(angle) * speed,
                            Math.sin(angle) * speed
                        );
                        slime.play(`slime${slimeType}-walk`, true);
                        
                        // Stop after a short time
                        this.time.delayedCall(1000, () => {
                            if (slime.active) {
                                slime.setVelocity(0, 0);
                                slime.play(`slime${slimeType}-idle`, true);
                            }
                        });
                    }
                },
                loop: true
            });
            
        } catch (error) {
            console.error('Error spawning slime:', error);
        }
    }
    
    private spawnRandomSlimes(count: number): void {
        for (let i = 0; i < count; i++) {
            this.time.delayedCall(i * 500, () => this.spawnRandomSlime());
        }
    }
    
    private handleCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (obj1, obj2) => {
        const slime = obj1 as Phaser.Physics.Arcade.Sprite;
        const player = obj2 as Phaser.Physics.Arcade.Sprite;
        
        // Play hurt animations
        player.play('player-hurt');
        slime.play(`slime${slime.getData('slimeType')}-hurt`);
        
        // Return to idle after hurt animation
        this.time.delayedCall(500, () => {
            if (player.active) player.play('player-idle');
            if (slime.active) slime.play(`slime${slime.getData('slimeType')}-idle`);
        });
    }
    
    private handleSlimeCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (obj1, obj2) => {
        const s1 = obj1 as Phaser.Physics.Arcade.Sprite;
        const s2 = obj2 as Phaser.Physics.Arcade.Sprite;
        
        // Play hurt animations for both slimes
        s1.play(`slime${s1.getData('slimeType')}-hurt`);
        s2.play(`slime${s2.getData('slimeType')}-hurt`);
        
        // Small knockback effect
        const angle = Phaser.Math.Angle.Between(s1.x, s1.y, s2.x, s2.y);
        s1.setVelocity(Math.cos(angle) * 100, Math.sin(angle) * 100);
        s2.setVelocity(-Math.cos(angle) * 100, -Math.sin(angle) * 100);
        
        // Return to idle after hurt animation
        this.time.delayedCall(500, () => {
            if (s1.active) s1.play(`slime${s1.getData('slimeType')}-idle`);
            if (s2.active) s2.play(`slime${s2.getData('slimeType')}-idle`);
        });
    }

    update() {
        if (!this.player || !this.cursors) return;

        // Stop any previous movement from the last frame
        this.player.setVelocity(0);

        // Handle keyboard input
        const speed = this.playerSpeed;
        if (this.cursors.left?.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
        } else if (this.cursors.right?.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
        }

        if (this.cursors.up?.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down?.isDown) {
            this.player.setVelocityY(speed);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        this.player.body.velocity.normalize().scale(speed);

        // Update animations based on movement
        if (this.cursors.left?.isDown || this.cursors.right?.isDown || 
            this.cursors.up?.isDown || this.cursors.down?.isDown) {
            this.player.play('player-walk', true);
        } else {
            this.player.play('player-idle', true);
        }

        // Handle click-to-move
        if (this.targetPosition && this.player) {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, 
                this.player.y, 
                this.targetPosition.x, 
                this.targetPosition.y
            );

            // If we're close enough to the target, stop moving
            if (distance < 5) {
                this.player.setVelocity(0);
                this.player.play('player-idle', true);
                this.targetPosition = null;
                if (this.graphics) this.graphics.clear();
            }
        }
    }
    
    private zoomCamera(delta: number): void {
        this.currentZoom = Phaser.Math.Clamp(this.currentZoom + delta, 0.5, 1);
        this.cameras.main.zoomTo(this.currentZoom, 100);
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
