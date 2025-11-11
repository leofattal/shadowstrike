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
        // Spawn enemies at various distances for sniper gameplay
        const spawnPositions = [
            new BABYLON.Vector3(25, 1, 15),   // Far right
            new BABYLON.Vector3(-25, 1, 20),  // Far left
            new BABYLON.Vector3(15, 1, 30),   // Far front-right
            new BABYLON.Vector3(-15, 1, 35),  // Far front-left
            new BABYLON.Vector3(30, 1, 25),   // Very far right
            new BABYLON.Vector3(-30, 1, 30),  // Very far left
            new BABYLON.Vector3(0, 1, 40),    // Straight ahead far
            new BABYLON.Vector3(20, 1, 40)    // Diagonal far
        ];

        spawnPositions.forEach(pos => {
            const enemy = new Enemy(this.scene, pos, this.player);
            this.enemies.push(enemy);

            // Add enemy body parts to shadow generator
            if (this.shadowGenerator && enemy.bodyParts) {
                enemy.bodyParts.forEach(part => {
                    this.shadowGenerator.addShadowCaster(part);
                    part.receiveShadows = true;
                });
            }
        });

        console.log(`Spawned ${this.enemies.length} enemies`);
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
