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
        const ground = BABYLON.MeshBuilder.CreateGround('ground', {
            width: 100,
            height: 100,
            subdivisions: 50 // More subdivisions for better detail
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
        const gridSize = 10;
        const gridCount = 10;
        const lineColor = new BABYLON.Color3(0.4, 0.4, 0.4);

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

        // Store tower position for player spawn
        this.towerSpawnPosition = new BABYLON.Vector3(towerPosition.x, towerHeight + 2, towerPosition.z);
    }

    createObstacles() {
        // Create some boxes as cover with varied appearances
        const boxPositions = [
            { x: 5, z: 5 },
            { x: -5, z: 5 },
            { x: 5, z: -5 },
            { x: -5, z: -5 },
            { x: 10, z: 0 },
            { x: -10, z: 0 },
            { x: 0, z: 10 },
            { x: 0, z: -10 }
        ];

        boxPositions.forEach((pos, index) => {
            const box = BABYLON.MeshBuilder.CreateBox('obstacle', {
                width: 2,
                height: 1.5,
                depth: 2
            }, this.scene);

            box.position = new BABYLON.Vector3(pos.x, 0.75, pos.z);
            box.checkCollisions = true;

            // Create enhanced material with variation
            const material = new BABYLON.StandardMaterial('obstacleMat' + index, this.scene);
            const colorVariation = index % 3;
            if (colorVariation === 0) {
                material.diffuseColor = new BABYLON.Color3(0.45, 0.35, 0.25); // Wood crate
                material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            } else if (colorVariation === 1) {
                material.diffuseColor = new BABYLON.Color3(0.35, 0.35, 0.35); // Concrete
                material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            } else {
                material.diffuseColor = new BABYLON.Color3(0.5, 0.4, 0.3); // Metal container
                material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
                material.specularPower = 64;
            }
            material.ambientColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            box.material = material;

            // Enable shadows
            this.shadowGenerator.addShadowCaster(box);
            box.receiveShadows = true;
        });

        // Create some walls
        this.createWall(new BABYLON.Vector3(15, 1, 0), 1, 2, 10);
        this.createWall(new BABYLON.Vector3(-15, 1, 0), 1, 2, 10);
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
