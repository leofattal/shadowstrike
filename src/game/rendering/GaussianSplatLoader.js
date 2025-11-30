import * as BABYLON from '@babylonjs/core';

/**
 * GaussianSplatLoader - Loads and renders Gaussian Splat .ply files in the battlefield
 */
export class GaussianSplatLoader {
    constructor(scene) {
        this.scene = scene;
        this.splatMesh = null;
        this.pointCloud = null;
    }

    /**
     * Load a .ply file from a File object (drag-and-drop)
     */
    async loadFromFile(file) {
        console.log('Loading Gaussian Splat from file:', file.name);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const plyData = this.parsePLY(arrayBuffer);
            this.createPointCloud(plyData);
            return true;
        } catch (error) {
            console.error('Failed to load Gaussian Splat:', error);
            return false;
        }
    }

    /**
     * Parse PLY file format
     */
    parsePLY(arrayBuffer) {
        const decoder = new TextDecoder('utf-8');
        const data = decoder.decode(arrayBuffer);

        // Split header and data
        const headerEnd = data.indexOf('end_header') + 'end_header'.length;
        const header = data.substring(0, headerEnd);

        // Parse vertex count from header
        const vertexMatch = header.match(/element vertex (\d+)/);
        if (!vertexMatch) {
            throw new Error('Invalid PLY file: no vertex count found');
        }
        const vertexCount = parseInt(vertexMatch[1]);
        console.log(`Loading ${vertexCount} points`);

        // Determine if binary or ASCII
        const isBinary = header.includes('format binary');

        if (isBinary) {
            return this.parseBinaryPLY(arrayBuffer, headerEnd, vertexCount);
        } else {
            return this.parseASCIIPLY(data, headerEnd, vertexCount);
        }
    }

    /**
     * Parse binary PLY format
     */
    parseBinaryPLY(arrayBuffer, headerEnd, vertexCount) {
        const positions = new Float32Array(vertexCount * 3);
        const colors = new Float32Array(vertexCount * 3);

        const dataView = new DataView(arrayBuffer);
        let offset = headerEnd + 1; // Skip newline after header

        for (let i = 0; i < vertexCount; i++) {
            // Read position (x, y, z) as floats
            positions[i * 3] = dataView.getFloat32(offset, true);
            positions[i * 3 + 1] = dataView.getFloat32(offset + 4, true);
            positions[i * 3 + 2] = dataView.getFloat32(offset + 8, true);
            offset += 12;

            // Read color (r, g, b) as unsigned bytes
            const r = dataView.getUint8(offset) / 255.0;
            const g = dataView.getUint8(offset + 1) / 255.0;
            const b = dataView.getUint8(offset + 2) / 255.0;
            colors[i * 3] = r;
            colors[i * 3 + 1] = g;
            colors[i * 3 + 2] = b;
            offset += 3;

            // Skip any additional properties (alpha, normals, etc.)
            // Most Gaussian Splat PLYs have more data per vertex
            // For now, we'll assume basic format
        }

        return { positions, colors, vertexCount };
    }

    /**
     * Parse ASCII PLY format
     */
    parseASCIIPLY(data, headerEnd, vertexCount) {
        const positions = new Float32Array(vertexCount * 3);
        const colors = new Float32Array(vertexCount * 3);

        const lines = data.substring(headerEnd).trim().split('\n');

        for (let i = 0; i < vertexCount && i < lines.length; i++) {
            const values = lines[i].trim().split(/\s+/).map(v => parseFloat(v));

            if (values.length >= 6) {
                // Position
                positions[i * 3] = values[0];
                positions[i * 3 + 1] = values[1];
                positions[i * 3 + 2] = values[2];

                // Color (assuming RGB after position)
                colors[i * 3] = values[3] / 255.0;
                colors[i * 3 + 1] = values[4] / 255.0;
                colors[i * 3 + 2] = values[5] / 255.0;
            }
        }

        return { positions, colors, vertexCount };
    }

    /**
     * Create point cloud visualization from parsed data
     */
    async createPointCloud(plyData) {
        // Remove old point cloud if exists
        if (this.pointCloud) {
            this.pointCloud.dispose();
        }

        console.log('Creating point cloud with', plyData.vertexCount, 'points');

        // Create custom point cloud system
        const pointCloud = new BABYLON.PointsCloudSystem('gaussianSplat', 3, this.scene);

        // Add points
        pointCloud.addPoints(plyData.vertexCount, (particle, i) => {
            particle.position = new BABYLON.Vector3(
                plyData.positions[i * 3],
                plyData.positions[i * 3 + 1],
                plyData.positions[i * 3 + 2]
            );

            particle.color = new BABYLON.Color4(
                plyData.colors[i * 3],
                plyData.colors[i * 3 + 1],
                plyData.colors[i * 3 + 2],
                1.0
            );
        });

        // Build the mesh
        const mesh = await pointCloud.buildMeshAsync();
        mesh.name = 'gaussianSplatMesh';
        mesh.checkCollisions = true;

        // Create material for point cloud
        const material = new BABYLON.StandardMaterial('splatMaterial', this.scene);
        material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        material.disableLighting = true;
        material.pointsCloud = true;
        material.pointSize = 5;
        mesh.material = material;

        this.pointCloud = pointCloud;
        this.splatMesh = mesh;

        console.log('Gaussian Splat loaded successfully!');
    }

    /**
     * Clear the current splat
     */
    clear() {
        if (this.pointCloud) {
            this.pointCloud.dispose();
            this.pointCloud = null;
        }
        if (this.splatMesh) {
            this.splatMesh.dispose();
            this.splatMesh = null;
        }
    }

    /**
     * Adjust point size
     */
    setPointSize(size) {
        if (this.splatMesh && this.splatMesh.material) {
            this.splatMesh.material.pointSize = size;
        }
    }
}
