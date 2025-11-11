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
        // Create a parent mesh for the entire soldier
        this.mesh = new BABYLON.TransformNode('enemy', this.scene);
        this.mesh.position = position.clone();

        // Body (torso) - made taller to reduce gap
        const body = BABYLON.MeshBuilder.CreateBox('enemyBody', {
            width: 0.5,
            height: 1.0,
            depth: 0.3
        }, this.scene);
        body.position.y = 1.1;
        body.parent = this.mesh;

        // Neck - fills the gap between head and body
        const neck = BABYLON.MeshBuilder.CreateCylinder('enemyNeck', {
            diameter: 0.18,
            height: 0.2
        }, this.scene);
        neck.position.y = 1.7;
        neck.parent = this.mesh;

        // Head
        const head = BABYLON.MeshBuilder.CreateBox('enemyHead', {
            width: 0.3,
            height: 0.3,
            depth: 0.3
        }, this.scene);
        head.position.y = 1.85;
        head.parent = this.mesh;

        // Legs
        const leftLeg = BABYLON.MeshBuilder.CreateBox('enemyLeftLeg', {
            width: 0.2,
            height: 0.6,
            depth: 0.2
        }, this.scene);
        leftLeg.position = new BABYLON.Vector3(-0.12, 0.3, 0);
        leftLeg.parent = this.mesh;

        const rightLeg = BABYLON.MeshBuilder.CreateBox('enemyRightLeg', {
            width: 0.2,
            height: 0.6,
            depth: 0.2
        }, this.scene);
        rightLeg.position = new BABYLON.Vector3(0.12, 0.3, 0);
        rightLeg.parent = this.mesh;

        // Arms
        const leftArm = BABYLON.MeshBuilder.CreateBox('enemyLeftArm', {
            width: 0.15,
            height: 0.5,
            depth: 0.15
        }, this.scene);
        leftArm.position = new BABYLON.Vector3(-0.35, 1.0, 0);
        leftArm.parent = this.mesh;

        const rightArm = BABYLON.MeshBuilder.CreateBox('enemyRightArm', {
            width: 0.15,
            height: 0.5,
            depth: 0.15
        }, this.scene);
        rightArm.position = new BABYLON.Vector3(0.35, 1.0, 0);
        rightArm.parent = this.mesh;

        // Weapon (simple rifle shape)
        const weapon = BABYLON.MeshBuilder.CreateBox('enemyWeapon', {
            width: 0.1,
            height: 0.1,
            depth: 0.6
        }, this.scene);
        weapon.position = new BABYLON.Vector3(0.25, 0.9, 0.3);
        weapon.parent = this.mesh;

        // Create materials
        const bodyMaterial = new BABYLON.StandardMaterial('enemyBodyMat', this.scene);
        bodyMaterial.diffuseColor = new BABYLON.Color3(0.25, 0.3, 0.25); // Dark green uniform
        bodyMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        bodyMaterial.ambientColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        const skinMaterial = new BABYLON.StandardMaterial('enemySkinMat', this.scene);
        skinMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.55, 0.45); // Skin tone
        skinMaterial.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

        const weaponMaterial = new BABYLON.StandardMaterial('enemyWeaponMat', this.scene);
        weaponMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2); // Dark metal
        weaponMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        weaponMaterial.specularPower = 64;

        // Apply materials
        body.material = bodyMaterial;
        neck.material = skinMaterial;
        head.material = skinMaterial;
        leftLeg.material = bodyMaterial;
        rightLeg.material = bodyMaterial;
        leftArm.material = bodyMaterial;
        rightArm.material = bodyMaterial;
        weapon.material = weaponMaterial;

        // Enable collisions and shadows
        this.mesh.checkCollisions = true;

        // Add all parts to shadow generator (will be set by LevelManager)
        this.bodyParts = [body, neck, head, leftLeg, rightLeg, leftArm, rightArm, weapon];

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

        plane.position = new BABYLON.Vector3(0, 2.3, 0);
        plane.parent = this.mesh;
        plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

        const healthMat = new BABYLON.StandardMaterial('healthMat', this.scene);
        healthMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
        healthMat.emissiveColor = new BABYLON.Color3(0, 0.5, 0);
        plane.material = healthMat;

        this.healthBar = plane;
    }

    setupPatrol(startPos) {
        // Create simple patrol route (square pattern)
        const offset = 5;
        this.patrolPoints = [
            startPos.clone(),
            startPos.add(new BABYLON.Vector3(offset, 0, 0)),
            startPos.add(new BABYLON.Vector3(offset, 0, offset)),
            startPos.add(new BABYLON.Vector3(0, 0, offset))
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

        // Create ray
        const ray = new BABYLON.Ray(weaponWorldPos, direction, 100);

        // Visualize enemy shot (orange ray)
        const rayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(this.scene, new BABYLON.Color3(1, 0.5, 0));
        setTimeout(() => rayHelper.hide(), 100);

        // Check if ray intersects with player position (since player mesh is invisible)
        // We'll do a manual distance check to player position

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

        // Play death animation (for now just dispose)
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
        }, 100);

        return coinReward;
    }
}
