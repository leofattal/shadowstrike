import * as BABYLON from '@babylonjs/core';

export class Enemy {
    constructor(scene, position, player) {
        this.scene = scene;
        this.player = player;
        this.health = 80;
        this.maxHealth = 80;
        this.moveSpeed = 2.0;
        this.alive = true;

        // AI states
        this.state = 'patrol'; // patrol, chase, attack
        this.patrolPoints = [];
        this.currentPatrolIndex = 0;
        this.detectionRange = 50; // Increased for long-range sniper gameplay
        this.attackRange = 45; // Increased so enemies can shoot from far away

        // Combat properties
        this.fireRate = 0.5; // Shoot every 0.5 seconds
        this.lastShotTime = 0;
        this.damage = 10;

        this.mesh = null;
        this.healthBar = null;

        this.createMesh(position);
        this.setupPatrol(position);
    }

    createMesh(position) {
        // Create a parent mesh for the entire soldier - positioned at ground level (y=0)
        this.mesh = new BABYLON.TransformNode('enemy', this.scene);
        this.mesh.position = position.clone();
        this.mesh.position.y = 0; // Ensure grounded

        // Body (torso) - realistic capsule shape
        const body = BABYLON.MeshBuilder.CreateCapsule('enemyBody', {
            radius: 0.25,
            height: 0.8,
            tessellation: 16
        }, this.scene);
        body.position.y = 1.3; // Above ground
        body.parent = this.mesh;

        // Neck - cylinder connecting head and body
        const neck = BABYLON.MeshBuilder.CreateCylinder('enemyNeck', {
            diameterTop: 0.15,
            diameterBottom: 0.18,
            height: 0.15,
            tessellation: 12
        }, this.scene);
        neck.position.y = 1.75;
        neck.parent = this.mesh;

        // Head - sphere for realistic shape
        const head = BABYLON.MeshBuilder.CreateSphere('enemyHead', {
            diameter: 0.35,
            segments: 16
        }, this.scene);
        head.position.y = 1.92;
        head.parent = this.mesh;

        // Helmet/Cap on head for military look
        const helmet = BABYLON.MeshBuilder.CreateSphere('enemyHelmet', {
            diameter: 0.37,
            segments: 16,
            slice: 0.6 // Only top half
        }, this.scene);
        helmet.position.y = 1.98;
        helmet.parent = this.mesh;

        // Legs - cylinders for realistic limbs
        const leftLeg = BABYLON.MeshBuilder.CreateCylinder('enemyLeftLeg', {
            diameterTop: 0.14,
            diameterBottom: 0.12,
            height: 0.9,
            tessellation: 12
        }, this.scene);
        leftLeg.position = new BABYLON.Vector3(-0.13, 0.45, 0);
        leftLeg.parent = this.mesh;

        const rightLeg = BABYLON.MeshBuilder.CreateCylinder('enemyRightLeg', {
            diameterTop: 0.14,
            diameterBottom: 0.12,
            height: 0.9,
            tessellation: 12
        }, this.scene);
        rightLeg.position = new BABYLON.Vector3(0.13, 0.45, 0);
        rightLeg.parent = this.mesh;

        // Feet - small boxes for boots
        const leftFoot = BABYLON.MeshBuilder.CreateBox('enemyLeftFoot', {
            width: 0.14,
            height: 0.08,
            depth: 0.25
        }, this.scene);
        leftFoot.position = new BABYLON.Vector3(-0.13, 0.04, 0.05);
        leftFoot.parent = this.mesh;

        const rightFoot = BABYLON.MeshBuilder.CreateBox('enemyRightFoot', {
            width: 0.14,
            height: 0.08,
            depth: 0.25
        }, this.scene);
        rightFoot.position = new BABYLON.Vector3(0.13, 0.04, 0.05);
        rightFoot.parent = this.mesh;

        // Upper Arms - cylinders
        const leftUpperArm = BABYLON.MeshBuilder.CreateCylinder('enemyLeftUpperArm', {
            diameter: 0.11,
            height: 0.35,
            tessellation: 12
        }, this.scene);
        leftUpperArm.position = new BABYLON.Vector3(-0.38, 1.45, 0);
        leftUpperArm.parent = this.mesh;

        const rightUpperArm = BABYLON.MeshBuilder.CreateCylinder('enemyRightUpperArm', {
            diameter: 0.11,
            height: 0.35,
            tessellation: 12
        }, this.scene);
        rightUpperArm.position = new BABYLON.Vector3(0.38, 1.45, 0);
        rightUpperArm.parent = this.mesh;

        // Lower Arms - slightly thinner cylinders
        const leftLowerArm = BABYLON.MeshBuilder.CreateCylinder('enemyLeftLowerArm', {
            diameterTop: 0.09,
            diameterBottom: 0.08,
            height: 0.3,
            tessellation: 12
        }, this.scene);
        leftLowerArm.position = new BABYLON.Vector3(-0.38, 1.1, 0.15);
        leftLowerArm.rotation.x = Math.PI / 6; // Slight bend
        leftLowerArm.parent = this.mesh;

        const rightLowerArm = BABYLON.MeshBuilder.CreateCylinder('enemyRightLowerArm', {
            diameterTop: 0.09,
            diameterBottom: 0.08,
            height: 0.3,
            tessellation: 12
        }, this.scene);
        rightLowerArm.position = new BABYLON.Vector3(0.38, 1.1, 0.15);
        rightLowerArm.rotation.x = Math.PI / 6; // Slight bend
        rightLowerArm.parent = this.mesh;

        // Hands
        const leftHand = BABYLON.MeshBuilder.CreateSphere('enemyLeftHand', {
            diameter: 0.08,
            segments: 8
        }, this.scene);
        leftHand.position = new BABYLON.Vector3(-0.38, 0.95, 0.25);
        leftHand.parent = this.mesh;

        const rightHand = BABYLON.MeshBuilder.CreateSphere('enemyRightHand', {
            diameter: 0.08,
            segments: 8
        }, this.scene);
        rightHand.position = new BABYLON.Vector3(0.38, 0.95, 0.25);
        rightHand.parent = this.mesh;

        // Weapon (realistic rifle shape)
        const weaponBody = BABYLON.MeshBuilder.CreateCylinder('enemyWeaponBody', {
            diameter: 0.04,
            height: 0.6,
            tessellation: 8
        }, this.scene);
        weaponBody.rotation.x = Math.PI / 2;
        weaponBody.position = new BABYLON.Vector3(0.25, 1.1, 0.35);
        weaponBody.parent = this.mesh;

        const weaponStock = BABYLON.MeshBuilder.CreateBox('enemyWeaponStock', {
            width: 0.08,
            height: 0.06,
            depth: 0.2
        }, this.scene);
        weaponStock.position = new BABYLON.Vector3(0.25, 1.1, 0.05);
        weaponStock.parent = this.mesh;

        // Create materials
        const bodyMaterial = new BABYLON.StandardMaterial('enemyBodyMat', this.scene);
        bodyMaterial.diffuseColor = new BABYLON.Color3(0.25, 0.3, 0.25); // Dark green uniform
        bodyMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        bodyMaterial.ambientColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        const skinMaterial = new BABYLON.StandardMaterial('enemySkinMat', this.scene);
        skinMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.55, 0.45); // Skin tone
        skinMaterial.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

        const helmetMaterial = new BABYLON.StandardMaterial('enemyHelmetMat', this.scene);
        helmetMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.25, 0.2); // Dark green helmet
        helmetMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

        const bootMaterial = new BABYLON.StandardMaterial('enemyBootMat', this.scene);
        bootMaterial.diffuseColor = new BABYLON.Color3(0.15, 0.12, 0.1); // Dark brown boots
        bootMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        const weaponMaterial = new BABYLON.StandardMaterial('enemyWeaponMat', this.scene);
        weaponMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2); // Dark metal
        weaponMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        weaponMaterial.specularPower = 64;

        // Apply materials
        body.material = bodyMaterial;
        neck.material = skinMaterial;
        head.material = skinMaterial;
        helmet.material = helmetMaterial;
        leftLeg.material = bodyMaterial;
        rightLeg.material = bodyMaterial;
        leftFoot.material = bootMaterial;
        rightFoot.material = bootMaterial;
        leftUpperArm.material = bodyMaterial;
        rightUpperArm.material = bodyMaterial;
        leftLowerArm.material = bodyMaterial;
        rightLowerArm.material = bodyMaterial;
        leftHand.material = skinMaterial;
        rightHand.material = skinMaterial;
        weaponBody.material = weaponMaterial;
        weaponStock.material = bootMaterial;

        // Enable collisions and shadows
        this.mesh.checkCollisions = true;

        // Add all parts to shadow generator (will be set by LevelManager)
        this.bodyParts = [body, neck, head, helmet, leftLeg, rightLeg, leftFoot, rightFoot,
                         leftUpperArm, rightUpperArm, leftLowerArm, rightLowerArm,
                         leftHand, rightHand, weaponBody, weaponStock];

        // Store reference to this enemy component on parent and all body parts
        this.mesh.enemyComponent = this;
        this.bodyParts.forEach(part => {
            part.enemyComponent = this;
        });

        // Store head reference for headshot detection
        this.headMesh = head;
        head.isHeadshot = true;

        // Create health bar above enemy
        this.createHealthBar();
    }

    createHealthBar() {
        const plane = BABYLON.MeshBuilder.CreatePlane('healthBar', {
            width: 1,
            height: 0.1
        }, this.scene);

        plane.position = new BABYLON.Vector3(0, 2.25, 0);
        plane.parent = this.mesh;
        plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

        const healthMat = new BABYLON.StandardMaterial('healthMat', this.scene);
        healthMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
        healthMat.emissiveColor = new BABYLON.Color3(0, 0.5, 0);
        plane.material = healthMat;

        this.healthBar = plane;
    }

    setupPatrol(startPos) {
        // Create simple patrol route (square pattern) - all at ground level
        const offset = 5;
        const groundY = 0;
        this.patrolPoints = [
            new BABYLON.Vector3(startPos.x, groundY, startPos.z),
            new BABYLON.Vector3(startPos.x + offset, groundY, startPos.z),
            new BABYLON.Vector3(startPos.x + offset, groundY, startPos.z + offset),
            new BABYLON.Vector3(startPos.x, groundY, startPos.z + offset)
        ];
    }

    update(deltaTime) {
        if (!this.alive) return;

        const distanceToPlayer = BABYLON.Vector3.Distance(
            this.mesh.position,
            this.player.mesh.position
        );

        // State machine
        if (distanceToPlayer < this.attackRange) {
            this.state = 'attack';
        } else if (distanceToPlayer < this.detectionRange) {
            this.state = 'chase';
        } else {
            this.state = 'patrol';
        }

        // Execute state
        switch (this.state) {
            case 'patrol':
                this.patrol(deltaTime);
                break;
            case 'chase':
                this.chase(deltaTime);
                break;
            case 'attack':
                this.attack(deltaTime);
                break;
        }

        // Update health bar
        this.updateHealthBar();
    }

    patrol(deltaTime) {
        const targetPoint = this.patrolPoints[this.currentPatrolIndex];
        const distance = BABYLON.Vector3.Distance(this.mesh.position, targetPoint);

        if (distance < 0.5) {
            // Reached patrol point, move to next
            this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
        } else {
            // Move towards patrol point
            const direction = targetPoint.subtract(this.mesh.position).normalize();
            const movement = direction.scale(this.moveSpeed * deltaTime);
            this.mesh.position.addInPlace(movement);

            // Face movement direction
            this.mesh.lookAt(targetPoint);
        }
    }

    chase(deltaTime) {
        const playerPos = this.player.mesh.position;
        const direction = playerPos.subtract(this.mesh.position).normalize();
        const movement = direction.scale(this.moveSpeed * deltaTime);

        this.mesh.position.addInPlace(movement);
        this.mesh.lookAt(playerPos);
    }

    attack(deltaTime) {
        // Face player but don't move
        const playerPos = this.player.mesh.position;
        this.mesh.lookAt(playerPos);

        // Shoot at player
        const now = performance.now() / 1000;
        if (now - this.lastShotTime >= this.fireRate) {
            this.shootAtPlayer();
            this.lastShotTime = now;
        }
    }

    shootAtPlayer() {
        // Get weapon position (approximate)
        const weaponOffset = new BABYLON.Vector3(0.25, 0.9, 0.3);
        const weaponWorldPos = BABYLON.Vector3.TransformCoordinates(
            weaponOffset,
            this.mesh.getWorldMatrix()
        );

        // Direction to player (aim at player center)
        const playerCenter = this.player.mesh.position.add(new BABYLON.Vector3(0, 1.0, 0));
        const direction = playerCenter.subtract(weaponWorldPos).normalize();

        // First, check if there are any obstacles between enemy and player
        const ray = new BABYLON.Ray(weaponWorldPos, direction, 100);

        const obstacleCheck = this.scene.pickWithRay(ray, (mesh) => {
            // Check for level geometry (walls, floors, etc.) but not enemies or player
            return mesh.checkCollisions &&
                   !mesh.name.startsWith('enemy') &&
                   mesh.name !== 'player' &&
                   mesh !== this.player.mesh;
        });

        // If we hit an obstacle before reaching the player, the shot is blocked
        if (obstacleCheck && obstacleCheck.hit) {
            const distanceToObstacle = BABYLON.Vector3.Distance(weaponWorldPos, obstacleCheck.pickedPoint);
            const distanceToPlayer = BABYLON.Vector3.Distance(weaponWorldPos, playerCenter);

            if (distanceToObstacle < distanceToPlayer) {
                console.log('Enemy shot blocked by obstacle:', obstacleCheck.pickedMesh.name);

                // Visualize enemy shot stopping at obstacle (orange ray)
                const blockedRay = new BABYLON.Ray(weaponWorldPos, direction, distanceToObstacle);
                const rayHelper = new BABYLON.RayHelper(blockedRay);
                rayHelper.show(this.scene, new BABYLON.Color3(1, 0.5, 0));
                setTimeout(() => rayHelper.hide(), 100);

                // Create bullet impact on wall
                this.createBulletImpact(obstacleCheck.pickedPoint);
                return;
            }
        }

        // No obstacle blocking - show full ray to player
        const rayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(this.scene, new BABYLON.Color3(1, 0.5, 0));
        setTimeout(() => rayHelper.hide(), 100);

        // No obstacle blocking, now check if ray intersects with player position
        // Calculate closest point on ray to player
        const rayToPlayer = playerCenter.subtract(weaponWorldPos);
        const rayDot = BABYLON.Vector3.Dot(rayToPlayer, direction);

        if (rayDot > 0) { // Player is in front of the enemy
            const closestPoint = weaponWorldPos.add(direction.scale(rayDot));
            const distanceToRay = BABYLON.Vector3.Distance(closestPoint, playerCenter);

            // Check if ray passes close enough to player (within player radius)
            const playerRadius = 0.5; // Slightly larger than actual for easier hits
            if (distanceToRay < playerRadius && rayDot < 100) { // Within 100 units
                console.log('Enemy hit player for', this.damage, 'damage! Distance to ray:', distanceToRay.toFixed(2));
                this.player.takeDamage(this.damage);

                // Create bullet impact on player
                this.createBulletImpact(closestPoint);
            } else {
                console.log('Enemy shot missed player. Distance to ray:', distanceToRay.toFixed(2));
            }
        } else {
            console.log('Enemy shot wrong direction');
        }
    }

    createBulletImpact(position) {
        // Create particle system for bullet impact
        const particleSystem = new BABYLON.ParticleSystem("bulletImpact", 20, this.scene);

        particleSystem.emitter = position;

        // Particle appearance
        particleSystem.particleTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==", this.scene);

        particleSystem.color1 = new BABYLON.Color4(0.7, 0.7, 0.7, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.5, 0.5, 0.5, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0.3, 0.3, 0.3, 0.0);

        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.1;

        particleSystem.minLifeTime = 0.1;
        particleSystem.maxLifeTime = 0.2;

        particleSystem.emitRate = 200;

        // Random directions (explosion-like)
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.05, -0.05, -0.05);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.05, 0.05, 0.05);

        particleSystem.minEmitPower = 0.5;
        particleSystem.maxEmitPower = 2;

        particleSystem.updateSpeed = 0.01;

        particleSystem.gravity = new BABYLON.Vector3(0, -1, 0);

        // Start and auto-stop
        particleSystem.targetStopDuration = 0.05;
        particleSystem.start();

        setTimeout(() => {
            particleSystem.dispose();
        }, 300);
    }

    takeDamage(amount, isHeadshot = false) {
        if (!this.alive) return;

        if (isHeadshot) {
            console.log('HEADSHOT! Instant kill!');
            this.die();
            return true; // Return true for headshot
        }

        this.health -= amount;
        console.log(`Enemy took ${amount} damage. Health: ${this.health}/${this.maxHealth}`);

        if (this.health <= 0) {
            this.die();
        }

        return false; // Return false for body shot
    }

    updateHealthBar() {
        if (this.healthBar) {
            const healthPercent = this.health / this.maxHealth;
            this.healthBar.scaling.x = healthPercent;

            // Change color based on health
            const material = this.healthBar.material;
            if (healthPercent > 0.5) {
                material.diffuseColor = new BABYLON.Color3(0, 1, 0);
            } else if (healthPercent > 0.25) {
                material.diffuseColor = new BABYLON.Color3(1, 1, 0);
            } else {
                material.diffuseColor = new BABYLON.Color3(1, 0, 0);
            }
        }
    }

    die() {
        this.alive = false;
        console.log('Enemy died!');

        // Award coins to player (will be handled by EnemyManager)
        const coinReward = 50; // Base reward

        // Create blood particle effect
        this.createBloodEffect();

        // Apply ragdoll physics to body parts
        this.applyRagdollPhysics();

        // Play death animation with falling
        this.animateDeath();

        // Dispose after animation completes
        setTimeout(() => {
            // Dispose all body parts
            if (this.bodyParts) {
                this.bodyParts.forEach(part => {
                    if (part) part.dispose();
                });
            }
            if (this.healthBar) {
                this.healthBar.dispose();
            }
            if (this.mesh) {
                this.mesh.dispose();
            }
        }, 3000);

        return coinReward;
    }

    createBloodEffect() {
        // Create blood particle system
        const bloodSystem = new BABYLON.ParticleSystem("blood", 100, this.scene);

        // Position at head
        const headPosition = this.mesh.position.add(new BABYLON.Vector3(0, 1.8, 0));
        bloodSystem.emitter = headPosition;

        // Create simple red texture
        bloodSystem.particleTexture = new BABYLON.Texture(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
            this.scene
        );

        // Blood colors - dark red
        bloodSystem.color1 = new BABYLON.Color4(0.6, 0, 0, 1.0);
        bloodSystem.color2 = new BABYLON.Color4(0.8, 0.1, 0.1, 1.0);
        bloodSystem.colorDead = new BABYLON.Color4(0.3, 0, 0, 0.0);

        bloodSystem.minSize = 0.05;
        bloodSystem.maxSize = 0.15;

        bloodSystem.minLifeTime = 0.3;
        bloodSystem.maxLifeTime = 0.8;

        bloodSystem.emitRate = 200;

        // Spray in all directions
        bloodSystem.direction1 = new BABYLON.Vector3(-1, 0.5, -1);
        bloodSystem.direction2 = new BABYLON.Vector3(1, 2, 1);

        bloodSystem.minEmitPower = 2;
        bloodSystem.maxEmitPower = 5;

        bloodSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

        bloodSystem.updateSpeed = 0.01;

        // Start and auto-stop
        bloodSystem.targetStopDuration = 0.2;
        bloodSystem.start();

        setTimeout(() => {
            bloodSystem.dispose();
        }, 1000);
    }

    applyRagdollPhysics() {
        // Apply physics-like rotation and falling to body parts
        if (!this.bodyParts) return;

        this.bodyParts.forEach((part, index) => {
            if (!part) return;

            // Detach from parent transform to allow independent movement
            part.parent = null;

            // Store initial world position
            const worldPos = part.getAbsolutePosition().clone();
            part.position = worldPos;

            // Add random rotation velocities for ragdoll effect
            const randomRotVel = {
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.1,
                z: (Math.random() - 0.5) * 0.1
            };

            // Add slight outward velocity for parts flying apart
            const randomVel = new BABYLON.Vector3(
                (Math.random() - 0.5) * 0.5,
                Math.random() * 0.2,
                (Math.random() - 0.5) * 0.5
            );

            // Store velocities on the mesh
            part.ragdollRotVel = randomRotVel;
            part.ragdollVel = randomVel;
            part.ragdollGravity = 0;
        });
    }

    animateDeath() {
        // Animate the entire enemy falling backward
        const fallDuration = 1.5; // seconds
        const startTime = performance.now();
        const startRotation = this.mesh.rotation.clone();
        const startPosition = this.mesh.position.clone();

        const deathAnimation = () => {
            const elapsed = (performance.now() - startTime) / 1000;
            const progress = Math.min(elapsed / fallDuration, 1.0);

            if (progress < 1.0 && this.mesh) {
                // Fall backward (rotate around X axis)
                this.mesh.rotation.x = startRotation.x - (Math.PI / 2) * progress;

                // Fall down to ground
                this.mesh.position.y = startPosition.y - (startPosition.y * progress);

                // Apply ragdoll physics to individual body parts
                if (this.bodyParts) {
                    this.bodyParts.forEach(part => {
                        if (!part || !part.ragdollRotVel) return;

                        const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;

                        // Apply rotation
                        part.rotation.x += part.ragdollRotVel.x;
                        part.rotation.y += part.ragdollRotVel.y;
                        part.rotation.z += part.ragdollRotVel.z;

                        // Apply velocity and gravity
                        part.ragdollGravity -= 9.81 * deltaTime;
                        part.ragdollVel.y += part.ragdollGravity * deltaTime;
                        part.position.addInPlace(part.ragdollVel.scale(deltaTime));

                        // Stop when hitting ground
                        if (part.position.y < 0.1) {
                            part.position.y = 0.1;
                            part.ragdollVel.y = 0;
                            part.ragdollGravity = 0;
                        }
                    });
                }
            } else {
                this.scene.unregisterAfterRender(deathAnimation);
            }
        };

        this.scene.registerAfterRender(deathAnimation);
    }
}
