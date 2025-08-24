import * as Phaser from 'phaser';

export class Player {
    private scene: Phaser.Scene;
    private sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    private speed: number = 175;
    private targetPosition: { x: number, y: number } | null = null;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'player-idle');
        this.setupPlayer();
        this.createAnimations();
    }

    private createAnimations(): void {
        // Create animations for base-boy character
        this.scene.anims.create({
            key: 'player-idle',
            frames: this.scene.anims.generateFrameNumbers('player-idle', { start: 0, end: 5 }),
            frameRate: 6.67,
            repeat: -1
        });
        
        this.scene.anims.create({
            key: 'player-walk',
            frames: this.scene.anims.generateFrameNumbers('player-walk', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        // Player hurt animation
        this.scene.anims.create({
            key: 'player-hurt',
            frames: this.scene.anims.generateFrameNumbers('player-hurt', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
    }

    private setupPlayer(): void {
        // Set up player physics body with 32px radius
        this.sprite.setCircle(32);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.play('player-idle');

        // Set up keyboard input
        if (this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
        }
    }

    public setupCollisions(layers: Phaser.Tilemaps.TilemapLayer[]): void {
        layers.forEach(layer => {
            if (layer) {
                this.scene.physics.add.collider(this.sprite, layer);
            }
        });
    }

    public setTargetPosition(x: number, y: number): void {
        this.targetPosition = { x, y };
    }

    public clearTargetPosition(): void {
        this.targetPosition = null;
    }

    public update(): void {
        if (!this.cursors) return;

        // Stop any previous movement from the last frame
        this.sprite.setVelocity(0);

        // Check if any keyboard input is active
        const keyboardActive = this.cursors.left?.isDown || this.cursors.right?.isDown || 
                              this.cursors.up?.isDown || this.cursors.down?.isDown;

        // Handle keyboard input (takes priority over click-to-move)
        if (keyboardActive) {
            // Clear target position when using keyboard
            this.targetPosition = null;

            if (this.cursors.left?.isDown) {
                this.sprite.setVelocityX(-this.speed);
                this.sprite.setFlipX(true);
            } else if (this.cursors.right?.isDown) {
                this.sprite.setVelocityX(this.speed);
                this.sprite.setFlipX(false);
            }

            if (this.cursors.up?.isDown) {
                this.sprite.setVelocityY(-this.speed);
            } else if (this.cursors.down?.isDown) {
                this.sprite.setVelocityY(this.speed);
            }

            // Normalize and scale the velocity so that player can't move faster along a diagonal
            this.sprite.body.velocity.normalize().scale(this.speed);
            this.sprite.play('player-walk', true);
        }
        // Handle click-to-move (only when no keyboard input)
        else if (this.targetPosition) {
            const distance = Phaser.Math.Distance.Between(
                this.sprite.x, 
                this.sprite.y, 
                this.targetPosition.x, 
                this.targetPosition.y
            );

            // If we're close enough to the target, stop moving
            if (distance < 5) {
                this.sprite.setVelocity(0);
                this.sprite.play('player-idle', true);
                this.targetPosition = null;
            } else {
                // Calculate direction to target
                const angle = Phaser.Math.Angle.Between(
                    this.sprite.x, 
                    this.sprite.y, 
                    this.targetPosition.x, 
                    this.targetPosition.y
                );
                
                // Set velocity towards target
                const velocityX = Math.cos(angle) * this.speed;
                const velocityY = Math.sin(angle) * this.speed;
                
                this.sprite.setVelocity(velocityX, velocityY);
                
                // Set sprite direction based on movement
                this.sprite.setFlipX(velocityX < 0);
                
                // Play walk animation
                this.sprite.play('player-walk', true);
            }
        }
        // No input - play idle animation
        else {
            this.sprite.play('player-idle', true);
        }
    }

    public playHurtAnimation(): void {
        this.sprite.play('player-hurt');
        
        // Return to idle after hurt animation
        this.scene.time.delayedCall(500, () => {
            if (this.sprite.active) {
                this.sprite.play('player-idle');
            }
        });
    }

    public getSprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        return this.sprite;
    }

    public getPosition(): { x: number, y: number } {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    public destroy(): void {
        if (this.sprite) {
            this.sprite.destroy();
        }
    }
}