import * as BABYLON from '@babylonjs/core';
import { WeaponTypes, WeaponUpgrades } from '../weapons/WeaponTypes.js';

export class Player {
    constructor(scene, inputManager) {
        this.scene = scene;
        this.inputManager = inputManager;

        // Player stats
        this.health = 100;
        this.maxHealth = 100;
        this.coins = 0;

        // Weapon system
        this.currentWeapon = 'PISTOL';
        this.ownedWeapons = ['PISTOL', 'KNIFE', 'SNIPER_RIFLE'];
        this.weaponUpgrades = {};
        this.weaponStats = null;

        // Initialize weapon stats
        this.loadWeaponStats();

        // Ammo (loaded from weapon stats)
        this.currentAmmo = this.weaponStats.maxAmmo;
        this.reserveAmmo = this.weaponStats.reserveAmmo;
        this.maxAmmo = this.weaponStats.maxAmmo;

        // Movement properties
        this.moveSpeed = 4.0;
        this.sprintSpeed = 7.0;
        this.crouchSpeed = 2.0;
        this.jumpForce = 5.0;
        this.isGrounded = false;
        this.isCrouching = false;
        this.velocity = new BABYLON.Vector3(0, 0, 0);
        this.standingHeight = 1.6;
        this.crouchHeight = 0.8;

        // Ladder climbing properties
        this.isClimbingLadder = false;
        this.ladderClimbSpeed = 5.0;
        this.ladderTrigger = null;
        this.ladderTopPosition = null;

        // Camera properties
        this.mouseSensitivity = 0.002;
        this.cameraPitch = 0;
        this.cameraYaw = 0;
        this.normalFOV = 0.8;
        this.isZooming = false;

        // Shooting properties (loaded from weapon stats)
        this.fireRate = this.weaponStats.fireRate;
        this.damage = this.weaponStats.damage;
        this.reloadTime = this.weaponStats.reloadTime;
        this.lastShotTime = 0;
        this.isReloading = false;
        this.reloadTimer = 0;
        this.shotQueued = false;

        // References
        this.mesh = null;
        this.camera = null;
        this.shootRay = null;

        // Callbacks
        this.onEnemyKilled = null;
        this.onPlayerDeath = null;
        this.onEnemyHit = null; // Callback for hit markers

        // Stats tracking
        this.enemiesKilled = 0;
        this.isDead = false;

        // Combo and multiplier system
        this.comboKills = 0;
        this.comboMultiplier = 1;
        this.lastKillTime = 0;
        this.comboTimeout = 3000; // 3 seconds to maintain combo
        this.killstreak = 0;
        this.timeScale = 1.0; // For slow-motion effects
    }

    spawn(position) {
        // Create player capsule (invisible in first-person, but useful for collision)
        this.mesh = BABYLON.MeshBuilder.CreateCapsule('player', {
            height: 1.8,
            radius: 0.3
        }, this.scene);
        this.mesh.position = position;
        this.mesh.checkCollisions = true;
        this.mesh.ellipsoid = new BABYLON.Vector3(0.3, 0.9, 0.3);

        // Make player invisible (third-person body could be added later)
        this.mesh.visibility = 0;

        // Create camera (first-person)
        this.camera = new BABYLON.UniversalCamera('playerCamera',
            new BABYLON.Vector3(0, 1.6, 0), this.scene);
        this.camera.parent = this.mesh;
        this.camera.minZ = 0.1;
        this.camera.fov = this.normalFOV;
        this.scene.activeCamera = this.camera;

        // Set up camera collision
        this.camera.checkCollisions = true;
        this.camera.applyGravity = false; // We'll handle gravity manually

        // Find ladder trigger and define top position
        this.ladderTrigger = this.scene.getMeshByName('ladderTrigger');
        if (this.ladderTrigger) {
            const towerHeight = 15; // From LevelManager
            this.ladderTopPosition = new BABYLON.Vector3(
                this.ladderTrigger.position.x,
                towerHeight + 1,
                this.ladderTrigger.position.z - 0.5
            );
        }

        // Load shooting sound
        this.shootSound = new BABYLON.Sound(
            'shootSound',
            'sniper-lourd-headshot-fortnite.mp3',
            this.scene,
            () => {
                console.log('Shoot sound loaded successfully');
            },
            {
                loop: false,
                autoplay: false,
                volume: 1.0
            }
        );

        // Load reload sound
        this.reloadSound = new BABYLON.Sound(
            'reloadSound',
            'gunreload.mp3',
            this.scene,
            () => {
                console.log('Reload sound loaded successfully');
            },
            {
                loop: false,
                autoplay: false,
                volume: 1.0
            }
        );

        // Load explosion sound
        this.explosionSound = new BABYLON.Sound(
            'explosionSound',
            'rpg-roblox.mp3',
            this.scene,
            () => {
                console.log('Explosion sound loaded successfully');
            },
            {
                loop: false,
                autoplay: false,
                volume: 1.0
            }
        );
    }

    update(deltaTime) {
        if (!this.mesh || !this.camera) return;
        if (this.isDead) return; // Don't update if dead

        // Update combo timer
        this.updateComboTimer(deltaTime);

        // Handle automated ladder climbing
        if (this.isClimbingLadder) {
            this.mesh.position.y += this.ladderClimbSpeed * deltaTime;
            // Teleport to top position if reached
            if (this.mesh.position.y >= this.ladderTopPosition.y) {
                this.mesh.position = this.ladderTopPosition.clone();
                this.isClimbingLadder = false;
            }
            return; // Skip all other updates while climbing
        }

        // Handle reloading
        if (this.isReloading) {
            this.reloadTimer += deltaTime;
            if (this.reloadTimer >= this.reloadTime) {
                this.finishReload();
            }
            return; // Can't do anything else while reloading
        }

        // Handle zoom/scope
        this.updateZoom(deltaTime);

        // Handle camera rotation
        this.updateCamera(deltaTime);

        // Handle movement
        this.updateMovement(deltaTime);

        // Apply gravity
        this.applyGravity(deltaTime);

        // Check if grounded
        this.checkGrounded();
    }

    updateCamera(deltaTime) {
        const mouseDelta = this.inputManager.getMouseDelta();

        // Update yaw (left-right rotation)
        this.cameraYaw -= mouseDelta.x * this.mouseSensitivity;

        // Update pitch (up-down rotation)
        this.cameraPitch -= mouseDelta.y * this.mouseSensitivity;
        this.cameraPitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.cameraPitch));

        // Apply rotation to mesh (yaw)
        this.mesh.rotation.y = this.cameraYaw;

        // Apply rotation to camera (pitch)
        this.camera.rotation.x = this.cameraPitch;
    }

    updateZoom(deltaTime) {
        // Check if right mouse button is held
        const isZoomButtonHeld = this.inputManager.isMouseButtonDown(2); // Right click

        if (isZoomButtonHeld && !this.isZooming) {
            // Start zooming and queue a shot
            this.isZooming = true;
            this.shotQueued = true;
        } else if (!isZoomButtonHeld && this.isZooming) {
            // Stop zooming and fire the queued shot
            this.isZooming = false;
            if (this.shotQueued) {
                this.shoot();
                this.shotQueued = false;
            }
        }

        // Smoothly interpolate FOV
        const targetFOV = this.isZooming ? this.weaponStats.zoomedFOV : this.normalFOV;
        this.camera.fov += (targetFOV - this.camera.fov) * deltaTime * 10;
    }

    updateMovement(deltaTime) {
        if (this.isClimbingLadder) return; // Disable movement while climbing

        const input = this.inputManager.getMovementInput();

        // Handle crouching
        if (this.inputManager.isCrouchPressed()) {
            if (!this.isCrouching) {
                this.isCrouching = true;
                // Lower camera
                this.camera.position.y = this.crouchHeight;
            }
        } else {
            if (this.isCrouching) {
                this.isCrouching = false;
                // Raise camera back up
                this.camera.position.y = this.standingHeight;
            }
        }

        // Get current speed based on state
        const isSprinting = this.inputManager.isSprintPressed() && !this.isCrouching;
        let speed = this.moveSpeed;
        if (isSprinting) {
            speed = this.sprintSpeed;
        } else if (this.isCrouching) {
            speed = this.crouchSpeed;
        }

        // Calculate movement direction relative to camera
        const forward = this.mesh.forward.scale(input.forward);
        const right = this.mesh.right.scale(input.right);
        const movement = forward.add(right);

        if (movement.length() > 0) {
            movement.normalize().scaleInPlace(speed * deltaTime);
            this.mesh.moveWithCollisions(movement);
        }

        // Handle jump and ladder climb trigger
        if (this.inputManager.isJumpPressed()) {
            // Check for ladder climb
            if (this.ladderTrigger && this.mesh.intersectsMesh(this.ladderTrigger, false)) {
                this.isClimbingLadder = true;
                this.velocity.y = 0; // Stop any falling momentum
            }
            // Handle normal jump
            else if (this.isGrounded) {
                this.velocity.y = this.jumpForce;
                this.isGrounded = false;
            }
        }
    }

    applyGravity(deltaTime) {
        if (this.isClimbingLadder) return; // Disable gravity while climbing

        if (!this.isGrounded) {
            this.velocity.y -= 9.81 * deltaTime;
        } else {
            this.velocity.y = 0;
        }

        const verticalMovement = new BABYLON.Vector3(0, this.velocity.y * deltaTime, 0);
        this.mesh.moveWithCollisions(verticalMovement);
    }

    checkGrounded() {
        // Simple ground check - raycast downward from bottom of capsule
        // Capsule height is 1.8, so half is 0.9. Ray starts from center, needs to reach past feet.
        const ray = new BABYLON.Ray(
            this.mesh.position,
            new BABYLON.Vector3(0, -1, 0),
            1.0  // Slightly more than capsule half-height to detect ground
        );

        const hit = this.scene.pickWithRay(ray, (mesh) => {
            return mesh !== this.mesh && mesh.checkCollisions;
        });

        this.isGrounded = hit && hit.hit;
    }

    shoot() {
        if (this.isReloading) return;

        // Knife doesn't use ammo
        if (!this.weaponStats.isMelee && this.currentAmmo <= 0) {
            this.reload();
            return;
        }

        const now = performance.now() / 1000;
        if (now - this.lastShotTime < this.fireRate) return;

        this.lastShotTime = now;

        // Only decrement ammo for non-melee weapons
        if (!this.weaponStats.isMelee) {
            this.currentAmmo--;
        }

        // Play shooting sound (only for non-explosive and non-melee weapons)
        if (!this.weaponStats.hasExplosiveAmmo && !this.weaponStats.isMelee) {
            if (this.shootSound) {
                console.log('Playing shoot sound...');
                this.shootSound.play();
            } else {
                console.log('Shoot sound not loaded!');
            }
        }

        // Create muzzle flash particle effect (not for melee)
        if (!this.weaponStats.isMelee) {
            this.createMuzzleFlash();
        }

        // Create ray from camera center - use getDirection for accurate aiming
        const origin = this.camera.globalPosition;
        const forward = this.camera.getDirection(BABYLON.Vector3.Forward());

        // Use melee range for knife, otherwise normal range
        const range = this.weaponStats.isMelee ? (this.weaponStats.meleeRange || 3) : 1000;
        const ray = new BABYLON.Ray(origin, forward, range);

        // Send bullet to network if in PvP mode
        if (this.networkManager && this.networkManager.isConnected) {
            this.networkManager.sendShoot(origin, forward, this.weaponStats.hasExplosiveAmmo);
        }

        // Check for hits - include both enemies and remote players
        const hit = this.scene.pickWithRay(ray, (mesh) => {
            // Check for AI enemies
            if (mesh !== this.mesh && mesh.name.startsWith('enemy')) {
                return true;
            }
            // Check for remote players (PvP)
            if (mesh.isRemotePlayer) {
                return true;
            }
            return false;
        });

        // Check if headshot
        const isHeadshot = hit && hit.hit && hit.pickedMesh.isHeadshot === true;

        // If headshot, create bullet cam with physical bullet
        if (isHeadshot) {
            this.createBulletCam(origin, forward, hit);
        } else {
            // Normal instant raycast shooting
            // Visualize the ray (for debugging)
            const rayHelper = new BABYLON.RayHelper(ray);
            rayHelper.show(this.scene, new BABYLON.Color3(1, 0, 0));
            setTimeout(() => rayHelper.hide(), 50);

            if (hit && hit.hit) {
                // Create bullet impact effect
                this.createBulletImpact(hit.pickedPoint);

                // Check if we hit a remote player (PvP)
                if (hit.pickedMesh.isRemotePlayer) {
                    const targetId = hit.pickedMesh.remotePlayerId;
                    const wasHeadshot = hit.pickedMesh.isHeadshot === true;
                    const damage = wasHeadshot ? this.damage * 2 : this.damage;

                    console.log('Hit remote player:', targetId, wasHeadshot ? '(HEADSHOT!)' : '');

                    // Send hit to server
                    if (this.networkManager && this.networkManager.isConnected) {
                        this.networkManager.sendHit(targetId, damage, wasHeadshot);
                    }

                    // Show hit marker
                    if (this.onEnemyHit) {
                        this.onEnemyHit(wasHeadshot);
                    }
                } else {
                    // Hit AI enemy
                    console.log('Hit enemy:', hit.pickedMesh.name);

                    // Damage the enemy - check both the mesh and its parent
                    let enemyComponent = hit.pickedMesh.enemyComponent;

                    // If the mesh doesn't have the component, check its parent
                    if (!enemyComponent && hit.pickedMesh.parent) {
                        enemyComponent = hit.pickedMesh.parent.enemyComponent;
                    }

                    if (enemyComponent) {
                        const wasHeadshot = enemyComponent.takeDamage(this.damage, isHeadshot);

                        // Show hit marker
                        if (this.onEnemyHit) {
                            this.onEnemyHit(wasHeadshot);
                        }

                        // Check if enemy died
                        if (!enemyComponent.alive) {
                            this.registerKill(wasHeadshot);
                        }
                    } else {
                        console.log('No enemy component found on:', hit.pickedMesh.name);
                    }
                }

                // Handle explosive ammo
                if (this.weaponStats.hasExplosiveAmmo) {
                    this.createExplosion(hit.pickedPoint);
                }
            } else if (this.weaponStats.hasExplosiveAmmo) {
                // Even if we don't hit an enemy, create explosion at max range or terrain
                const maxRangePoint = origin.add(forward.scale(1000));
                const terrainHit = this.scene.pickWithRay(new BABYLON.Ray(origin, forward, 1000), (mesh) => {
                    return mesh.checkCollisions && !mesh.name.startsWith('enemy');
                });

                if (terrainHit && terrainHit.hit) {
                    this.createExplosion(terrainHit.pickedPoint);
                }
            }
        }

        // Auto-reload if empty
        if (this.currentAmmo <= 0 && this.reserveAmmo > 0) {
            this.reload();
        }
    }

    createBulletCam(origin, direction, hit) {
        // Prevent multiple bullet cams running at once
        if (this.bulletCamActive) {
            console.log('Bullet cam already active, skipping');
            return;
        }
        this.bulletCamActive = true;

        // Set slow motion immediately for entire sequence
        this.timeScale = 0.15; // Very slow motion (15% speed) for entire sequence

        // Create visible bullet - EXTREMELY visible sphere
        const bullet = BABYLON.MeshBuilder.CreateSphere('bullet', {
            diameter: 0.3,
            segments: 16
        }, this.scene);

        const bulletMaterial = new BABYLON.StandardMaterial('bulletMat', this.scene);
        bulletMaterial.emissiveColor = new BABYLON.Color3(5, 3, 1); // SUPER bright glow
        bulletMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
        bulletMaterial.disableLighting = true; // Always visible regardless of lighting
        bullet.material = bulletMaterial;

        // Add giant glowing tracer trail behind bullet
        const tracer = BABYLON.MeshBuilder.CreateSphere('tracer', {
            diameter: 0.5,
            segments: 8
        }, this.scene);
        const tracerMaterial = new BABYLON.StandardMaterial('tracerMat', this.scene);
        tracerMaterial.emissiveColor = new BABYLON.Color3(3, 1.5, 0);
        tracerMaterial.alpha = 0.7;
        tracerMaterial.disableLighting = true;
        tracer.material = tracerMaterial;
        tracer.parent = bullet;
        tracer.position = new BABYLON.Vector3(0, 0, 0);
        tracer.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);

        bullet.position = origin.clone();

        console.log('Bullet cam started at:', bullet.position);

        // Create bullet camera positioned to the side
        const bulletCam = new BABYLON.FreeCamera('bulletCam', origin.clone(), this.scene);

        // Store original camera
        const originalCamera = this.scene.activeCamera;

        // Switch to bullet cam after brief delay to show bullet leaving gun
        setTimeout(() => {
            if (this.scene.activeCamera === originalCamera) {
                this.scene.activeCamera = bulletCam;
            }
        }, 100);

        // Calculate bullet travel distance and time
        const targetPoint = hit.pickedPoint;
        const distance = BABYLON.Vector3.Distance(origin, targetPoint);
        const bulletSpeed = 200; // Units per second (will be affected by timeScale)

        // Animate bullet
        let startTime = performance.now();
        const bulletVelocity = direction.scale(bulletSpeed);

        // Calculate perpendicular vector for side camera angle
        const right = BABYLON.Vector3.Cross(direction, BABYLON.Vector3.Up()).normalize();

        let bulletHit = false;
        let impactTime = 0;
        let distanceTraveled = 0;
        let isCleanedUp = false;

        // Cleanup function to safely end bullet cam
        const cleanupBulletCam = () => {
            if (isCleanedUp) return;
            isCleanedUp = true;

            console.log('Cleaning up bullet cam');

            // Unregister update loop
            this.scene.unregisterAfterRender(bulletUpdate);

            // Restore original camera
            if (this.scene.activeCamera !== originalCamera) {
                this.scene.activeCamera = originalCamera;
            }

            // Dispose bullet cam
            if (bulletCam) {
                bulletCam.dispose();
            }

            // Dispose bullet and tracer
            if (bullet && !bullet.isDisposed()) {
                bullet.dispose();
            }
            if (tracer && !tracer.isDisposed()) {
                tracer.dispose();
            }

            // Reset time scale
            this.timeScale = 1.0;

            // Mark bullet cam as inactive
            this.bulletCamActive = false;
        };

        const bulletUpdate = () => {
            // Safety check - auto cleanup if too much time has passed
            const totalElapsed = (performance.now() - startTime) / 1000;
            if (totalElapsed > 8.0) {
                console.log('Bullet cam exceeded max time, forcing cleanup');
                cleanupBulletCam();
                return;
            }

            if (distanceTraveled < distance - 0.5 && !bulletHit) {
                // Bullet is still traveling to target
                // Update bullet position (affected by timeScale)
                const scaledDelta = this.scene.getEngine().getDeltaTime() / 1000;
                const movement = bulletVelocity.scale(scaledDelta * this.timeScale);
                bullet.position.addInPlace(movement);
                distanceTraveled += movement.length();

                // Make bullet visible and always render
                bullet.isVisible = true;
                bullet.visibility = 1.0;

                // Position camera BEHIND the bullet following it
                const behindOffset = direction.scale(-1.5); // 1.5 units behind bullet
                const heightOffset = new BABYLON.Vector3(0, 0.2, 0); // Slightly above

                bulletCam.position = bullet.position.add(behindOffset).add(heightOffset);

                // Camera looks forward in the direction the bullet is traveling
                bulletCam.setTarget(bullet.position.add(direction.scale(10)));
            } else if (!bulletHit) {
                // Bullet reached target - impact and start death sequence
                bulletHit = true;
                impactTime = performance.now();

                // Create bullet impact effect
                this.createBulletImpact(targetPoint);

                // Damage the enemy
                let enemyComponent = hit.pickedMesh.enemyComponent;
                if (!enemyComponent && hit.pickedMesh.parent) {
                    enemyComponent = hit.pickedMesh.parent.enemyComponent;
                }

                if (enemyComponent) {
                    const wasHeadshot = enemyComponent.takeDamage(this.damage, true);

                    // Show hit marker
                    if (this.onEnemyHit) {
                        this.onEnemyHit(wasHeadshot);
                    }

                    // Check if enemy died
                    if (!enemyComponent.alive) {
                        this.registerKill(wasHeadshot);
                    }

                    // Position camera to side of enemy for one continuous death shot
                    const enemyPos = enemyComponent.mesh.position;
                    const toEnemy = enemyPos.subtract(origin).normalize();
                    const enemyRight = BABYLON.Vector3.Cross(toEnemy, BABYLON.Vector3.Up()).normalize();

                    // Camera positioned to side of enemy at head height
                    bulletCam.position = enemyPos.add(enemyRight.scale(3.5)).add(new BABYLON.Vector3(0, 1.8, 0));
                    bulletCam.setTarget(enemyPos.add(new BABYLON.Vector3(0, 1.5, 0)));
                }

                // Handle explosive ammo
                if (this.weaponStats.hasExplosiveAmmo) {
                    this.createExplosion(targetPoint);
                }

                // Clean up bullet meshes
                if (bullet && !bullet.isDisposed()) {
                    bullet.dispose();
                }
                if (tracer && !tracer.isDisposed()) {
                    tracer.dispose();
                }

                // Keep slow motion for entire death animation - 5 seconds total view time
                setTimeout(() => { this.timeScale = 1.0; }, 5000);
            } else {
                // Watch death animation in slow motion for 5 seconds
                const deathElapsed = (performance.now() - impactTime) / 1000;

                if (deathElapsed > 5.0) {
                    // End of death animation viewing
                    cleanupBulletCam();
                }
            }
        };

        this.scene.registerAfterRender(bulletUpdate);

        // Backup safety timeout - force end bullet cam after 10 seconds
        setTimeout(() => {
            cleanupBulletCam();
        }, 10000);
    }

    createMuzzleFlash() {
        // Create a simple particle system for muzzle flash
        const particleSystem = new BABYLON.ParticleSystem("muzzleFlash", 50, this.scene);

        // Position at camera (gun position)
        const forward = this.camera.getDirection(BABYLON.Vector3.Forward());
        const emitterPosition = this.camera.globalPosition.add(forward.scale(0.5));
        particleSystem.emitter = emitterPosition;

        // Particle appearance
        particleSystem.particleTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==", this.scene);

        particleSystem.color1 = new BABYLON.Color4(1, 0.8, 0.2, 1.0);
        particleSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0.5, 0.3, 0, 0.0);

        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.3;

        particleSystem.minLifeTime = 0.05;
        particleSystem.maxLifeTime = 0.1;

        particleSystem.emitRate = 500;

        // Direction
        particleSystem.direction1 = forward.scale(2);
        particleSystem.direction2 = forward.scale(3);

        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;

        particleSystem.updateSpeed = 0.01;

        // Start and auto-stop
        particleSystem.targetStopDuration = 0.05;
        particleSystem.start();

        setTimeout(() => {
            particleSystem.dispose();
        }, 200);
    }

    createBulletImpact(position) {
        // Create particle system for bullet impact
        const particleSystem = new BABYLON.ParticleSystem("bulletImpact", 30, this.scene);

        particleSystem.emitter = position;

        // Particle appearance
        particleSystem.particleTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==", this.scene);

        particleSystem.color1 = new BABYLON.Color4(0.7, 0.7, 0.7, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.5, 0.5, 0.5, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0.3, 0.3, 0.3, 0.0);

        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.15;

        particleSystem.minLifeTime = 0.1;
        particleSystem.maxLifeTime = 0.3;

        particleSystem.emitRate = 300;

        // Random directions (explosion-like)
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1);

        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;

        particleSystem.updateSpeed = 0.01;

        particleSystem.gravity = new BABYLON.Vector3(0, -2, 0);

        // Start and auto-stop
        particleSystem.targetStopDuration = 0.1;
        particleSystem.start();

        setTimeout(() => {
            particleSystem.dispose();
        }, 400);
    }

    createExplosion(position) {
        // Play explosion sound
        if (this.explosionSound) {
            console.log('Playing explosion sound...');
            this.explosionSound.play();
        }

        // Create explosion particle system
        const particleSystem = new BABYLON.ParticleSystem("explosion", 100, this.scene);

        particleSystem.emitter = position;

        // Particle appearance
        particleSystem.particleTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==", this.scene);

        particleSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(1, 0.2, 0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0.3, 0.1, 0, 0.0);

        particleSystem.minSize = 0.3;
        particleSystem.maxSize = 0.8;

        particleSystem.minLifeTime = 0.2;
        particleSystem.maxLifeTime = 0.5;

        particleSystem.emitRate = 500;

        // Spherical explosion
        particleSystem.createSphereEmitter(1);

        particleSystem.minEmitPower = 5;
        particleSystem.maxEmitPower = 10;

        particleSystem.updateSpeed = 0.01;

        particleSystem.gravity = new BABYLON.Vector3(0, -5, 0);

        // Start and auto-stop
        particleSystem.targetStopDuration = 0.2;
        particleSystem.start();

        setTimeout(() => {
            particleSystem.dispose();
        }, 700);

        // Apply explosion damage to nearby enemies
        const radius = this.weaponStats.explosiveRadius;
        const explosiveDamage = this.weaponStats.explosiveDamage;

        // Find all enemies in the scene
        this.scene.meshes.forEach(mesh => {
            if (mesh.name.startsWith('enemy') && mesh.enemyComponent) {
                const enemyComponent = mesh.enemyComponent;
                const distance = BABYLON.Vector3.Distance(position, mesh.getAbsolutePosition());
                if (distance <= radius) {
                    // Check if enemy was alive before damage
                    const wasAlive = enemyComponent.alive;

                    // Apply damage based on distance (closer = more damage)
                    const damageFalloff = 1 - (distance / radius);
                    const damage = Math.round(explosiveDamage * damageFalloff);
                    enemyComponent.takeDamage(damage, false);
                    console.log(`Explosion hit ${mesh.name} for ${damage} damage!`);

                    // Check if enemy died from this explosion
                    if (wasAlive && !enemyComponent.alive) {
                        this.registerKill(false); // Explosion kill
                    }
                }
            }
        });

        console.log(`Explosion at ${position} with radius ${radius}!`);
    }

    reload() {
        if (this.isReloading) return;
        if (this.currentAmmo === this.maxAmmo) return;
        if (this.reserveAmmo <= 0) return;

        this.isReloading = true;
        this.reloadTimer = 0;

        // Play reload sound
        if (this.reloadSound) {
            console.log('Playing reload sound...');
            this.reloadSound.play();
        } else {
            console.log('Reload sound not loaded!');
        }

        console.log('Reloading...');
    }

    finishReload() {
        const ammoNeeded = this.maxAmmo - this.currentAmmo;
        const ammoToReload = Math.min(ammoNeeded, this.reserveAmmo);

        this.currentAmmo += ammoToReload;
        this.reserveAmmo -= ammoToReload;

        this.isReloading = false;
        console.log('Reload complete!');
    }

    takeDamage(amount) {
        if (this.isDead) return;

        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }

    die() {
        console.log('Player died!');
        this.isDead = true;

        // Trigger death callback
        if (this.onPlayerDeath) {
            this.onPlayerDeath(this.coins, this.enemiesKilled);
        }
    }

    respawn(position) {
        // Reset player stats
        this.health = this.maxHealth;
        this.isDead = false;
        this.enemiesKilled = 0;

        // Reset ammo
        this.currentAmmo = this.weaponStats.maxAmmo;
        this.reserveAmmo = this.weaponStats.reserveAmmo;
        this.isReloading = false;

        // Reset time scale in case stuck in slow motion
        this.timeScale = 1.0;

        // Make sure active camera is player camera (not bullet cam)
        if (this.camera && this.scene.activeCamera !== this.camera) {
            this.scene.activeCamera = this.camera;
        }

        // Reset position - MUST set mesh position and reset velocity
        if (this.mesh) {
            this.mesh.position = position.clone();
            console.log('Respawning player at:', position);
        }

        // Reset velocity to prevent being stuck
        this.velocity = new BABYLON.Vector3(0, 0, 0);
        this.isGrounded = false;
        this.isClimbingLadder = false;

        // Reset camera rotation
        this.cameraPitch = 0;
        this.cameraYaw = 0;

        console.log('Player respawned!');
    }

    addCoins(amount) {
        this.coins += amount;
        console.log(`+${amount} coins! Total: ${this.coins}`);
    }

    registerKill(wasHeadshot) {
        const now = performance.now();

        // Check if combo is still active
        if (now - this.lastKillTime < this.comboTimeout) {
            this.comboKills++;
        } else {
            this.comboKills = 1; // Reset combo
        }

        this.lastKillTime = now;
        this.enemiesKilled++;
        this.killstreak++;

        // Calculate multiplier based on combo
        if (this.comboKills >= 10) {
            this.comboMultiplier = 5;
        } else if (this.comboKills >= 5) {
            this.comboMultiplier = 3;
        } else if (this.comboKills >= 3) {
            this.comboMultiplier = 2;
        } else {
            this.comboMultiplier = 1;
        }

        // Calculate coins with multiplier
        let coinReward = wasHeadshot ? 100 : 50;
        coinReward = Math.round(coinReward * this.comboMultiplier);
        this.addCoins(coinReward);

        // Trigger slow-mo on headshot
        if (wasHeadshot) {
            this.triggerSlowMotion();
        }

        // Killstreak rewards
        this.checkKillstreakRewards();

        // Notify game about the kill
        if (this.onEnemyKilled) {
            this.onEnemyKilled(wasHeadshot);
        }

        console.log(`💀 Kill! Combo: ${this.comboKills}x | Multiplier: ${this.comboMultiplier}x | Killstreak: ${this.killstreak}`);
    }

    updateComboTimer(deltaTime) {
        const now = performance.now();
        if (now - this.lastKillTime > this.comboTimeout && this.comboKills > 0) {
            console.log(`Combo broken! Final: ${this.comboKills} kills`);
            this.comboKills = 0;
            this.comboMultiplier = 1;
        }
    }

    triggerSlowMotion() {
        this.timeScale = 0.3; // 30% speed
        setTimeout(() => {
            this.timeScale = 1.0; // Back to normal
        }, 500); // 0.5 seconds of slow-mo
    }

    checkKillstreakRewards() {
        if (this.killstreak === 5) {
            console.log('🔥 KILLSTREAK! Double coins for 10 seconds!');
            // This would be handled by a timer in update
        } else if (this.killstreak === 10) {
            console.log('🔥🔥 MEGA KILLSTREAK! Free ammo refill!');
            this.currentAmmo = this.weaponStats.maxAmmo;
            this.reserveAmmo = this.weaponStats.reserveAmmo;
        } else if (this.killstreak === 15) {
            console.log('🔥🔥🔥 UNSTOPPABLE! Temporary invincibility!');
            // This would trigger invincibility
        }
    }

    loadWeaponStats() {
        // Load base weapon stats
        const baseStats = WeaponTypes[this.currentWeapon];
        this.weaponStats = { ...baseStats };
        this.applyUpgrades();
    }

    applyUpgrades() {
        if (!this.weaponStats) return;

        // Reset to base stats
        const baseStats = WeaponTypes[this.currentWeapon];
        this.weaponStats = { ...baseStats };

        // Apply upgrades
        if (this.weaponUpgrades.DAMAGE) {
            this.weaponStats.damage = Math.round(baseStats.damage * WeaponUpgrades.DAMAGE.damageMultiplier);
        }
        if (this.weaponUpgrades.FIRE_RATE) {
            this.weaponStats.fireRate = baseStats.fireRate * WeaponUpgrades.FIRE_RATE.fireRateMultiplier;
        }
        if (this.weaponUpgrades.AMMO_CAPACITY) {
            this.weaponStats.maxAmmo = Math.round(baseStats.maxAmmo * WeaponUpgrades.AMMO_CAPACITY.ammoMultiplier);
            this.weaponStats.reserveAmmo = Math.round(baseStats.reserveAmmo * WeaponUpgrades.AMMO_CAPACITY.ammoMultiplier);
        }
        if (this.weaponUpgrades.RELOAD_SPEED) {
            this.weaponStats.reloadTime = baseStats.reloadTime * WeaponUpgrades.RELOAD_SPEED.reloadTimeMultiplier;
        }
        if (this.weaponUpgrades.BLAST_RADIUS) {
            this.weaponStats.explosiveRadius = baseStats.explosiveRadius * WeaponUpgrades.BLAST_RADIUS.radiusMultiplier;
            this.weaponStats.explosiveDamage = Math.round(baseStats.explosiveDamage * WeaponUpgrades.BLAST_RADIUS.explosiveDamageMultiplier);
        }

        // Update active stats
        this.damage = this.weaponStats.damage;
        this.fireRate = this.weaponStats.fireRate;
        this.reloadTime = this.weaponStats.reloadTime;
        this.maxAmmo = this.weaponStats.maxAmmo;
    }

    switchWeapon(weaponKey) {
        if (!this.ownedWeapons.includes(weaponKey)) {
            console.log("You don't own this weapon!");
            return;
        }

        this.currentWeapon = weaponKey;
        this.loadWeaponStats();

        // Reload ammo for new weapon
        this.currentAmmo = this.weaponStats.maxAmmo;
        this.reserveAmmo = this.weaponStats.reserveAmmo;

        console.log(`Switched to ${this.weaponStats.name}`);
    }
}
