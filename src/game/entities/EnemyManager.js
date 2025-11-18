import { Enemy } from './Enemy.js';
import * as BABYLON from '@babylonjs/core';

export class EnemyManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.enemies = [];
        this.shadowGenerator = null;
    }

    setShadowGenerator(shadowGenerator) {
        this.shadowGenerator = shadowGenerator;
    }

    spawnTestEnemies() {
        // Get player position and forward direction
        const playerPos = this.player.mesh.position;
        const playerForward = this.player.camera.getDirection(BABYLON.Vector3.Forward());

        // Spawn enemies in front of the player at various distances and angles
        const spawnConfigs = [
            { distance: 20, angleOffset: 0 },      // Straight ahead
            { distance: 25, angleOffset: 15 },     // Slight right
            { distance: 25, angleOffset: -15 },    // Slight left
            { distance: 30, angleOffset: 20 },     // Far right
            { distance: 30, angleOffset: -20 },    // Far left
            { distance: 35, angleOffset: 0 },      // Very far straight
            { distance: 40, angleOffset: 10 },     // Very far slight right
            { distance: 40, angleOffset: -10 }     // Very far slight left
        ];

        spawnConfigs.forEach(config => {
            // Calculate spawn position relative to player's forward direction
            const angle = (config.angleOffset * Math.PI) / 180; // Convert to radians

            // Rotate forward direction by angle
            const rotatedForward = new BABYLON.Vector3(
                playerForward.x * Math.cos(angle) - playerForward.z * Math.sin(angle),
                0, // Keep at ground level
                playerForward.x * Math.sin(angle) + playerForward.z * Math.cos(angle)
            ).normalize();

            // Calculate spawn position
            const spawnPos = playerPos.add(rotatedForward.scale(config.distance));
            spawnPos.y = 0; // Ensure on ground level

            const enemy = new Enemy(this.scene, spawnPos, this.player);
            this.enemies.push(enemy);

            // Add enemy body parts to shadow generator
            if (this.shadowGenerator && enemy.bodyParts) {
                enemy.bodyParts.forEach(part => {
                    this.shadowGenerator.addShadowCaster(part);
                    part.receiveShadows = true;
                });
            }
        });

        console.log(`Spawned ${this.enemies.length} enemies in front of player`);
    }

    update(deltaTime) {
        // Update all enemies
        this.enemies.forEach(enemy => {
            if (enemy.alive) {
                enemy.update(deltaTime);
            }
        });

        // Remove dead enemies
        this.enemies = this.enemies.filter(enemy => enemy.alive);
    }

    getAliveCount() {
        return this.enemies.filter(e => e.alive).length;
    }

    getTotalCount() {
        return this.enemies.length;
    }

    clearAllEnemies() {
        // Dispose all enemies
        this.enemies.forEach(enemy => {
            if (enemy.bodyParts) {
                enemy.bodyParts.forEach(part => {
                    if (part) part.dispose();
                });
            }
            if (enemy.healthBar) {
                enemy.healthBar.dispose();
            }
            if (enemy.mesh) {
                enemy.mesh.dispose();
            }
        });

        this.enemies = [];
        console.log('All enemies cleared');
    }
}
