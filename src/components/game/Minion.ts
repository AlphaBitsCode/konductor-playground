import * as Phaser from 'phaser';

export class Minion {
    private scene: Phaser.Scene;
    private sprite: Phaser.Physics.Arcade.Sprite;
    private slimeType: number;
    private movementTimer: Phaser.Time.TimerEvent | null = null;

    constructor(scene: Phaser.Scene, x: number, y: number, slimeType: number) {
        this.scene = scene;
        this.slimeType = slimeType;
        this.sprite = scene.physics.add.sprite(x, y, `slime${slimeType}-idle`);
        this.setupMinion();
        this.createAnimations();
        this.startAI();
    }

    private createAnimations(): void {
        // Only create animations if they don't already exist
        const animKey = `slime${this.slimeType}-idle`;
        if (!this.scene.anims.exists(animKey)) {
            // Idle animation
            this.scene.anims.create({
                key: `slime${this.slimeType}-idle`,
                frames: this.scene.anims.generateFrameNumbers(`slime${this.slimeType}-idle`, { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });

            // Walk animation
            this.scene.anims.create({
                key: `slime${this.slimeType}-walk`,
                frames: this.scene.anims.generateFrameNumbers(`slime${this.slimeType}-walk`, { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });

            // Hurt animation
            this.scene.anims.create({
                key: `slime${this.slimeType}-hurt`,
                frames: this.scene.anims.generateFrameNumbers(`slime${this.slimeType}-hurt`, { start: 0, end: 3 }),
                frameRate: 10,
                repeat: 0
            });
        }
    }

    private setupMinion(): void {
        // Set up slime physics body with 32px radius
        this.sprite.setCircle(32);
        
        // Store reference to the slime type on the sprite for collision handling
        this.sprite.setData('type', 'slime');
        this.sprite.setData('slimeType', this.slimeType);
        
        // Configure physics properties
        this.sprite.play(`slime${this.slimeType}-idle`);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setImmovable(false);
        this.sprite.setBounce(0.2);
    }

    public setupCollisions(layers: Phaser.Tilemaps.TilemapLayer[], player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, otherMinions: Minion[]): void {
        // Set up collision with the map layers
        layers.forEach(layer => {
            if (layer) {
                this.scene.physics.add.collider(this.sprite, layer);
            }
        });
        
        // Set up collision with the player
        if (player.body) {
            this.scene.physics.add.collider(this.sprite, player, this.handlePlayerCollision.bind(this));
        }
        
        // Set up collision with other minions
        otherMinions.forEach(minion => {
            if (minion !== this) {
                this.scene.physics.add.collider(this.sprite, minion.getSprite(), this.handleMinionCollision.bind(this));
            }
        });
    }

    private startAI(): void {
        // Add simple AI movement (wander around randomly)
        this.movementTimer = this.scene.time.addEvent({
            delay: 2000,
            callback: () => {
                if (this.sprite.active && this.sprite.body) {
                    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
                    const speed = Phaser.Math.FloatBetween(20, 50);
                    this.sprite.setVelocity(
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed
                    );
                    this.sprite.play(`slime${this.slimeType}-walk`, true);
                    
                    // Stop after a short time
                    this.scene.time.delayedCall(1000, () => {
                        if (this.sprite.active) {
                            this.sprite.setVelocity(0, 0);
                            this.sprite.play(`slime${this.slimeType}-idle`, true);
                        }
                    });
                }
            },
            loop: true
        });
    }

    private handlePlayerCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (obj1, obj2) => {
        const slime = obj1 as Phaser.Physics.Arcade.Sprite;
        const player = obj2 as Phaser.Physics.Arcade.Sprite;
        
        // Play hurt animations
        player.play('player-hurt');
        slime.play(`slime${slime.getData('slimeType')}-hurt`);
        
        // Return to idle after hurt animation
        this.scene.time.delayedCall(500, () => {
            if (player.active) player.play('player-idle');
            if (slime.active) slime.play(`slime${slime.getData('slimeType')}-idle`);
        });
    }

    private handleMinionCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (obj1, obj2) => {
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
        this.scene.time.delayedCall(500, () => {
            if (s1.active) s1.play(`slime${s1.getData('slimeType')}-idle`);
            if (s2.active) s2.play(`slime${s2.getData('slimeType')}-idle`);
        });
    }

    public getSprite(): Phaser.Physics.Arcade.Sprite {
        return this.sprite;
    }

    public getType(): number {
        return this.slimeType;
    }

    public destroy(): void {
        if (this.movementTimer) {
            this.movementTimer.destroy();
            this.movementTimer = null;
        }
        if (this.sprite) {
            this.sprite.destroy();
        }
    }
}