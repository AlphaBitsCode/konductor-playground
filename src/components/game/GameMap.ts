import * as Phaser from 'phaser';

export class GameMap {
    private scene: Phaser.Scene;
    private map: Phaser.Tilemaps.Tilemap | null = null;
    private tileset: Phaser.Tilemaps.Tileset | null = null;
    private groundLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private worldLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private belowPlayerLayer: Phaser.Tilemaps.TilemapLayer | null = null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public preloadAssets(): void {
        // Load the map
        this.scene.load.tilemapTiledJSON('map', 'assets/maps/tuxemon/tuxemon-town.json');
        
        // Load the tileset images
        this.scene.load.image('tileset', 'assets/maps/tuxemon/tuxmon-32px.png');
    }

    public create(): boolean {
        // Create the map
        this.map = this.scene.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('tuxmon-32px', 'tileset');
        
        if (!this.tileset || !this.map) {
            console.error('Failed to load tileset or map');
            return false;
        }
        
        // Create all map layers in the correct order
        // 1. Below Player (ground, paths, etc.)
        this.belowPlayerLayer = this.map.createLayer('Below Player', this.tileset, 0, 0);
        // 2. World layer (main ground layer)
        this.groundLayer = this.map.createLayer('World', this.tileset, 0, 0);
        // 3. Above Player layer (trees, objects, etc.)
        this.worldLayer = this.map.createLayer('Above Player', this.tileset, 0, 0);
        
        if (!this.belowPlayerLayer || !this.groundLayer || !this.worldLayer) {
            console.error('Failed to create map layers. Available layers:', this.map.layers.map(l => l.name));
            return false;
        }
        
        // Set up collision for all layers that should block the player
        // The 'collides' property is set in Tiled for tiles that should block the player
        const collisionLayers = [this.groundLayer, this.worldLayer];
        
        collisionLayers.forEach(layer => {
            if (layer) {
                // Set collision for any tile with collides=true property
                layer.setCollisionByProperty({ collides: true });
                
                // For debugging: visualize collision boxes
                // this.scene.physics.world.createDebugGraphic();
                // layer.renderDebug(this.scene.add.graphics(), {
                //     tileColor: null,
                //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200),
                //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
                // });
            }
        });

        return true;
    }

    public setupPhysicsWorld(): void {
        if (this.map) {
            this.scene.physics.world.bounds.width = this.map.widthInPixels;
            this.scene.physics.world.bounds.height = this.map.heightInPixels;
        }
    }

    public setupCamera(target: Phaser.GameObjects.GameObject): void {
        if (this.map) {
            this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
            this.scene.cameras.main.startFollow(target);
            this.scene.cameras.main.setZoom(1);
        }
    }

    public findSpawnPoint(): { x: number, y: number } {
        let spawnX = 100; // Default spawn position
        let spawnY = 100;
        
        if (this.map) {
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
        }

        return { x: spawnX, y: spawnY };
    }

    public getCollisionLayers(): Phaser.Tilemaps.TilemapLayer[] {
        const layers: Phaser.Tilemaps.TilemapLayer[] = [];
        if (this.groundLayer) layers.push(this.groundLayer);
        if (this.worldLayer) layers.push(this.worldLayer);
        return layers;
    }

    public getMapBounds(): { width: number, height: number } {
        if (this.map) {
            return {
                width: this.map.widthInPixels,
                height: this.map.heightInPixels
            };
        }
        return { width: 800, height: 600 }; // Default size
    }

    public getMap(): Phaser.Tilemaps.Tilemap | null {
        return this.map;
    }

    public destroy(): void {
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
    }
}