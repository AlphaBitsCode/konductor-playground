import * as Phaser from 'phaser';

export class GameUI {
    private scene: Phaser.Scene;
    private graphics: Phaser.GameObjects.Graphics | null = null;
    private zoomButtons: { zoomIn: Phaser.GameObjects.Text; zoomOut: Phaser.GameObjects.Text } | null = null;
    private currentZoom: number = 1;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public create(): void {
        // Create graphics for visual feedback
        this.graphics = this.scene.add.graphics();
        
        // Add zoom buttons
        this.createZoomButtons();
    }

    private createZoomButtons(): void {
        const style = { 
            font: '20px Arial', 
            fill: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 10, y: 5 }
        };
        
        const zoomInButton = this.scene.add.text(20, 20, '+', style)
            .setInteractive()
            .on('pointerdown', () => this.zoomCamera(0.1));
            
        const zoomOutButton = this.scene.add.text(20, 60, '-', style)
            .setInteractive()
            .on('pointerdown', () => this.zoomCamera(-0.1));
            
        this.zoomButtons = { zoomIn: zoomInButton, zoomOut: zoomOutButton };
        
        // Make buttons stay in fixed position on screen
        this.scene.cameras.main.ignore([zoomInButton, zoomOutButton]);
    }

    public setupClickToMove(onClickCallback: (x: number, y: number) => void): void {
        // Set up click-to-move
        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
                const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
                
                // Debug log click position
                console.log(`Clicked at world position: x=${Math.round(worldPoint.x)}, y=${Math.round(worldPoint.y)}`);
                
                // Draw a temporary marker at the target position
                this.drawTargetMarker(worldPoint.x, worldPoint.y);
                
                // Call the callback with the world position
                onClickCallback(worldPoint.x, worldPoint.y);
            }
        });
    }

    public drawTargetMarker(x: number, y: number): void {
        if (this.graphics) {
            this.graphics.clear();
            this.graphics.fillStyle(0x00ff00, 0.5);
            this.graphics.fillCircle(x, y, 10);
            this.scene.time.delayedCall(300, () => {
                if (this.graphics) this.graphics.clear();
            });
        }
    }

    public clearGraphics(): void {
        if (this.graphics) {
            this.graphics.clear();
        }
    }

    private zoomCamera(delta: number): void {
        this.currentZoom = Phaser.Math.Clamp(this.currentZoom + delta, 0.5, 1);
        this.scene.cameras.main.zoomTo(this.currentZoom, 100);
    }

    public getCurrentZoom(): number {
        return this.currentZoom;
    }

    public setZoom(zoom: number): void {
        this.currentZoom = Phaser.Math.Clamp(zoom, 0.5, 1);
        this.scene.cameras.main.setZoom(this.currentZoom);
    }

    public destroy(): void {
        if (this.graphics) {
            this.graphics.destroy();
            this.graphics = null;
        }
        if (this.zoomButtons) {
            this.zoomButtons.zoomIn.destroy();
            this.zoomButtons.zoomOut.destroy();
            this.zoomButtons = null;
        }
    }
}