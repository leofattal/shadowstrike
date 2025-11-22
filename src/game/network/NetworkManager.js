import { io } from 'socket.io-client';
import * as BABYLON from '@babylonjs/core';

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
                this.player.mesh.position = new BABYLON.Vector3(
                    data.position.x,
                    data.position.y,
                    data.position.z
                );
                this.player.health = data.health;
                this.player.updateHealthUI();
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

    spawnRemotePlayer(playerData) {
        // Create remote player mesh
        const mesh = new BABYLON.TransformNode('remotePlayer_' + playerData.id, this.scene);
        mesh.position = new BABYLON.Vector3(
            playerData.position.x,
            playerData.position.y,
            playerData.position.z
        );

        // Body
        const body = BABYLON.MeshBuilder.CreateCapsule('body', {
            radius: 0.25,
            height: 0.8
        }, this.scene);
        body.position.y = 1.3;
        body.parent = mesh;

        const bodyMat = new BABYLON.StandardMaterial('bodyMat', this.scene);
        bodyMat.diffuseColor = new BABYLON.Color3(
            playerData.color.r,
            playerData.color.g,
            playerData.color.b
        );
        body.material = bodyMat;

        // Head
        const head = BABYLON.MeshBuilder.CreateSphere('head', {
            diameter: 0.35
        }, this.scene);
        head.position.y = 1.85;
        head.parent = mesh;

        const headMat = new BABYLON.StandardMaterial('headMat', this.scene);
        headMat.diffuseColor = new BABYLON.Color3(0.9, 0.75, 0.6);
        head.material = headMat;

        // Arms
        const leftArm = BABYLON.MeshBuilder.CreateCapsule('leftArm', {
            radius: 0.08,
            height: 0.5
        }, this.scene);
        leftArm.position = new BABYLON.Vector3(-0.35, 1.2, 0);
        leftArm.parent = mesh;
        leftArm.material = bodyMat;

        const rightArm = BABYLON.MeshBuilder.CreateCapsule('rightArm', {
            radius: 0.08,
            height: 0.5
        }, this.scene);
        rightArm.position = new BABYLON.Vector3(0.35, 1.2, 0);
        rightArm.parent = mesh;
        rightArm.material = bodyMat;

        // Legs
        const leftLeg = BABYLON.MeshBuilder.CreateCapsule('leftLeg', {
            radius: 0.1,
            height: 0.6
        }, this.scene);
        leftLeg.position = new BABYLON.Vector3(-0.15, 0.5, 0);
        leftLeg.parent = mesh;
        leftLeg.material = bodyMat;

        const rightLeg = BABYLON.MeshBuilder.CreateCapsule('rightLeg', {
            radius: 0.1,
            height: 0.6
        }, this.scene);
        rightLeg.position = new BABYLON.Vector3(0.15, 0.5, 0);
        rightLeg.parent = mesh;
        rightLeg.material = bodyMat;

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

        // Store parts for hit detection
        const parts = [body, head, leftArm, rightArm, leftLeg, rightLeg];
        parts.forEach(part => {
            part.isRemotePlayer = true;
            part.remotePlayerId = playerData.id;
            part.isHeadshot = part === head;
        });

        this.remotePlayers.set(playerData.id, {
            mesh: mesh,
            parts: parts,
            data: playerData
        });

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
}
