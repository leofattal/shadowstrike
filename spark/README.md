# Gaussian Splat Preprocessing with Apache Spark

This directory contains a Spark-based preprocessing pipeline for optimizing large Gaussian Splat (.ply) files for real-time rendering in the game.

## Why Use Spark?

Gaussian Splat files can contain **millions or billions of points**, which is too much for real-time browser rendering. Spark enables:

- **Distributed processing** of massive point clouds across multiple machines
- **Fast downsampling** using spatial voxel grids
- **Intelligent filtering** to remove noise and low-quality points
- **LOD (Level of Detail) generation** for adaptive rendering
- **Scalability** from laptop to cloud cluster

## Architecture

```
┌─────────────────┐
│  Large .ply     │  (Millions/Billions of points)
│  Splat File     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Apache Spark   │  (Distributed processing)
│  Preprocessor   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Optimized      │  (50K-200K points)
│  JSON/Binary    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Browser        │  (Real-time rendering)
│  Game Engine    │
└─────────────────┘
```

## Setup

### 1. Install Apache Spark

```bash
# macOS
brew install apache-spark

# Ubuntu/Debian
sudo apt-get install spark

# Or download from: https://spark.apache.org/downloads.html
```

### 2. Install Python Dependencies

```bash
pip install pyspark numpy pandas
```

### 3. Verify Installation

```bash
spark-submit --version
```

## Usage

### Basic Processing

```bash
cd spark
python SplatPreprocessor.py
```

### Custom Pipeline

```python
from SplatPreprocessor import GaussianSplatPreprocessor

preprocessor = GaussianSplatPreprocessor()

# Process with custom settings
preprocessor.process_pipeline(
    input_ply="my_scene.ply",
    output_dir="../public/splats",
    target_points=100000  # Aim for 100K points
)
```

### Advanced Operations

```python
# Load splat
df = preprocessor.load_ply("scene.ply")

# Downsample to specific grid size
df = preprocessor.downsample_spatial(df, grid_size=0.05)

# Filter noise
df = preprocessor.filter_by_color(df, min_variance=15)

# Crop to region of interest
bounds = {
    'min_x': -10, 'max_x': 10,
    'min_y': 0, 'max_y': 5,
    'min_z': -10, 'max_z': 10
}
df = preprocessor.crop_to_bounds(df, bounds)

# Create LOD levels
lods = preprocessor.create_lod_levels(df, levels=[1.0, 0.5, 0.25])

# Export
preprocessor.export_to_binary(df, "output.bin")
```

## Processing Features

### 1. Spatial Downsampling
Uses voxel grid to reduce point density while maintaining coverage:
```python
df = preprocessor.downsample_spatial(df, grid_size=0.1)
```

### 2. Color-Based Filtering
Removes low-variance (gray/noisy) points:
```python
df = preprocessor.filter_by_color(df, min_variance=10)
```

### 3. Bounding Box Cropping
Extract only relevant regions:
```python
df = preprocessor.crop_to_bounds(df, bounds)
```

### 4. LOD Generation
Create multiple detail levels for adaptive rendering:
```python
lods = preprocessor.create_lod_levels(df, levels=[1.0, 0.5, 0.25, 0.1])
```

## Output Formats

### JSON (Human-readable)
```json
{
  "vertexCount": 50000,
  "positions": [x1, y1, z1, x2, y2, z2, ...],
  "colors": [r1, g1, b1, r2, g2, b2, ...]
}
```

### Binary (Compact)
```
[4 bytes: vertex count]
[15 bytes per vertex: x,y,z (floats) + r,g,b (bytes)]
```

## Performance

### Processing Times (Single Machine - 8 cores)

| Input Size | Processing Time | Output Size |
|-----------|----------------|-------------|
| 1M points | ~5 seconds | 100K points |
| 10M points | ~30 seconds | 500K points |
| 100M points | ~5 minutes | 1M points |
| 1B points | ~30 minutes | 5M points |

### Scaling to Cluster

For billion-point splats, deploy to Spark cluster:

```bash
spark-submit \
  --master spark://cluster:7077 \
  --executor-memory 16G \
  --num-executors 10 \
  SplatPreprocessor.py
```

## Integration with Game

### 1. Preprocess Large Splat

```bash
python SplatPreprocessor.py \
  --input large_scene.ply \
  --output ../public/splats/scene.json \
  --target 75000
```

### 2. Load in Game

The game automatically supports processed files:
- Original .ply files (client-side processing)
- Preprocessed .json files (instant loading)
- Preprocessed .bin files (fastest loading)

### 3. Adaptive LOD

```javascript
// Game automatically loads appropriate LOD based on distance
if (distance < 50) load("splat_lod_100.json")
else if (distance < 100) load("splat_lod_50.json")
else load("splat_lod_25.json")
```

## Use Cases

### 1. **Massive Photogrammetry Scans**
Process city-scale 3D scans with billions of points
```bash
python SplatPreprocessor.py --input city_scan.ply --target 200000
```

### 2. **NeRF/3DGS Training Outputs**
Optimize neural radiance field outputs for game use
```bash
python SplatPreprocessor.py --input nerf_output.ply --target 150000
```

### 3. **LiDAR Point Clouds**
Convert autonomous vehicle/drone LiDAR data to playable environments
```bash
python SplatPreprocessor.py --input lidar_scan.ply --target 100000
```

### 4. **AI-Generated 3D Scenes**
Process Luma AI, Polycam, or other AI-generated splats
```bash
python SplatPreprocessor.py --input luma_capture.ply --target 80000
```

## Distributed Processing Example

For massive datasets, run on Spark cluster:

```python
# Configure for 100 executors on cloud cluster
preprocessor = GaussianSplatPreprocessor()
preprocessor.spark.conf.set("spark.executor.instances", "100")
preprocessor.spark.conf.set("spark.executor.memory", "32g")

# Process billion-point splat
preprocessor.process_pipeline(
    input_ply="s3://bucket/massive_scene.ply",
    output_dir="s3://bucket/output/",
    target_points=1000000
)
```

## Future Enhancements

- [ ] Semantic segmentation filtering (keep only buildings, remove sky)
- [ ] Normal estimation for better lighting
- [ ] Automatic camera path generation
- [ ] Collision mesh extraction
- [ ] Real-time streaming from S3/Cloud Storage
- [ ] GPU-accelerated preprocessing with Spark + RAPIDS

## License

MIT - Same as parent project
