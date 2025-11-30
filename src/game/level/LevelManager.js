import * as BABYLON from '@babylonjs/core';

export class LevelManager {
    constructor(scene) {
        this.scene = scene;
    }

    async createTestLevel() {
        // Create lighting
        this.createLighting();

        // Create ground
        this.createGround();

        // Create sniper tower
        this.createSniperTower();

        // Create some obstacles/cover
        this.createObstacles();

        // Create skybox
        this.createSkybox();

        return Promise.resolve();
    }

    createLighting() {
        // Ambient light with warmer tone
        const ambientLight = new BABYLON.HemisphericLight(
            'ambientLight',
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        ambientLight.intensity = 0.4;
        ambientLight.diffuse = new BABYLON.Color3(0.8, 0.85, 1);
        ambientLight.groundColor = new BABYLON.Color3(0.2, 0.2, 0.3);

        // Directional light (sun) with better positioning
        const sunLight = new BABYLON.DirectionalLight(
            'sunLight',
            new BABYLON.Vector3(-1, -2, -1),
            this.scene
        );
        sunLight.intensity = 1.2;
        sunLight.position = new BABYLON.Vector3(30, 50, 30);
        sunLight.diffuse = new BABYLON.Color3(1, 0.95, 0.9);
        sunLight.specular = new BABYLON.Color3(1, 0.95, 0.8);

        // Enable shadows for depth
        this.shadowGenerator = new BABYLON.ShadowGenerator(2048, sunLight);
        this.shadowGenerator.useBlurExponentialShadowMap = true;
        this.shadowGenerator.blurKernel = 32;
        this.shadowGenerator.depthScale = 50;

        // Store for later use with objects
        this.sunLight = sunLight;
    }

    createGround() {
        // Large Fortnite-style map (500x500)
        const ground = BABYLON.MeshBuilder.CreateGround('ground', {
            width: 500,
            height: 500,
            subdivisions: 100
        }, this.scene);

        ground.checkCollisions = true;
        ground.receiveShadows = true;

        // Create realistic ground material with procedural texture
        const groundMaterial = new BABYLON.StandardMaterial('groundMat', this.scene);

        // Create procedural grass/dirt texture
        const groundTexture = new BABYLON.DynamicTexture('groundTexture', 512, this.scene);
        const ctx = groundTexture.getContext();

        // Fill with base dirt color
        ctx.fillStyle = '#3d5a2f';
        ctx.fillRect(0, 0, 512, 512);

        // Add grass texture with random green pixels
        for (let i = 0; i < 10000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const shade = 100 + Math.random() * 80;
            ctx.fillStyle = `rgb(${shade * 0.4}, ${shade}, ${shade * 0.3})`;
            ctx.fillRect(x, y, Math.random() * 3, Math.random() * 3);
        }

        // Add dirt patches
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const size = 10 + Math.random() * 20;
            const brown = 80 + Math.random() * 40;
            ctx.fillStyle = `rgb(${brown}, ${brown * 0.7}, ${brown * 0.5})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        groundTexture.update();

        groundMaterial.diffuseTexture = groundTexture;
        groundMaterial.diffuseTexture.uScale = 10;
        groundMaterial.diffuseTexture.vScale = 10;
        groundMaterial.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        groundMaterial.specularPower = 64;
        groundMaterial.ambientColor = new BABYLON.Color3(0.2, 0.25, 0.2);

        // Add bump map for texture
        const bumpTexture = new BABYLON.DynamicTexture('bumpTexture', 512, this.scene);
        const bumpCtx = bumpTexture.getContext();
        bumpCtx.fillStyle = '#808080';
        bumpCtx.fillRect(0, 0, 512, 512);

        // Add noise for bumps
        for (let i = 0; i < 20000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const brightness = 100 + Math.random() * 55;
            bumpCtx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            bumpCtx.fillRect(x, y, 1, 1);
        }
        bumpTexture.update();

        groundMaterial.bumpTexture = bumpTexture;
        groundMaterial.bumpTexture.uScale = 10;
        groundMaterial.bumpTexture.vScale = 10;
        groundMaterial.bumpTexture.level = 0.3;

        ground.material = groundMaterial;

        // Add a grid of lines for depth perception
        this.createGridLines();
    }

    createGridLines() {
        // Grid for larger 500x500 map
        const gridSize = 25;
        const gridCount = 10;
        const lineColor = new BABYLON.Color3(0.3, 0.3, 0.3);

        for (let i = -gridCount; i <= gridCount; i++) {
            // Lines along X axis
            const lineX = BABYLON.MeshBuilder.CreateLines('gridLineX' + i, {
                points: [
                    new BABYLON.Vector3(i * gridSize, 0.01, -gridCount * gridSize),
                    new BABYLON.Vector3(i * gridSize, 0.01, gridCount * gridSize)
                ]
            }, this.scene);
            lineX.color = lineColor;

            // Lines along Z axis
            const lineZ = BABYLON.MeshBuilder.CreateLines('gridLineZ' + i, {
                points: [
                    new BABYLON.Vector3(-gridCount * gridSize, 0.01, i * gridSize),
                    new BABYLON.Vector3(gridCount * gridSize, 0.01, i * gridSize)
                ]
            }, this.scene);
            lineZ.color = lineColor;
        }
    }

    createSniperTower() {
        const towerHeight = 15;
        const towerPosition = new BABYLON.Vector3(0, 0, -20);

        // Main tower structure (tall concrete building)
        const towerBase = BABYLON.MeshBuilder.CreateBox('towerBase', {
            width: 6,
            height: towerHeight,
            depth: 6
        }, this.scene);
        towerBase.position = new BABYLON.Vector3(towerPosition.x, towerHeight / 2, towerPosition.z);
        towerBase.checkCollisions = true;

        // Tower material - concrete building
        const towerMaterial = new BABYLON.StandardMaterial('towerMat', this.scene);
        towerMaterial.diffuseColor = new BABYLON.Color3(0.35, 0.35, 0.37);
        towerMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        towerMaterial.ambientColor = new BABYLON.Color3(0.15, 0.15, 0.15);
        towerBase.material = towerMaterial;

        // Add shadows
        this.shadowGenerator.addShadowCaster(towerBase);
        towerBase.receiveShadows = true;

        // Sniper platform on top
        const platform = BABYLON.MeshBuilder.CreateBox('sniperPlatform', {
            width: 7,
            height: 0.5,
            depth: 7
        }, this.scene);
        platform.position = new BABYLON.Vector3(towerPosition.x, towerHeight + 0.25, towerPosition.z);
        platform.checkCollisions = true;

        const platformMaterial = new BABYLON.StandardMaterial('platformMat', this.scene);
        platformMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.32);
        platformMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        platform.material = platformMaterial;

        this.shadowGenerator.addShadowCaster(platform);
        platform.receiveShadows = true;

        // Railings around the platform (4 sides)
        const railingHeight = 1.2;
        const railingThickness = 0.1;

        // Front railing
        const frontRailing = BABYLON.MeshBuilder.CreateBox('frontRailing', {
            width: 7,
            height: railingHeight,
            depth: railingThickness
        }, this.scene);
        frontRailing.position = new BABYLON.Vector3(towerPosition.x, towerHeight + railingHeight / 2 + 0.5, towerPosition.z + 3.5);
        frontRailing.checkCollisions = true;

        // Back railing
        const backRailing = BABYLON.MeshBuilder.CreateBox('backRailing', {
            width: 7,
            height: railingHeight,
            depth: railingThickness
        }, this.scene);
        backRailing.position = new BABYLON.Vector3(towerPosition.x, towerHeight + railingHeight / 2 + 0.5, towerPosition.z - 3.5);
        backRailing.checkCollisions = true;

        // Left railing
        const leftRailing = BABYLON.MeshBuilder.CreateBox('leftRailing', {
            width: railingThickness,
            height: railingHeight,
            depth: 7
        }, this.scene);
        leftRailing.position = new BABYLON.Vector3(towerPosition.x - 3.5, towerHeight + railingHeight / 2 + 0.5, towerPosition.z);
        leftRailing.checkCollisions = true;

        // Right railing
        const rightRailing = BABYLON.MeshBuilder.CreateBox('rightRailing', {
            width: railingThickness,
            height: railingHeight,
            depth: 7
        }, this.scene);
        rightRailing.position = new BABYLON.Vector3(towerPosition.x + 3.5, towerHeight + railingHeight / 2 + 0.5, towerPosition.z);
        rightRailing.checkCollisions = true;

        // Railing material
        const railingMaterial = new BABYLON.StandardMaterial('railingMat', this.scene);
        railingMaterial.diffuseColor = new BABYLON.Color3(0.25, 0.25, 0.25);
        railingMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        railingMaterial.specularPower = 64;

        frontRailing.material = railingMaterial;
        backRailing.material = railingMaterial;
        leftRailing.material = railingMaterial;
        rightRailing.material = railingMaterial;

        this.shadowGenerator.addShadowCaster(frontRailing);
        this.shadowGenerator.addShadowCaster(backRailing);
        this.shadowGenerator.addShadowCaster(leftRailing);
        this.shadowGenerator.addShadowCaster(rightRailing);

        // Add a ladder to the front of the tower
        const ladderHeight = towerHeight;
        const ladderWidth = 1.5;
        const ladderPosition = new BABYLON.Vector3(towerPosition.x, ladderHeight / 2, towerPosition.z + 3.1);

        // --- Create the visual ladder (no collisions) ---
        const ladderMaterial = new BABYLON.StandardMaterial('ladderMat', this.scene);
        ladderMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2); // Dark metal

        // Rails
        const leftRail = BABYLON.MeshBuilder.CreateBox('leftRail', { width: 0.15, height: ladderHeight, depth: 0.15 }, this.scene);
        leftRail.position = new BABYLON.Vector3(ladderPosition.x - ladderWidth / 2, ladderPosition.y, ladderPosition.z);
        leftRail.material = ladderMaterial;
        this.shadowGenerator.addShadowCaster(leftRail);

        const rightRail = BABYLON.MeshBuilder.CreateBox('rightRail', { width: 0.15, height: ladderHeight, depth: 0.15 }, this.scene);
        rightRail.position = new BABYLON.Vector3(ladderPosition.x + ladderWidth / 2, ladderPosition.y, ladderPosition.z);
        rightRail.material = ladderMaterial;
        this.shadowGenerator.addShadowCaster(rightRail);

        // Rungs
        const rungCount = 15;
        for (let i = 0; i < rungCount; i++) {
            const rung = BABYLON.MeshBuilder.CreateBox(`rung${i}`, { width: ladderWidth, height: 0.1, depth: 0.1 }, this.scene);
            const y = (i / (rungCount - 1)) * (ladderHeight - 1) + 0.5;
            rung.position = new BABYLON.Vector3(ladderPosition.x, y, ladderPosition.z);
            rung.material = ladderMaterial;
            this.shadowGenerator.addShadowCaster(rung);
        }

        // --- Create the invisible ramp for climbing ---
        const ramp = BABYLON.MeshBuilder.CreateBox('ladderRamp', { width: ladderWidth, height: 0.1, depth: ladderHeight }, this.scene);
        ramp.position = new BABYLON.Vector3(towerPosition.x, ladderHeight / 2, towerPosition.z + 2.8);
        ramp.rotation.x = -Math.PI / 2.2; // Steep angle
        ramp.checkCollisions = true;
        ramp.isVisible = false;

        // --- Create a trigger volume for the ladder ---
        const ladderTrigger = BABYLON.MeshBuilder.CreateBox('ladderTrigger', { width: ladderWidth + 1, height: ladderHeight, depth: 2 }, this.scene);
        ladderTrigger.position = new BABYLON.Vector3(ladderPosition.x, ladderPosition.y, ladderPosition.z);
        ladderTrigger.checkCollisions = false;
        ladderTrigger.isVisible = false;

        // Store tower position for player spawn (higher up to avoid being stuck)
        this.towerSpawnPosition = new BABYLON.Vector3(towerPosition.x, towerHeight + 5, towerPosition.z);
    }

    // Helper method to create a climbable ladder
    // position: where the ladder is placed (base of ladder)
    // height: how tall the ladder is
    // name: unique identifier
    // direction: 'north', 'south', 'east', 'west' - which way the player approaches from
    createLadder(position, height, name, direction = 'south') {
        const ladderWidth = 1.5;
        const ladderPosition = new BABYLON.Vector3(position.x, height / 2, position.z);

        // --- Create the visual ladder ---
        const ladderMaterial = new BABYLON.StandardMaterial('ladderMat_' + name, this.scene);
        ladderMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2); // Dark metal

        // Calculate offsets based on direction
        let rampOffsetX = 0, rampOffsetZ = 0;
        let rampRotationX = 0, rampRotationZ = 0;

        if (direction === 'south') {
            // Player approaches from +Z (south), ladder faces south
            rampOffsetZ = 0.3;
            rampRotationX = -Math.PI / 2.2;
        } else if (direction === 'north') {
            // Player approaches from -Z (north)
            rampOffsetZ = -0.3;
            rampRotationX = Math.PI / 2.2;
        } else if (direction === 'east') {
            // Player approaches from +X (east)
            rampOffsetX = 0.3;
            rampRotationZ = Math.PI / 2.2;
        } else if (direction === 'west') {
            // Player approaches from -X (west)
            rampOffsetX = -0.3;
            rampRotationZ = -Math.PI / 2.2;
        }

        // Rails
        const leftRail = BABYLON.MeshBuilder.CreateBox('leftRail_' + name, { width: 0.15, height: height, depth: 0.15 }, this.scene);
        leftRail.position = new BABYLON.Vector3(ladderPosition.x - ladderWidth / 2, ladderPosition.y, ladderPosition.z);
        leftRail.material = ladderMaterial;
        this.shadowGenerator.addShadowCaster(leftRail);

        const rightRail = BABYLON.MeshBuilder.CreateBox('rightRail_' + name, { width: 0.15, height: height, depth: 0.15 }, this.scene);
        rightRail.position = new BABYLON.Vector3(ladderPosition.x + ladderWidth / 2, ladderPosition.y, ladderPosition.z);
        rightRail.material = ladderMaterial;
        this.shadowGenerator.addShadowCaster(rightRail);

        // Rungs
        const rungCount = Math.floor(height);
        for (let i = 0; i < rungCount; i++) {
            const rung = BABYLON.MeshBuilder.CreateBox(`rung_${name}_${i}`, { width: ladderWidth, height: 0.1, depth: 0.1 }, this.scene);
            const y = (i / (rungCount - 1)) * (height - 1) + 0.5;
            rung.position = new BABYLON.Vector3(ladderPosition.x, y, ladderPosition.z);
            rung.material = ladderMaterial;
            this.shadowGenerator.addShadowCaster(rung);
        }

        // --- Create the invisible ramp for climbing ---
        const ramp = BABYLON.MeshBuilder.CreateBox('ladderRamp_' + name, { width: ladderWidth, height: 0.1, depth: height }, this.scene);
        ramp.position = new BABYLON.Vector3(position.x + rampOffsetX, height / 2, position.z + rampOffsetZ);
        ramp.rotation.x = rampRotationX;
        ramp.rotation.z = rampRotationZ;
        ramp.checkCollisions = true;
        ramp.isVisible = false;

        // --- Create a trigger volume for the ladder ---
        // Adjust trigger dimensions based on direction so it extends toward the player
        let triggerWidth, triggerDepth;
        if (direction === 'east' || direction === 'west') {
            triggerWidth = 2;  // Extends on X axis toward player
            triggerDepth = ladderWidth + 1;
        } else {
            triggerWidth = ladderWidth + 1;
            triggerDepth = 2;  // Extends on Z axis toward player
        }

        const ladderTrigger = BABYLON.MeshBuilder.CreateBox('ladderTrigger_' + name, {
            width: triggerWidth,
            height: height,
            depth: triggerDepth
        }, this.scene);
        ladderTrigger.position = new BABYLON.Vector3(ladderPosition.x, ladderPosition.y, ladderPosition.z);
        ladderTrigger.checkCollisions = false;
        ladderTrigger.isVisible = false;

        // Store ladder metadata for climbing system
        ladderTrigger.ladderDirection = direction;
        ladderTrigger.ladderHeight = height;
    }

    createObstacles() {
        // Create Fortnite-style buildings across the map
        this.createBuildings();

        // Create scattered cover objects
        this.createCoverObjects();

        // Create walls and barriers
        this.createBarriers();
    }

    createBuildings() {
        // Building locations spread across 500x500 map
        const buildingLocations = [
            { x: -150, z: -150, type: 'house' },
            { x: 150, z: -150, type: 'warehouse' },
            { x: -150, z: 150, type: 'house' },
            { x: 150, z: 150, type: 'warehouse' },
            { x: 0, z: 100, type: 'tower' },
            { x: 0, z: -100, type: 'tower' },
            { x: -100, z: 0, type: 'house' },
            { x: 100, z: 0, type: 'warehouse' },
            { x: -80, z: -80, type: 'house' },
            { x: 80, z: 80, type: 'house' },
            { x: -80, z: 80, type: 'warehouse' },
            { x: 80, z: -80, type: 'warehouse' },
        ];

        buildingLocations.forEach((loc, index) => {
            if (loc.type === 'house') {
                this.createHouse(new BABYLON.Vector3(loc.x, 0, loc.z), index);
            } else if (loc.type === 'warehouse') {
                this.createWarehouse(new BABYLON.Vector3(loc.x, 0, loc.z), index);
            } else if (loc.type === 'tower') {
                this.createWatchTower(new BABYLON.Vector3(loc.x, 0, loc.z), index);
            }
        });
    }

    createHouse(position, index) {
        // Two-story house with enterable interior
        const houseWidth = 12;
        const houseDepth = 10;
        const floorHeight = 4;
        const wallThickness = 0.3;
        const doorWidth = 2.5;
        const doorHeight = 3;

        // Materials
        const wallMat = new BABYLON.StandardMaterial('houseMat' + index, this.scene);
        wallMat.diffuseColor = new BABYLON.Color3(0.7, 0.65, 0.6);
        wallMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        const roofMat = new BABYLON.StandardMaterial('roofMat' + index, this.scene);
        roofMat.diffuseColor = new BABYLON.Color3(0.4, 0.25, 0.2);
        roofMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        const floorMat = new BABYLON.StandardMaterial('floorMat' + index, this.scene);
        floorMat.diffuseColor = new BABYLON.Color3(0.5, 0.4, 0.3);

        // Helper function to create wall with collision
        const createWall = (name, width, height, depth, pos) => {
            const wall = BABYLON.MeshBuilder.CreateBox(name, { width, height, depth }, this.scene);
            wall.position = pos;
            wall.material = wallMat;
            wall.checkCollisions = true;
            this.shadowGenerator.addShadowCaster(wall);
            wall.receiveShadows = true;
            return wall;
        };

        // First floor walls with door opening on front (positive Z)
        // Back wall (full)
        createWall('houseBack_' + index, houseWidth, floorHeight, wallThickness,
            new BABYLON.Vector3(position.x, floorHeight / 2, position.z - houseDepth / 2));

        // Front wall - left section
        createWall('houseFrontL_' + index, (houseWidth - doorWidth) / 2, floorHeight, wallThickness,
            new BABYLON.Vector3(position.x - (houseWidth + doorWidth) / 4, floorHeight / 2, position.z + houseDepth / 2));

        // Front wall - right section
        createWall('houseFrontR_' + index, (houseWidth - doorWidth) / 2, floorHeight, wallThickness,
            new BABYLON.Vector3(position.x + (houseWidth + doorWidth) / 4, floorHeight / 2, position.z + houseDepth / 2));

        // Front wall - above door
        createWall('houseFrontTop_' + index, doorWidth, floorHeight - doorHeight, wallThickness,
            new BABYLON.Vector3(position.x, floorHeight - (floorHeight - doorHeight) / 2, position.z + houseDepth / 2));

        // Left wall (full)
        createWall('houseLeft_' + index, wallThickness, floorHeight, houseDepth,
            new BABYLON.Vector3(position.x - houseWidth / 2, floorHeight / 2, position.z));

        // Right wall (full)
        createWall('houseRight_' + index, wallThickness, floorHeight, houseDepth,
            new BABYLON.Vector3(position.x + houseWidth / 2, floorHeight / 2, position.z));

        // Second floor platform
        const floor2 = BABYLON.MeshBuilder.CreateBox('houseFloor2_' + index, {
            width: houseWidth,
            height: 0.3,
            depth: houseDepth
        }, this.scene);
        floor2.position = new BABYLON.Vector3(position.x, floorHeight, position.z);
        floor2.material = floorMat;
        floor2.checkCollisions = true;
        this.shadowGenerator.addShadowCaster(floor2);

        // Second floor walls (with window openings)
        // Back wall
        createWall('house2Back_' + index, houseWidth, floorHeight, wallThickness,
            new BABYLON.Vector3(position.x, floorHeight + floorHeight / 2, position.z - houseDepth / 2));

        // Front wall with window opening
        createWall('house2FrontL_' + index, houseWidth / 3, floorHeight, wallThickness,
            new BABYLON.Vector3(position.x - houseWidth / 3, floorHeight + floorHeight / 2, position.z + houseDepth / 2));
        createWall('house2FrontR_' + index, houseWidth / 3, floorHeight, wallThickness,
            new BABYLON.Vector3(position.x + houseWidth / 3, floorHeight + floorHeight / 2, position.z + houseDepth / 2));
        createWall('house2FrontTop_' + index, houseWidth / 3, floorHeight / 2, wallThickness,
            new BABYLON.Vector3(position.x, floorHeight + floorHeight * 0.75, position.z + houseDepth / 2));

        // Left wall
        createWall('house2Left_' + index, wallThickness, floorHeight, houseDepth,
            new BABYLON.Vector3(position.x - houseWidth / 2, floorHeight + floorHeight / 2, position.z));

        // Right wall
        createWall('house2Right_' + index, wallThickness, floorHeight, houseDepth,
            new BABYLON.Vector3(position.x + houseWidth / 2, floorHeight + floorHeight / 2, position.z));

        // Roof
        const roof = BABYLON.MeshBuilder.CreateBox('roof_' + index, {
            width: houseWidth + 1,
            height: 0.5,
            depth: houseDepth + 1
        }, this.scene);
        roof.position = new BABYLON.Vector3(position.x, floorHeight * 2 + 0.25, position.z);
        roof.material = roofMat;
        roof.checkCollisions = true;
        this.shadowGenerator.addShadowCaster(roof);
        roof.receiveShadows = true;

        // Stairs inside (simple ramp)
        const stairs = BABYLON.MeshBuilder.CreateBox('stairs_' + index, {
            width: 2,
            height: 0.3,
            depth: 4
        }, this.scene);
        stairs.position = new BABYLON.Vector3(position.x + 3, floorHeight / 2, position.z - 2);
        stairs.rotation.x = -Math.PI / 6; // Ramp angle
        stairs.material = floorMat;
        stairs.checkCollisions = true;

        // Add exterior ladder on the front of the house for roof access
        this.createLadder(
            new BABYLON.Vector3(position.x - houseWidth / 2 - 0.1, 0, position.z),
            floorHeight * 2,
            'house_' + index,
            'west'  // Player approaches from outside the house (negative X)
        );
    }

    createWarehouse(position, index) {
        // Large industrial warehouse with enterable interior
        const warehouseWidth = 20;
        const warehouseDepth = 15;
        const warehouseHeight = 8;
        const wallThickness = 0.4;
        const doorWidth = 6; // Large garage door
        const doorHeight = 5;

        const metalMat = new BABYLON.StandardMaterial('warehouseMat' + index, this.scene);
        metalMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.55);
        metalMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        metalMat.specularPower = 32;

        const floorMat = new BABYLON.StandardMaterial('warehouseFloor' + index, this.scene);
        floorMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);

        // Helper function to create wall with collision
        const createWall = (name, width, height, depth, pos) => {
            const wall = BABYLON.MeshBuilder.CreateBox(name, { width, height, depth }, this.scene);
            wall.position = pos;
            wall.material = metalMat;
            wall.checkCollisions = true;
            this.shadowGenerator.addShadowCaster(wall);
            wall.receiveShadows = true;
            return wall;
        };

        // Back wall (full)
        createWall('warehouseBack_' + index, warehouseWidth, warehouseHeight, wallThickness,
            new BABYLON.Vector3(position.x, warehouseHeight / 2, position.z - warehouseDepth / 2));

        // Front wall with large garage door opening
        createWall('warehouseFrontL_' + index, (warehouseWidth - doorWidth) / 2, warehouseHeight, wallThickness,
            new BABYLON.Vector3(position.x - (warehouseWidth + doorWidth) / 4, warehouseHeight / 2, position.z + warehouseDepth / 2));
        createWall('warehouseFrontR_' + index, (warehouseWidth - doorWidth) / 2, warehouseHeight, wallThickness,
            new BABYLON.Vector3(position.x + (warehouseWidth + doorWidth) / 4, warehouseHeight / 2, position.z + warehouseDepth / 2));
        createWall('warehouseFrontTop_' + index, doorWidth, warehouseHeight - doorHeight, wallThickness,
            new BABYLON.Vector3(position.x, warehouseHeight - (warehouseHeight - doorHeight) / 2, position.z + warehouseDepth / 2));

        // Left wall with side door
        const sideDoorWidth = 2;
        const sideDoorHeight = 3;
        createWall('warehouseLeftFront_' + index, wallThickness, warehouseHeight, (warehouseDepth - sideDoorWidth) / 2,
            new BABYLON.Vector3(position.x - warehouseWidth / 2, warehouseHeight / 2, position.z + (warehouseDepth + sideDoorWidth) / 4));
        createWall('warehouseLeftBack_' + index, wallThickness, warehouseHeight, (warehouseDepth - sideDoorWidth) / 2,
            new BABYLON.Vector3(position.x - warehouseWidth / 2, warehouseHeight / 2, position.z - (warehouseDepth + sideDoorWidth) / 4));
        createWall('warehouseLeftTop_' + index, wallThickness, warehouseHeight - sideDoorHeight, sideDoorWidth,
            new BABYLON.Vector3(position.x - warehouseWidth / 2, warehouseHeight - (warehouseHeight - sideDoorHeight) / 2, position.z));

        // Right wall (full)
        createWall('warehouseRight_' + index, wallThickness, warehouseHeight, warehouseDepth,
            new BABYLON.Vector3(position.x + warehouseWidth / 2, warehouseHeight / 2, position.z));

        // Roof
        const roof = BABYLON.MeshBuilder.CreateBox('warehouseRoof_' + index, {
            width: warehouseWidth + 2,
            height: 0.5,
            depth: warehouseDepth + 2
        }, this.scene);
        roof.position = new BABYLON.Vector3(position.x, warehouseHeight + 0.25, position.z);
        roof.material = metalMat;
        roof.checkCollisions = true;
        this.shadowGenerator.addShadowCaster(roof);

        // Loading dock / ramp at front entrance
        const dock = BABYLON.MeshBuilder.CreateBox('dock_' + index, {
            width: doorWidth + 2,
            height: 0.5,
            depth: 3
        }, this.scene);
        dock.position = new BABYLON.Vector3(position.x, 0.25, position.z + warehouseDepth / 2 + 1.5);
        dock.material = floorMat;
        dock.checkCollisions = true;
        this.shadowGenerator.addShadowCaster(dock);

        // Interior crates for cover
        const crateMat = new BABYLON.StandardMaterial('crateMat' + index, this.scene);
        crateMat.diffuseColor = new BABYLON.Color3(0.45, 0.35, 0.25);

        // Stack of crates inside
        const cratePositions = [
            { x: -5, z: -3 },
            { x: 5, z: -3 },
            { x: 0, z: 0 }
        ];

        cratePositions.forEach((cp, i) => {
            const crate = BABYLON.MeshBuilder.CreateBox('warehouseCrate_' + index + '_' + i, {
                width: 2,
                height: 2,
                depth: 2
            }, this.scene);
            crate.position = new BABYLON.Vector3(position.x + cp.x, 1, position.z + cp.z);
            crate.material = crateMat;
            crate.checkCollisions = true;
            this.shadowGenerator.addShadowCaster(crate);
        });

        // Add ladder on the back of the warehouse for roof access
        this.createLadder(
            new BABYLON.Vector3(position.x, 0, position.z - warehouseDepth / 2 - 0.1),
            warehouseHeight,
            'warehouse_' + index,
            'north'  // Player approaches from behind the warehouse
        );
    }

    createWatchTower(position, index) {
        // Tall watch tower for sniping
        const towerHeight = 20;
        const towerWidth = 4;

        const concreteMat = new BABYLON.StandardMaterial('towerMat' + index, this.scene);
        concreteMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.42);
        concreteMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        // Tower base
        const base = BABYLON.MeshBuilder.CreateBox('watchTower_' + index, {
            width: towerWidth,
            height: towerHeight,
            depth: towerWidth
        }, this.scene);
        base.position = new BABYLON.Vector3(position.x, towerHeight / 2, position.z);
        base.material = concreteMat;
        base.checkCollisions = true;
        this.shadowGenerator.addShadowCaster(base);
        base.receiveShadows = true;

        // Platform on top
        const platform = BABYLON.MeshBuilder.CreateBox('watchPlatform_' + index, {
            width: towerWidth + 2,
            height: 0.5,
            depth: towerWidth + 2
        }, this.scene);
        platform.position = new BABYLON.Vector3(position.x, towerHeight + 0.25, position.z);
        platform.material = concreteMat;
        platform.checkCollisions = true;
        this.shadowGenerator.addShadowCaster(platform);

        // Railings
        const railMat = new BABYLON.StandardMaterial('railMat' + index, this.scene);
        railMat.diffuseColor = new BABYLON.Color3(0.25, 0.25, 0.25);

        const railings = [
            { x: 0, z: (towerWidth + 2) / 2 },
            { x: 0, z: -(towerWidth + 2) / 2 },
            { x: (towerWidth + 2) / 2, z: 0, rotY: Math.PI / 2 },
            { x: -(towerWidth + 2) / 2, z: 0, rotY: Math.PI / 2 }
        ];

        railings.forEach((r, i) => {
            const rail = BABYLON.MeshBuilder.CreateBox('rail_' + index + '_' + i, {
                width: towerWidth + 2,
                height: 1,
                depth: 0.1
            }, this.scene);
            rail.position = new BABYLON.Vector3(
                position.x + r.x,
                towerHeight + 1,
                position.z + r.z
            );
            if (r.rotY) rail.rotation.y = r.rotY;
            rail.material = railMat;
            rail.checkCollisions = true;
        });

        // Add ladder to the watch tower
        this.createLadder(
            new BABYLON.Vector3(position.x, 0, position.z + towerWidth / 2 + 0.1),
            towerHeight,
            'watchTower_' + index
        );
    }

    createCoverObjects() {
        // Scattered cover across the map
        const coverPositions = [];

        // Generate random cover positions
        for (let i = 0; i < 50; i++) {
            coverPositions.push({
                x: (Math.random() - 0.5) * 400,
                z: (Math.random() - 0.5) * 400,
                type: Math.floor(Math.random() * 3)
            });
        }

        coverPositions.forEach((pos, index) => {
            let cover;
            const material = new BABYLON.StandardMaterial('coverMat' + index, this.scene);

            if (pos.type === 0) {
                // Crate
                cover = BABYLON.MeshBuilder.CreateBox('crate_' + index, {
                    width: 2,
                    height: 1.5,
                    depth: 2
                }, this.scene);
                cover.position = new BABYLON.Vector3(pos.x, 0.75, pos.z);
                material.diffuseColor = new BABYLON.Color3(0.45, 0.35, 0.25);
            } else if (pos.type === 1) {
                // Barrel
                cover = BABYLON.MeshBuilder.CreateCylinder('barrel_' + index, {
                    diameter: 1.2,
                    height: 1.5
                }, this.scene);
                cover.position = new BABYLON.Vector3(pos.x, 0.75, pos.z);
                material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
            } else {
                // Concrete barrier
                cover = BABYLON.MeshBuilder.CreateBox('barrier_' + index, {
                    width: 3,
                    height: 1.2,
                    depth: 0.8
                }, this.scene);
                cover.position = new BABYLON.Vector3(pos.x, 0.6, pos.z);
                cover.rotation.y = Math.random() * Math.PI;
                material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            }

            material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            cover.material = material;
            cover.checkCollisions = true;
            this.shadowGenerator.addShadowCaster(cover);
            cover.receiveShadows = true;
        });
    }

    createBarriers() {
        // Create long walls/barriers around the map perimeter
        const barrierMat = new BABYLON.StandardMaterial('barrierMat', this.scene);
        barrierMat.diffuseColor = new BABYLON.Color3(0.35, 0.35, 0.35);

        // Perimeter walls (low walls to mark boundaries)
        const walls = [
            { x: 0, z: 230, w: 460, h: 3, d: 2 },
            { x: 0, z: -230, w: 460, h: 3, d: 2 },
            { x: 230, z: 0, w: 2, h: 3, d: 460 },
            { x: -230, z: 0, w: 2, h: 3, d: 460 }
        ];

        walls.forEach((w, i) => {
            const wall = BABYLON.MeshBuilder.CreateBox('perimeterWall_' + i, {
                width: w.w,
                height: w.h,
                depth: w.d
            }, this.scene);
            wall.position = new BABYLON.Vector3(w.x, w.h / 2, w.z);
            wall.material = barrierMat;
            wall.checkCollisions = true;
            this.shadowGenerator.addShadowCaster(wall);
            wall.receiveShadows = true;
        });

        // Internal walls for tactical cover
        const internalWalls = [
            { x: 50, z: 50, rotation: 0 },
            { x: -50, z: 50, rotation: Math.PI / 4 },
            { x: 50, z: -50, rotation: -Math.PI / 4 },
            { x: -50, z: -50, rotation: 0 },
        ];

        internalWalls.forEach((w, i) => {
            const wall = this.createWall(
                new BABYLON.Vector3(w.x, 1.5, w.z),
                0.5, 3, 8
            );
            wall.rotation.y = w.rotation;
        });

        // Add standalone ladders at strategic positions around the map
        // These lead up to elevated platforms for sniping positions
        const standaloneLadderPositions = [
            { x: -200, z: -200, height: 12 },
            { x: 200, z: 200, height: 12 },
            { x: -200, z: 200, height: 10 },
            { x: 200, z: -200, height: 10 },
            { x: 0, z: 180, height: 8 },
            { x: 0, z: -180, height: 8 },
            { x: 180, z: 0, height: 10 },
            { x: -180, z: 0, height: 10 },
        ];

        standaloneLadderPositions.forEach((pos, index) => {
            // Create a small platform at the top
            const platformMat = new BABYLON.StandardMaterial('standalonePlatformMat_' + index, this.scene);
            platformMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.32);

            const platform = BABYLON.MeshBuilder.CreateBox('standalonePlatform_' + index, {
                width: 4,
                height: 0.5,
                depth: 4
            }, this.scene);
            platform.position = new BABYLON.Vector3(pos.x, pos.height, pos.z);
            platform.material = platformMat;
            platform.checkCollisions = true;
            this.shadowGenerator.addShadowCaster(platform);

            // Create support pole
            const pole = BABYLON.MeshBuilder.CreateBox('standalonePole_' + index, {
                width: 0.5,
                height: pos.height,
                depth: 0.5
            }, this.scene);
            pole.position = new BABYLON.Vector3(pos.x, pos.height / 2, pos.z);
            pole.material = platformMat;
            pole.checkCollisions = true;
            this.shadowGenerator.addShadowCaster(pole);

            // Create the ladder
            this.createLadder(
                new BABYLON.Vector3(pos.x, 0, pos.z + 2.1),
                pos.height,
                'standalone_' + index
            );
        });
    }

    createWall(position, width, height, depth) {
        const wall = BABYLON.MeshBuilder.CreateBox('wall', {
            width: width,
            height: height,
            depth: depth
        }, this.scene);

        wall.position = position;
        wall.checkCollisions = true;

        const material = new BABYLON.StandardMaterial('wallMat' + position.x, this.scene);
        material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.42);
        material.specularColor = new BABYLON.Color3(0.15, 0.15, 0.15);
        material.specularPower = 32;
        material.ambientColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        wall.material = material;

        // Enable shadows
        this.shadowGenerator.addShadowCaster(wall);
        wall.receiveShadows = true;

        return wall;
    }

    createSkybox() {
        // Create main skybox
        const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 1000 }, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial('skyBoxMat', this.scene);

        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        // Realistic daytime sky color
        skyboxMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.6, 0.9);

        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;

        // Add procedural clouds using particle system
        this.createClouds();

        // Add distant mountains/hills
        this.createDistantTerrain();

        // Add some atmospheric fog
        this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        this.scene.fogDensity = 0.0015;
        this.scene.fogColor = new BABYLON.Color3(0.6, 0.7, 0.85);
    }

    createClouds() {
        // Create simple cloud sprites using planes
        for (let i = 0; i < 20; i++) {
            const cloud = BABYLON.MeshBuilder.CreatePlane('cloud' + i, { size: 50 }, this.scene);

            // Position clouds randomly in the sky
            cloud.position = new BABYLON.Vector3(
                (Math.random() - 0.5) * 400,
                80 + Math.random() * 40,
                (Math.random() - 0.5) * 400
            );

            cloud.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

            const cloudMaterial = new BABYLON.StandardMaterial('cloudMat' + i, this.scene);
            cloudMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
            cloudMaterial.emissiveColor = new BABYLON.Color3(0.9, 0.9, 0.95);
            cloudMaterial.alpha = 0.3 + Math.random() * 0.3;
            cloudMaterial.disableLighting = true;
            cloud.material = cloudMaterial;
        }
    }

    createDistantTerrain() {
        // Create distant mountain silhouettes
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const distance = 300;

            const mountain = BABYLON.MeshBuilder.CreateBox('mountain' + i, {
                width: 80,
                height: 30 + Math.random() * 40,
                depth: 40
            }, this.scene);

            mountain.position = new BABYLON.Vector3(
                Math.cos(angle) * distance,
                15,
                Math.sin(angle) * distance
            );

            const mountainMat = new BABYLON.StandardMaterial('mountainMat' + i, this.scene);
            mountainMat.diffuseColor = new BABYLON.Color3(0.3, 0.35, 0.3);
            mountainMat.emissiveColor = new BABYLON.Color3(0.2, 0.25, 0.2);
            mountainMat.specularColor = new BABYLON.Color3(0, 0, 0);
            mountain.material = mountainMat;
        }

        // Add some distant trees/forest
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 150 + Math.random() * 100;

            const tree = BABYLON.MeshBuilder.CreateCylinder('tree' + i, {
                diameterTop: 0,
                diameterBottom: 3,
                height: 15 + Math.random() * 10,
                tessellation: 8
            }, this.scene);

            tree.position = new BABYLON.Vector3(
                Math.cos(angle) * distance,
                7,
                Math.sin(angle) * distance
            );

            const treeMat = new BABYLON.StandardMaterial('treeMat' + i, this.scene);
            treeMat.diffuseColor = new BABYLON.Color3(0.15, 0.3, 0.15);
            treeMat.specularColor = new BABYLON.Color3(0, 0, 0);
            tree.material = treeMat;
        }
    }
}
