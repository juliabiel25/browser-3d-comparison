import os
import pandas as pd
import matplotlib.pyplot as plt

# Constants
DATA_DIR = r'H:\_UNI\magisterka\dane_14_18\og'  # Replace with the path to your folder

# Column names to compare
COLUMNS_TO_COMPARE = ['fps', 'memory used']  # Replace with actual column names

# File paths
BABYLON_FILE = os.path.join(DATA_DIR, 'babylon.csv')
# BABYLON_PERFMON_FILE = os.path.join(DATA_DIR, 'babylon-perfmon.csv')
THREE_FILE = os.path.join(DATA_DIR, 'three.csv')
# THREE_PERFMON_FILE = os.path.join(DATA_DIR, 'three-perfmon.csv')

# Load data from CSV files with the correct delimiter
babylon_df = pd.read_csv(BABYLON_FILE, delimiter=';')
# babylon_perfmon_df = pd.read_csv(BABYLON_PERFMON_FILE, delimiter=';')
three_df = pd.read_csv(THREE_FILE, delimiter=';')
# three_perfmon_df = pd.read_csv(THREE_PERFMON_FILE, delimiter=';')

# Function to convert columns to float
def convert_to_float(df, columns):
    for column in columns:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column], errors='coerce')  # Convert to float, coerce errors to NaN

# Convert columns to float
convert_to_float(babylon_df, COLUMNS_TO_COMPARE)
# convert_to_float(babylon_perfmon_df, COLUMNS_TO_COMPARE)
convert_to_float(three_df, COLUMNS_TO_COMPARE)
# convert_to_float(three_perfmon_df, COLUMNS_TO_COMPARE)
# 
# Create output directory for graphs
output_dir = os.path.join(DATA_DIR, 'graphs')
os.makedirs(output_dir, exist_ok=True)

# Generate graphs for each column in COLUMNS_TO_COMPARE
for column in COLUMNS_TO_COMPARE:
    if column in babylon_df.columns and column in three_df.columns:
        plt.figure(figsize=(10, 6))

        # Plot data from Babylon files
        plt.plot(babylon_df[column], label='Babylon')
        # plt.plot(babylon_perfmon_df[column], label='Babylon PerfMon')

        # Plot data from Three files
        plt.plot(three_df[column], label='Three')
        # plt.plot(three_perfmon_df[column], label='Three PerfMon')

        plt.title(f'Comparison of {column} between Babylon and Three')
        plt.xlabel('Index')
        plt.ylabel(column)
        plt.legend()

        # Save the graph as a PNG file
        output_file = os.path.join(output_dir, f'{column}_comparison.png')
        plt.savefig(output_file, bbox_inches='tight')
        plt.close()  # Close the figure explicitly

print(f'Graphs saved to {output_dir}')
