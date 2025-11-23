import * as BABYLON from '@babylonjs/core';
import { Player } from './entities/Player.js';
import { InputManager } from './core/InputManager.js';
import { UIManager } from './ui/UIManager.js';
import { Shop } from './ui/Shop.js';
import { LevelManager } from './level/LevelManager.js';
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
        this.networkManager = null;
        this.isRunning = false;
        this.spawnPosition = null;
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

        // Initialize networking for multiplayer
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
            alert('Could not connect to server. Make sure to run: node server.js');
        }

        // Update UI - no AI enemies, just player count
        this.uiManager.updateEnemyCount(0, 0);

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
        // Update player
        if (this.player) {
            this.player.update(deltaTime);
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

        // Weapon switching (1, 2, 3 keys)
        if (this.inputManager.isKeyPressed('Digit1') && this.player) {
            this.player.switchWeapon('PISTOL');
        }
        if (this.inputManager.isKeyPressed('Digit2') && this.player) {
            this.player.switchWeapon('KNIFE');
        }
        if (this.inputManager.isKeyPressed('Digit3') && this.player) {
            this.player.switchWeapon('SNIPER_RIFLE');
        }

        // Loot pickup (E key)
        if (this.inputManager.isKeyPressed('KeyE') && this.networkManager) {
            console.log('E key pressed - attempting loot pickup');
            this.networkManager.tryPickupLoot();
        }

        // Show loot prompt if near loot
        if (this.networkManager && this.uiManager) {
            const nearbyLoot = this.networkManager.getNearbyLoot();
            this.uiManager.updateLootPrompt(nearbyLoot);
        }
    }

    spawnWave() {
        if (!this.player) return;

        // Restore player ammo
        this.player.currentAmmo = this.player.weaponStats.maxAmmo;
        this.player.reserveAmmo = this.player.weaponStats.reserveAmmo;
        this.player.isReloading = false;

        console.log('Ammo restored!');
    }

    respawnLevel() {
        if (!this.player) return;

        // Hide death screen
        this.uiManager.hideDeathScreen();

        // Respawn player at random location across 500x500 map
        const randomX = Math.random() * 400 - 200;
        const randomZ = Math.random() * 400 - 200;
        this.player.respawn(new BABYLON.Vector3(randomX, 0, randomZ));

        console.log('Respawned!');
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
