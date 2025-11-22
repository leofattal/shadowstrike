import * as BABYLON from '@babylonjs/core';
import { Player } from './entities/Player.js';
import { InputManager } from './core/InputManager.js';
import { UIManager } from './ui/UIManager.js';
import { Shop } from './ui/Shop.js';
import { LevelManager } from './level/LevelManager.js';
import { EnemyManager } from './entities/EnemyManager.js';
import { NetworkManager } from './network/NetworkManager.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.engine = null;
        this.scene = null;
        this.player = null;
        this.inputManager = null;
        this.uiManager = null;
        this.shop = null;
        this.levelManager = null;
        this.enemyManager = null;
        this.networkManager = null;
        this.isRunning = false;
        this.spawnPosition = null;
        this.isPvP = false; // PvP mode flag
    }

    async start() {
        // Create Babylon engine
        this.engine = new BABYLON.Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: true
        });

        // Create scene
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        this.scene.collisionsEnabled = true;

        // Clear background properly
        this.scene.clearColor = new BABYLON.Color4(0.1, 0.15, 0.2, 1.0);

        // Initialize managers
        this.inputManager = new InputManager(this.scene, this.canvas);
        this.uiManager = new UIManager();

        // Create the level
        this.levelManager = new LevelManager(this.scene);
        await this.levelManager.createTestLevel();

        // Create player
        this.player = new Player(this.scene, this.inputManager);

        // Set up player callbacks
        this.player.onEnemyKilled = (wasHeadshot) => {
            // Coins are now handled in registerKill with multiplier
        };

        this.player.onPlayerDeath = (coins, enemiesKilled) => {
            this.uiManager.showDeathScreen(coins, enemiesKilled);
        };

        this.player.onEnemyHit = (wasHeadshot) => {
            this.uiManager.showHitMarker(wasHeadshot);
        };

        // Create shop
        this.shop = new Shop(this.player);

        // Spawn player on top of sniper tower
        this.spawnPosition = this.levelManager.towerSpawnPosition || new BABYLON.Vector3(0, 2, 0);
        this.player.spawn(this.spawnPosition);

        // Check URL for PvP mode
        const urlParams = new URLSearchParams(window.location.search);
        this.isPvP = urlParams.get('mode') === 'pvp';

        if (this.isPvP) {
            // Initialize networking for PvP mode
            this.networkManager = new NetworkManager(this.scene, this.player);
            this.player.networkManager = this.networkManager;

            try {
                await this.networkManager.connect();
                console.log('Connected to PvP server');

                // Set up network callbacks
                this.networkManager.onKillCallback = (victimName, isHeadshot) => {
                    this.player.registerKill(isHeadshot);
                    console.log(`Killed ${victimName}${isHeadshot ? ' (HEADSHOT!)' : ''}`);
                };

                this.networkManager.onDeathCallback = (killerName) => {
                    this.uiManager.showDeathScreen(this.player.coins, this.player.totalKills, `Killed by ${killerName}`);
                };
            } catch (error) {
                console.error('Failed to connect to PvP server:', error);
                // Fall back to PvE mode
                this.isPvP = false;
            }
        }

        // Create enemy manager (for PvE or as bots in PvP)
        this.enemyManager = new EnemyManager(this.scene, this.player);

        // Pass shadow generator to enemy manager
        if (this.levelManager.shadowGenerator) {
            this.enemyManager.setShadowGenerator(this.levelManager.shadowGenerator);
        }

        // Only spawn AI enemies in PvE mode
        if (!this.isPvP) {
            this.enemyManager.spawnTestEnemies();
        }

        // Update UI with enemy count
        this.uiManager.updateEnemyCount(this.enemyManager.getAliveCount(), this.enemyManager.getTotalCount());

        // Lock pointer on click
        this.canvas.addEventListener('click', async () => {
            if (!document.pointerLockElement) {
                await this.canvas.requestPointerLock();
            }
        });

        // Spawn Wave button
        this.uiManager.spawnWaveBtn.addEventListener('click', () => {
            this.spawnWave();
        });

        // Respawn button
        this.uiManager.respawnBtn.addEventListener('click', () => {
            this.respawnLevel();
        });

        // Start render loop
        this.engine.runRenderLoop(() => {
            if (this.isRunning) {
                const deltaTime = this.engine.getDeltaTime() / 1000;
                this.update(deltaTime);
                this.scene.render();
            }
        });

        this.isRunning = true;
        return Promise.resolve();
    }

    update(deltaTime) {
        // Apply time scale for slow-motion effects
        let scaledDelta = deltaTime;
        if (this.player && this.player.timeScale !== 1.0) {
            scaledDelta = deltaTime * this.player.timeScale;
        }

        // Update player
        if (this.player) {
            this.player.update(deltaTime); // Player uses real time
        }

        // Update enemies with scaled time
        if (this.enemyManager) {
            this.enemyManager.update(scaledDelta);
        }

        // Update UI
        if (this.player && this.uiManager) {
            this.uiManager.updateHealth(this.player.health, this.player.maxHealth);
            this.uiManager.updateAmmo(this.player.currentAmmo, this.player.reserveAmmo);
            this.uiManager.updateScopeVisibility(this.player.isZooming);
            this.uiManager.updateScopeType(this.player.weaponStats.scopeType);
            this.uiManager.updateCoins(this.player.coins);
            this.uiManager.updateWeaponInfo(this.player.weaponStats.name,
                this.player.weaponStats.hasExplosiveAmmo ? 'EXPLOSIVE' : 'STANDARD');
            this.uiManager.updateComboDisplay(this.player.comboKills, this.player.comboMultiplier, this.player.killstreak);
        }

        if (this.enemyManager && this.uiManager) {
            this.uiManager.updateEnemyCount(this.enemyManager.getAliveCount(), this.enemyManager.getTotalCount());
        }

        // Check for player shooting
        if (this.inputManager.isMouseButtonDown(0) && this.player) {
            // If zooming, queue the shot for when zoom is released
            if (this.player.isZooming) {
                this.player.shotQueued = true;
            } else {
                // Normal shooting (not zoomed)
                this.player.shoot();
            }
        }

        // Check for reload
        if (this.inputManager.isKeyPressed('KeyR') && this.player) {
            this.player.reload();
        }

        // Check for shop toggle (B key)
        if (this.inputManager.isKeyPressed('KeyB') && this.shop) {
            this.shop.toggle();
        }

        // Check for spawn wave (G key)
        if (this.inputManager.isKeyPressed('KeyG')) {
            this.spawnWave();
        }
    }

    spawnWave() {
        if (!this.enemyManager || !this.player) return;

        // Restore player ammo
        this.player.currentAmmo = this.player.weaponStats.maxAmmo;
        this.player.reserveAmmo = this.player.weaponStats.reserveAmmo;
        this.player.isReloading = false;

        // Spawn 8 new enemies
        this.enemyManager.spawnTestEnemies();
        this.uiManager.updateEnemyCount(this.enemyManager.getAliveCount(), this.enemyManager.getTotalCount());

        console.log('Spawned new wave of enemies! Ammo restored.');
    }

    respawnLevel() {
        if (!this.player || !this.enemyManager) return;

        // Hide death screen
        this.uiManager.hideDeathScreen();

        // Respawn player
        this.player.respawn(this.spawnPosition);

        // Clear all enemies
        this.enemyManager.clearAllEnemies();

        // Spawn fresh wave
        this.enemyManager.spawnTestEnemies();
        this.uiManager.updateEnemyCount(this.enemyManager.getAliveCount(), this.enemyManager.getTotalCount());

        console.log('Level respawned!');
    }

    resize() {
        if (this.engine) {
            this.engine.resize();
        }
    }

    dispose() {
        this.isRunning = false;
        if (this.scene) {
            this.scene.dispose();
        }
        if (this.engine) {
            this.engine.dispose();
        }
    }
}
