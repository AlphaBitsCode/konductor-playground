import * as Phaser from 'phaser';
import { Player } from './Player';
import { Minion } from './Minion';
import { GameMap } from './GameMap';
import { GameUI } from './GameUI';

export class GameManager {
    private scene: Phaser.Scene;
    private player: Player | null = null;
    private minions: Minion[] = [];
    private gameMap: GameMap;
    private gameUI: GameUI;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.gameMap = new GameMap(scene);
        this.gameUI = new GameUI(scene);
    }

    public preloadAssets(): void {
        // Load map assets
        this.gameMap.preloadAssets();
        
        // Load player character sprites
        this.scene.load.spritesheet(
            'player-idle',
            '/assets/characters/base-boy/Unarmed_Idle_with_shadow.png',
            { frameWidth: 64, frameHeight: 64 }
        );
        
        this.scene.load.spritesheet(
            'player-walk',
            '/assets/characters/base-boy/Unarmed_Run_with_shadow.png',
            { frameWidth: 64, frameHeight: 64 }
        );

        this.scene.load.spritesheet(
            'player-hurt',
            '/assets/characters/base-boy/Unarmed_Hurt_with_shadow.png',
            { frameWidth: 64, frameHeight: 64 }
        );

        // Load slime spritesheets
        for (let i = 1; i <= 3; i++) {
            this.scene.load.spritesheet(
                `slime${i}-idle`,
                `/assets/characters/slime/Slime${i}_Idle_full.png`,
                { frameWidth: 64, frameHeight: 64 }
            );
            this.scene.load.spritesheet(
                `slime${i}-walk`,
                `/assets/characters/slime/Slime${i}_Walk_full.png`,
                { frameWidth: 64, frameHeight: 64 }
            );
            this.scene.load.spritesheet(
                `slime${i}-hurt`,
                `/assets/characters/slime/Slime${i}_Hurt_full.png`,
                { frameWidth: 64, frameHeight: 64 }
            );
        }
    }

    public create(): boolean {
        // Create the map first
        if (!this.gameMap.create()) {
            return false;
        }

        // Setup physics world
        this.gameMap.setupPhysicsWorld();

        // Find spawn point and create player
        const spawnPoint = this.gameMap.findSpawnPoint();
        this.player = new Player(this.scene, spawnPoint.x, spawnPoint.y);

        // Setup player collisions with map
        this.player.setupCollisions(this.gameMap.getCollisionLayers());

        // Setup camera to follow player
        this.gameMap.setupCamera(this.player.getSprite());

        // Create UI
        this.gameUI.create();

        // Setup click-to-move functionality
        this.gameUI.setupClickToMove((x: number, y: number) => {
            if (this.player) {
                this.player.setTargetPosition(x, y);
            }
        });

        // Spawn initial minions
        this.spawnRandomMinions(15);

        return true;
    }

    public update(): void {
        if (this.player) {
            this.player.update();
        }
    }

    private spawnRandomMinion(): void {
        const mapBounds = this.gameMap.getMapBounds();
        
        // Get random position within map bounds
        const x = Phaser.Math.Between(100, mapBounds.width - 100);
        const y = Phaser.Math.Between(100, mapBounds.height - 100);
        
        // Random slime type (1-3)
        const slimeType = Phaser.Math.Between(1, 3);
        
        // Create the minion
        const minion = new Minion(this.scene, x, y, slimeType);
        
        // Setup collisions
        if (this.player) {
            minion.setupCollisions(
                this.gameMap.getCollisionLayers(),
                this.player.getSprite(),
                this.minions
            );
        }
        
        // Add to minions array
        this.minions.push(minion);
    }
    
    private spawnRandomMinions(count: number): void {
        for (let i = 0; i < count; i++) {
            this.scene.time.delayedCall(i * 500, () => this.spawnRandomMinion());
        }
    }

    public getPlayer(): Player | null {
        return this.player;
    }

    public getMinions(): Minion[] {
        return this.minions;
    }

    public getGameMap(): GameMap {
        return this.gameMap;
    }

    public getGameUI(): GameUI {
        return this.gameUI;
    }

    public destroy(): void {
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }
        
        this.minions.forEach(minion => minion.destroy());
        this.minions = [];
        
        this.gameMap.destroy();
        this.gameUI.destroy();
    }
}