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
    private minions: Phaser.GameObjects.Sprite[] = [];
    private selectedSlimeType: number = 1; // 1, 2, or 3
    private spawnButton: Phaser.GameObjects.Text | null = null;

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
        }
    }

    create() {
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
        this.player = this.physics.add.sprite(spawnX, spawnY, 'player-front');
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
        
        // Create UI for slime selection and spawning
        this.createSlimeUI();
        
        // Spawn initial slime
        this.spawnSlime();
    }

    createSlimeUI() {
        console.log('Creating slime UI...');
        
        // Create a fixed container for the UI
        const uiContainer = this.add.container(0, 0).setScrollFactor(0);
        
        // Title with more contrast
        const title = this.add.text(20, 20, 'SLIME TYPE:', { 
            fontSize: '18px', 
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 15, y: 10 },
            fontStyle: 'bold'
        }).setScrollFactor(0);
        uiContainer.add(title);
        
        // Slime type buttons
        const buttonSpacing = 45;
        const startY = 200; // Space below title
        
        for (let i = 1; i <= 3; i++) {
            const buttonY = startY + ((i - 1) * buttonSpacing);
            
            // Create button background
            const buttonBg = this.add.rectangle(200, buttonY, 130, 40, 0x333333)
                .setStrokeStyle(2, 0xffffff)
                .setScrollFactor(0);
                
            // Create button text
            const buttonText = this.add.text(200, buttonY, `Spawn Slime ${i}`, {
                fontSize: '14px',
                color: '#ffffff',
                fontStyle: 'bold'
            })
            .setOrigin(0.5)
            .setScrollFactor(0);
            
            // Add both to container
            uiContainer.add([buttonBg, buttonText]);
            
            // Set up interactivity
            const button = this.add.zone(200, buttonY, 130, 40)
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setInteractive()
                .on('pointerover', () => {
                    buttonBg.setFillStyle(0x444444);
                    buttonText.setColor('#00ff00');
                })
                .on('pointerout', () => {
                    buttonBg.setFillStyle(this.selectedSlimeType === i ? 0x006600 : 0x333333);
                    buttonText.setColor(this.selectedSlimeType === i ? '#00ff00' : '#ffffff');
                })
                .on('pointerdown', () => {
                    console.log(`Selected slime type: ${i}`);
                    this.selectedSlimeType = i;
                    this.updateSlimeButtons();
                    this.spawnSlime();
                    buttonBg.setFillStyle(0x004400);
                })
                .on('pointerup', () => {
                    buttonBg.setFillStyle(0x006600);
                });
            
            uiContainer.add(button);
            
            // Update initial state
            if (this.selectedSlimeType === i) {
                buttonBg.setFillStyle(0x006600);
                buttonText.setColor('#00ff00');
            }
        }
        
        // Make the UI draggable
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        
        title.setInteractive()
            .on('pointerdown', (pointer: Phaser.Input.Pointer) => {
                isDragging = true;
                dragStartX = pointer.x - uiContainer.x;
                dragStartY = pointer.y - uiContainer.y;
            });
            
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (isDragging) {
                uiContainer.x = pointer.x - dragStartX;
                uiContainer.y = pointer.y - dragStartY;
            }
        });
        
        this.input.on('pointerup', () => {
            isDragging = false;
        });
        
        console.log('Slime UI created with fixed positioning');
    }
    
    updateSlimeButtons() {
        console.log('Updating slime buttons...');
        let updated = false;
        
        // Find all button containers and update their states
        this.children.each((child: Phaser.GameObjects.GameObject) => {
            if (child instanceof Phaser.GameObjects.Container) {
                child.each((buttonPart: Phaser.GameObjects.GameObject) => {
                    if (buttonPart instanceof Phaser.GameObjects.Text && buttonPart.text.startsWith('Spawn Slime ')) {
                        const slimeNum = parseInt(buttonPart.text.split(' ')[2]);
                        const isSelected = slimeNum === this.selectedSlimeType;
                        
                        // Find the corresponding background (previous child in container)
                        const bg = child.getAt(child.getIndex(buttonPart) - 1) as Phaser.GameObjects.Rectangle;
                        
                        if (bg) {
                            bg.setFillStyle(isSelected ? 0x006600 : 0x333333);
                            buttonPart.setColor(isSelected ? '#00ff00' : '#ffffff');
                            updated = true;
                        }
                    }
                });
            }
        });
        
        if (!updated) {
            console.warn('No slime buttons found to update');
        }
    }

    spawnSlime() {
        if (!this.player || !this.groundLayer || !this.worldLayer) return;
        
        // Calculate position next to the player
        const offsetX = 50;
        const offsetY = 0;
        const x = this.player.x + offsetX;
        const y = this.player.y + offsetY;
        
        try {
            // Create the slime with physics
            const slime = this.physics.add.sprite(x, y, `slime${this.selectedSlimeType}-idle`);
            if (!slime) {
                console.error('Failed to create slime sprite');
                return;
            }
            
            // Set up collision with the map layers
            this.physics.add.collider(slime, this.groundLayer);
            this.physics.add.collider(slime, this.worldLayer);
            
            // Set up collision with the player
            if (this.player.body) {
                this.physics.add.collider(slime, this.player);
            }
            
            // Set up collision with other slimes
            this.minions.forEach(minion => {
                this.physics.add.collider(slime, minion);
            });
            
            // Configure physics properties
            slime.play(`slime${this.selectedSlimeType}-idle`);
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
                        slime.play(`slime${this.selectedSlimeType}-walk`, true);
                        
                        // Stop after a short distance
                        this.time.delayedCall(1000, () => {
                            if (slime.active) {
                                slime.setVelocity(0, 0);
                                slime.play(`slime${this.selectedSlimeType}-idle`, true);
                            }
                        });
                    }
                },
                loop: true
            });
            
            // Add to minions array
            this.minions.push(slime);
            console.log(`Spawned slime ${this.selectedSlimeType} at ${x}, ${y}`);
            
        } catch (error) {
            console.error('Error spawning slime:', error);
        }
    }

    update() {
        if (!this.player) return;
        
        const player = this.player;
        
        // Handle click-to-move
        if (this.targetPosition) {
            const distance = Phaser.Math.Distance.Between(
                player.x, 
                player.y, 
                this.targetPosition.x, 
                this.targetPosition.y
            );
            
            if (distance > 5) {
                // Move towards target
                const angle = Phaser.Math.Angle.Between(
                    player.x, 
                    player.y, 
                    this.targetPosition.x, 
                    this.targetPosition.y
                );
                
                player.setVelocity(
                    Math.cos(angle) * this.playerSpeed,
                    Math.sin(angle) * this.playerSpeed
                );
                
                // Update player texture based on direction
                const angleDeg = Phaser.Math.RadToDeg(angle);
                if (angleDeg > -45 && angleDeg <= 45) {
                    player.setTexture('player-right');
                } else if (angleDeg > 45 && angleDeg <= 135) {
                    player.setTexture('player-front');
                } else if (angleDeg > 135 || angleDeg <= -135) {
                    player.setTexture('player-left');
                } else {
                    player.setTexture('player-back');
                }
            } else {
                // Reached the target
                player.setVelocity(0);
                this.targetPosition = null;
            }
        } 
        // Handle keyboard input if no target position
        else if (this.cursors) {
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
