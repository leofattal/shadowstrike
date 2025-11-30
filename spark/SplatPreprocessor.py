"""
Gaussian Splat Preprocessor using Apache Spark
Processes large .ply files for optimized real-time rendering in the game
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, udf, struct, explode
from pyspark.sql.types import StructType, StructField, FloatType, IntegerType, ArrayType
import struct as pystruct
import numpy as np

class GaussianSplatPreprocessor:
    def __init__(self):
        self.spark = SparkSession.builder \
            .appName("GaussianSplatPreprocessor") \
            .config("spark.driver.memory", "4g") \
            .config("spark.executor.memory", "8g") \
            .getOrCreate()

    def load_ply(self, ply_path):
        """
        Load PLY file using Spark for distributed processing
        """
        # Read binary PLY file
        with open(ply_path, 'rb') as f:
            header = self._parse_header(f)
            vertex_count = header['vertex_count']

            # Read all vertices
            vertices = []
            for i in range(vertex_count):
                vertex = self._read_vertex(f)
                vertices.append(vertex)

        # Create Spark DataFrame
        schema = StructType([
            StructField("x", FloatType(), False),
            StructField("y", FloatType(), False),
            StructField("z", FloatType(), False),
            StructField("r", IntegerType(), False),
            StructField("g", IntegerType(), False),
            StructField("b", IntegerType(), False),
        ])

        df = self.spark.createDataFrame(vertices, schema)
        print(f"✅ Loaded {vertex_count} points into Spark DataFrame")
        return df

    def _parse_header(self, f):
        """Parse PLY header"""
        header_lines = []
        while True:
            line = f.readline().decode('utf-8').strip()
            header_lines.append(line)
            if line == 'end_header':
                break

        vertex_count = 0
        for line in header_lines:
            if line.startswith('element vertex'):
                vertex_count = int(line.split()[-1])

        return {'vertex_count': vertex_count}

    def _read_vertex(self, f):
        """Read a single vertex from binary PLY"""
        # x, y, z as floats (12 bytes)
        x, y, z = pystruct.unpack('fff', f.read(12))
        # r, g, b as unsigned bytes (3 bytes)
        r, g, b = pystruct.unpack('BBB', f.read(3))

        return (float(x), float(y), float(z), int(r), int(g), int(b))

    def downsample_spatial(self, df, grid_size=0.1):
        """
        Downsample by spatial voxel grid
        Reduces point density while maintaining coverage
        """
        print(f"🔧 Downsampling with grid size {grid_size}...")

        # Create voxel grid coordinates
        df_voxel = df.withColumn("vx", (col("x") / grid_size).cast("int")) \
                     .withColumn("vy", (col("y") / grid_size).cast("int")) \
                     .withColumn("vz", (col("z") / grid_size).cast("int"))

        # Take first point in each voxel
        df_downsampled = df_voxel.dropDuplicates(["vx", "vy", "vz"]) \
                                 .drop("vx", "vy", "vz")

        original_count = df.count()
        new_count = df_downsampled.count()
        reduction = ((original_count - new_count) / original_count) * 100

        print(f"✅ Reduced from {original_count:,} to {new_count:,} points ({reduction:.1f}% reduction)")
        return df_downsampled

    def filter_by_color(self, df, min_variance=10):
        """
        Filter out low-variance color points (usually noise)
        """
        print(f"🔧 Filtering low-variance colors (threshold={min_variance})...")

        @udf(returnType=FloatType())
        def color_variance(r, g, b):
            colors = [float(r), float(g), float(b)]
            mean = sum(colors) / len(colors)
            variance = sum((c - mean) ** 2 for c in colors) / len(colors)
            return variance

        df_filtered = df.withColumn("color_var", color_variance(col("r"), col("g"), col("b"))) \
                       .filter(col("color_var") > min_variance) \
                       .drop("color_var")

        original_count = df.count()
        new_count = df_filtered.count()
        removed = original_count - new_count

        print(f"✅ Removed {removed:,} low-variance points")
        return df_filtered

    def crop_to_bounds(self, df, bounds):
        """
        Crop splat to bounding box
        bounds: dict with 'min_x', 'max_x', 'min_y', 'max_y', 'min_z', 'max_z'
        """
        print(f"🔧 Cropping to bounds: {bounds}")

        df_cropped = df.filter(
            (col("x") >= bounds['min_x']) & (col("x") <= bounds['max_x']) &
            (col("y") >= bounds['min_y']) & (col("y") <= bounds['max_y']) &
            (col("z") >= bounds['min_z']) & (col("z") <= bounds['max_z'])
        )

        original_count = df.count()
        new_count = df_cropped.count()

        print(f"✅ Kept {new_count:,} of {original_count:,} points within bounds")
        return df_cropped

    def create_lod_levels(self, df, levels=[1.0, 0.5, 0.25, 0.1]):
        """
        Create multiple Level-of-Detail versions
        Returns dict of {lod_name: dataframe}
        """
        print(f"🔧 Creating {len(levels)} LOD levels...")

        lod_dfs = {}
        for level in levels:
            grid_size = 0.05 / level  # Smaller level = larger grid = fewer points
            lod_name = f"lod_{int(level * 100)}"
            lod_dfs[lod_name] = self.downsample_spatial(df, grid_size)

        return lod_dfs

    def export_to_json(self, df, output_path):
        """
        Export processed splat to JSON for web loading
        """
        print(f"💾 Exporting to {output_path}...")

        # Convert to pandas for easier JSON export
        pdf = df.toPandas()

        # Create compact JSON structure
        output = {
            "vertexCount": len(pdf),
            "positions": pdf[['x', 'y', 'z']].values.flatten().tolist(),
            "colors": pdf[['r', 'g', 'b']].values.flatten().tolist()
        }

        import json
        with open(output_path, 'w') as f:
            json.dump(output, f, separators=(',', ':'))

        print(f"✅ Exported {len(pdf):,} points to {output_path}")

    def export_to_binary(self, df, output_path):
        """
        Export to compact binary format for fastest loading
        """
        print(f"💾 Exporting to binary {output_path}...")

        pdf = df.toPandas()

        with open(output_path, 'wb') as f:
            # Write header: vertex count (4 bytes)
            f.write(pystruct.pack('I', len(pdf)))

            # Write all vertices
            for _, row in pdf.iterrows():
                # Position: 3 floats (12 bytes)
                f.write(pystruct.pack('fff', row['x'], row['y'], row['z']))
                # Color: 3 bytes
                f.write(pystruct.pack('BBB', row['r'], row['g'], row['b']))

        print(f"✅ Exported {len(pdf):,} points to binary format")

    def process_pipeline(self, input_ply, output_dir, target_points=100000):
        """
        Full processing pipeline
        """
        print(f"\n🚀 Starting Gaussian Splat preprocessing pipeline")
        print(f"   Input: {input_ply}")
        print(f"   Target: {target_points:,} points\n")

        # Load
        df = self.load_ply(input_ply)

        # Calculate required downsampling
        current_count = df.count()
        reduction_factor = target_points / current_count
        grid_size = 0.1 / (reduction_factor ** (1/3))  # Cubic root for 3D

        # Downsample
        df = self.downsample_spatial(df, grid_size)

        # Filter
        df = self.filter_by_color(df)

        # Create LODs
        lod_dfs = self.create_lod_levels(df)

        # Export main file
        self.export_to_json(df, f"{output_dir}/splat_main.json")
        self.export_to_binary(df, f"{output_dir}/splat_main.bin")

        # Export LODs
        for lod_name, lod_df in lod_dfs.items():
            self.export_to_json(lod_df, f"{output_dir}/{lod_name}.json")

        print(f"\n✅ Pipeline complete! Files saved to {output_dir}/")

        return df

def main():
    """Example usage"""
    preprocessor = GaussianSplatPreprocessor()

    # Process a large splat file
    preprocessor.process_pipeline(
        input_ply="input/large_scene.ply",
        output_dir="output",
        target_points=50000
    )

if __name__ == "__main__":
    main()
