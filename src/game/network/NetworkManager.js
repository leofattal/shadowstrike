import { io } from 'socket.io-client';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

export class NetworkManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.socket = null;
        this.playerId = null;
        this.remotePlayers = new Map();
        this.isConnected = false;
        this.updateInterval = null;
        this.onKillCallback = null;
        this.onDeathCallback = null;
        this.lootDrops = new Map();
        this.onLootPickupCallback = null;
    }

    connect(serverUrl = window.location.origin) {
        return new Promise((resolve, reject) => {
            console.log('Connecting to server:', serverUrl);

            this.socket = io(serverUrl, {
                transports: ['websocket', 'polling']
            });

            this.socket.on('connect', () => {
                console.log('Connected to server');
                this.isConnected = true;
            });

            this.socket.on('playerInit', (data) => {
                console.log('Player initialized:', data);
                this.playerId = data.id;

                // Set player spawn position
                this.player.mesh.position = new BABYLON.Vector3(
                    data.position.x,
                    data.position.y,
                    data.position.z
                );
                this.player.camera.position.y = 1.6;

                // Spawn existing players
                data.players.forEach(playerData => {
                    if (playerData.id !== this.playerId) {
                        this.spawnRemotePlayer(playerData);
                    }
                });

                // Spawn existing loot drops
                if (data.lootDrops) {
                    data.lootDrops.forEach(loot => {
                        this.spawnLootDrop(loot);
                    });
                }

                // Start sending position updates
                this.startPositionUpdates();

                resolve(data);
            });

            this.socket.on('playerJoined', (playerData) => {
                console.log('Player joined:', playerData.username);
                this.spawnRemotePlayer(playerData);
                this.showNotification(`${playerData.username} joined the game`);
            });

            this.socket.on('playerLeft', (playerId) => {
                console.log('Player left:', playerId);
                this.removeRemotePlayer(playerId);
            });

            this.socket.on('playerMoved', (data) => {
                this.updateRemotePlayer(data);
            });

            this.socket.on('bulletFired', (data) => {
                if (data.shooterId !== this.playerId) {
                    this.showRemoteBullet(data);
                }
            });

            this.socket.on('damaged', (data) => {
                console.log('You were hit for', data.damage, 'damage!');
                this.player.health = data.health;
                this.player.updateHealthUI();

                // Flash red screen
                this.showDamageFlash();
            });

            this.socket.on('playerKilled', (data) => {
                this.showKillFeed(data);

                if (data.victimId === this.playerId) {
                    // You died
                    if (this.onDeathCallback) {
                        this.onDeathCallback(data.killerName);
                    }
                } else if (data.killerId === this.playerId) {
                    // You got a kill
                    if (this.onKillCallback) {
                        this.onKillCallback(data.victimName, data.isHeadshot);
                    }
                }
            });

            this.socket.on('respawn', (data) => {
                console.log('Respawning at:', data.position);

                // Hide death screen and clear countdown
                if (this.onRespawnCallback) {
                    this.onRespawnCallback();
                }

                // Respawn player at new position
                this.player.respawn(new BABYLON.Vector3(
                    data.position.x,
                    data.position.y,
                    data.position.z
                ));

                // Update weapons back to starting loadout
                this.player.ownedWeapons = data.weapons;
                this.player.switchWeapon('PISTOL'); // Switch to pistol on respawn

                // Keep coins! Server preserves them
                this.player.coins = data.coins;
            });

            this.socket.on('playerRespawned', (data) => {
                const remotePlayer = this.remotePlayers.get(data.id);
                if (remotePlayer) {
                    remotePlayer.mesh.position = new BABYLON.Vector3(
                        data.position.x,
                        data.position.y,
                        data.position.z
                    );
                    remotePlayer.mesh.setEnabled(true);
                }
            });

            // Loot drop events
            this.socket.on('lootDropped', (loot) => {
                console.log('Loot dropped:', loot);
                this.spawnLootDrop(loot);
            });

            this.socket.on('lootRemoved', (lootId) => {
                this.removeLootDrop(lootId);
            });

            this.socket.on('lootExpired', (lootId) => {
                this.removeLootDrop(lootId);
            });

            this.socket.on('lootPickedUp', (data) => {
                console.log('Picked up loot:', data);
                // Update player inventory
                this.player.ownedWeapons = data.newInventory;
                this.player.coins = data.totalCoins;

                // Show notification
                let message = '';
                if (data.weapons.length > 0) {
                    message += `+${data.weapons.join(', ')}`;
                }
                if (data.coins > 0) {
                    message += (message ? ' & ' : '') + `+${data.coins} coins`;
                }
                if (message) {
                    this.showNotification(`Picked up: ${message}`);
                }

                if (this.onLootPickupCallback) {
                    this.onLootPickupCallback(data);
                }
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from server');
                this.isConnected = false;
            });

            this.socket.on('connect_error', (error) => {
                console.error('Connection error:', error);
                reject(error);
            });

            // Timeout for connection
            setTimeout(() => {
                if (!this.isConnected) {
                    reject(new Error('Connection timeout'));
                }
            }, 10000);
        });
    }

    startPositionUpdates() {
        // Send position updates 20 times per second
        this.updateInterval = setInterval(() => {
            if (this.isConnected && this.player) {
                this.socket.emit('playerUpdate', {
                    position: {
                        x: this.player.mesh.position.x,
                        y: this.player.mesh.position.y,
                        z: this.player.mesh.position.z
                    },
                    rotation: {
                        x: this.player.camera.rotation.x,
                        y: this.player.camera.rotation.y,
                        z: this.player.camera.rotation.z
                    },
                    isCrouching: this.player.isCrouching
                });
            }
        }, 50);
    }

    async spawnRemotePlayer(playerData) {
        // Create remote player container
        const mesh = new BABYLON.TransformNode('remotePlayer_' + playerData.id, this.scene);
        mesh.position = new BABYLON.Vector3(
            playerData.position.x,
            playerData.position.y,
            playerData.position.z
        );

        // Store player data immediately so we can update position while model loads
        const remotePlayerData = {
            mesh: mesh,
            parts: [],
            data: playerData,
            modelLoaded: false
        };
        this.remotePlayers.set(playerData.id, remotePlayerData);

        // Use simple capsule for player body (model rotation issues - will fix later)
        const body = BABYLON.MeshBuilder.CreateCapsule('playerBody_' + playerData.id, {
            radius: 0.3,
            height: 1.8
        }, this.scene);
        body.position.y = 0.9;
        body.parent = mesh;

        const bodyMat = new BABYLON.StandardMaterial('bodyMat_' + playerData.id, this.scene);
        bodyMat.diffuseColor = new BABYLON.Color3(
            playerData.color.r,
            playerData.color.g,
            playerData.color.b
        );
        body.material = bodyMat;

        body.isRemotePlayer = true;
        body.remotePlayerId = playerData.id;
        body.isHeadshot = false;

        // Create headshot hitbox
        const headHitbox = BABYLON.MeshBuilder.CreateSphere('headHitbox_' + playerData.id, {
            diameter: 0.4
        }, this.scene);
        headHitbox.position.y = 1.7;
        headHitbox.parent = mesh;
        headHitbox.isVisible = false;
        headHitbox.isRemotePlayer = true;
        headHitbox.remotePlayerId = playerData.id;
        headHitbox.isHeadshot = true;

        remotePlayerData.parts = [body, headHitbox];
        remotePlayerData.modelLoaded = true;

        // Username label
        const plane = BABYLON.MeshBuilder.CreatePlane('nameLabel', {
            width: 2,
            height: 0.3
        }, this.scene);
        plane.position.y = 2.3;
        plane.parent = mesh;
        plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

        const nameMat = new BABYLON.StandardMaterial('nameMat', this.scene);
        const nameTexture = new BABYLON.DynamicTexture('nameTexture', { width: 256, height: 64 }, this.scene);
        const ctx = nameTexture.getContext();
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(playerData.username, 128, 40);
        nameTexture.update();
        nameMat.diffuseTexture = nameTexture;
        nameMat.emissiveTexture = nameTexture;
        nameMat.opacityTexture = nameTexture;
        plane.material = nameMat;

        console.log('Spawned remote player:', playerData.username);
    }

    removeRemotePlayer(playerId) {
        const remotePlayer = this.remotePlayers.get(playerId);
        if (remotePlayer) {
            remotePlayer.parts.forEach(part => part.dispose());
            remotePlayer.mesh.dispose();
            this.remotePlayers.delete(playerId);

            this.showNotification(`${remotePlayer.data.username} left the game`);
        }
    }

    updateRemotePlayer(data) {
        const remotePlayer = this.remotePlayers.get(data.id);
        if (remotePlayer) {
            // Smooth interpolation
            const targetPos = new BABYLON.Vector3(data.position.x, data.position.y, data.position.z);
            remotePlayer.mesh.position = BABYLON.Vector3.Lerp(
                remotePlayer.mesh.position,
                targetPos,
                0.3
            );

            // Update rotation
            remotePlayer.mesh.rotation.y = data.rotation.y;

            // Update crouch state
            if (data.isCrouching) {
                remotePlayer.mesh.scaling.y = 0.6;
            } else {
                remotePlayer.mesh.scaling.y = 1.0;
            }
        }
    }

    showRemoteBullet(data) {
        // Create visual bullet
        const bullet = BABYLON.MeshBuilder.CreateSphere('remoteBullet', {
            diameter: 0.1,
            segments: 6
        }, this.scene);

        const bulletMat = new BABYLON.StandardMaterial('remoteBulletMat', this.scene);
        bulletMat.emissiveColor = new BABYLON.Color3(3, 2, 0);
        bulletMat.disableLighting = true;
        bullet.material = bulletMat;

        bullet.position = new BABYLON.Vector3(
            data.origin.x,
            data.origin.y,
            data.origin.z
        );

        const direction = new BABYLON.Vector3(
            data.direction.x,
            data.direction.y,
            data.direction.z
        );

        // Animate bullet
        let distance = 0;
        const speed = 100;
        const maxDistance = 200;

        const update = () => {
            const delta = this.scene.getEngine().getDeltaTime() / 1000;
            const movement = direction.scale(speed * delta);
            bullet.position.addInPlace(movement);
            distance += speed * delta;

            if (distance >= maxDistance) {
                bullet.dispose();
                this.scene.unregisterAfterRender(update);
            }
        };

        this.scene.registerAfterRender(update);

        // Auto-cleanup after 3 seconds
        setTimeout(() => {
            if (!bullet.isDisposed()) {
                bullet.dispose();
                this.scene.unregisterAfterRender(update);
            }
        }, 3000);
    }

    sendShoot(origin, direction, isExplosive = false) {
        if (this.isConnected) {
            this.socket.emit('playerShoot', {
                origin: { x: origin.x, y: origin.y, z: origin.z },
                direction: { x: direction.x, y: direction.y, z: direction.z },
                isExplosive
            });
        }
    }

    sendHit(targetId, damage, isHeadshot = false) {
        if (this.isConnected) {
            this.socket.emit('playerHit', {
                targetId,
                damage,
                isHeadshot
            });
        }
    }

    showDamageFlash() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 0, 0, 0.3);
            pointer-events: none;
            z-index: 9999;
            animation: damageFlash 0.3s ease-out forwards;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 300);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            z-index: 9999;
            animation: fadeInOut 3s ease-out forwards;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    showKillFeed(data) {
        const killFeed = document.getElementById('killFeed') || this.createKillFeed();

        const entry = document.createElement('div');
        entry.style.cssText = `
            padding: 5px 10px;
            margin: 2px 0;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 3px;
            animation: fadeInOut 5s ease-out forwards;
        `;

        const headshot = data.isHeadshot ? ' 🎯' : '';
        entry.innerHTML = `<span style="color: #ff6600;">${data.killerName}</span> killed <span style="color: #ff0000;">${data.victimName}</span>${headshot}`;

        killFeed.appendChild(entry);
        setTimeout(() => entry.remove(), 5000);
    }

    createKillFeed() {
        const killFeed = document.createElement('div');
        killFeed.id = 'killFeed';
        killFeed.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 300px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: white;
            z-index: 9998;
        `;
        document.body.appendChild(killFeed);
        return killFeed;
    }

    disconnect() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.socket) {
            this.socket.disconnect();
        }
        this.isConnected = false;
    }

    // Check if a mesh belongs to a remote player
    isRemotePlayer(mesh) {
        return mesh.isRemotePlayer === true;
    }

    getRemotePlayerId(mesh) {
        return mesh.remotePlayerId;
    }

    // Loot drop methods
    spawnLootDrop(loot) {
        // Create loot crate mesh
        const lootMesh = BABYLON.MeshBuilder.CreateBox('loot_' + loot.id, {
            width: 1,
            height: 0.6,
            depth: 0.8
        }, this.scene);

        lootMesh.position = new BABYLON.Vector3(
            loot.position.x,
            0.3, // Slightly above ground
            loot.position.z
        );

        // Glowing material
        const lootMat = new BABYLON.StandardMaterial('lootMat_' + loot.id, this.scene);
        lootMat.diffuseColor = new BABYLON.Color3(1, 0.8, 0);
        lootMat.emissiveColor = new BABYLON.Color3(0.5, 0.4, 0);
        lootMat.specularColor = new BABYLON.Color3(1, 1, 1);
        lootMesh.material = lootMat;

        // Add floating animation
        let time = 0;
        const floatAnimation = () => {
            time += this.scene.getEngine().getDeltaTime() / 1000;
            lootMesh.position.y = 0.3 + Math.sin(time * 2) * 0.1;
            lootMesh.rotation.y += 0.02;
        };
        this.scene.registerAfterRender(floatAnimation);

        // Store loot data
        this.lootDrops.set(loot.id, {
            mesh: lootMesh,
            data: loot,
            animation: floatAnimation
        });

        // Check for pickup in update loop
        lootMesh.lootId = loot.id;
        lootMesh.isLoot = true;

        console.log(`Spawned loot drop at (${loot.position.x}, ${loot.position.z}) with ${loot.weapons.length} weapons and ${loot.coins} coins`);
    }

    removeLootDrop(lootId) {
        const lootDrop = this.lootDrops.get(lootId);
        if (lootDrop) {
            this.scene.unregisterAfterRender(lootDrop.animation);
            lootDrop.mesh.dispose();
            this.lootDrops.delete(lootId);
        }
    }

    tryPickupLoot() {
        if (!this.player || !this.player.mesh) return false;

        const playerPos = this.player.mesh.position;
        const pickupRange = 4; // Units - increased for easier pickup

        console.log('Trying to pickup loot, player at:', playerPos.x, playerPos.y, playerPos.z);
        console.log('Loot drops available:', this.lootDrops.size);

        for (const [lootId, lootDrop] of this.lootDrops) {
            const distance = BABYLON.Vector3.Distance(playerPos, lootDrop.mesh.position);
            console.log(`Loot ${lootId} at distance: ${distance}`);
            if (distance <= pickupRange) {
                // Send pickup request to server
                console.log('Picking up loot:', lootId);
                this.socket.emit('pickupLoot', lootId);
                return true;
            }
        }
        return false;
    }

    getNearbyLoot() {
        if (!this.player || !this.player.mesh) return null;

        const playerPos = this.player.mesh.position;
        const pickupRange = 5; // Slightly larger than pickup range to show prompt early

        for (const [lootId, lootDrop] of this.lootDrops) {
            const distance = BABYLON.Vector3.Distance(playerPos, lootDrop.mesh.position);
            if (distance <= pickupRange) {
                return lootDrop.data;
            }
        }
        return null;
    }

    // Sync coins with server
    syncCoins(coins) {
        if (this.isConnected) {
            this.socket.emit('coinsUpdate', coins);
        }
    }

    // Notify server of new weapon
    notifyWeaponAcquired(weaponKey) {
        if (this.isConnected) {
            this.socket.emit('weaponAcquired', weaponKey);
        }
    }
}
