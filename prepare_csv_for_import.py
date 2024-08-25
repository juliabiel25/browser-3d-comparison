import csv
import os
import glob
import subprocess

def run_relog_command(source_blg_file, target_csv_file):
    try:
        # Run the relog command to convert .blg to .csv
        relative_source = os.path.relpath(source_blg_file, "H:\\_UNI\\magisterka\\browser-3d-comparison")
        command = 'relog ' + source_blg_file + ' -f csv -o ' + target_csv_file
        print('relogging',  command)
        subprocess.run(command, check=True)
        print(f"Converted {source_blg_file} to {target_csv_file}")
    except subprocess.CalledProcessError as e:
        print(f"Error converting {source_blg_file}: {e}")
        
def convert_blg_files_to_csv(base_directory):
    for subdir in os.listdir(os.path.join(base_directory, 'perfmon')):
        subdir_path = os.path.join(base_directory, subdir)
        print('uwu', subdir_path)
        
        if not os.path.isdir(subdir_path):
            os.mkdir(subdir_path)
            
        print(f"Processing directory: {subdir_path}")
        
        # Create a corresponding .csv file path
        target_csv_file = os.path.join(base_directory, "perfmon-csv", subdir + '.csv')
        source_blg_file = os.path.join(base_directory, 'perfmon', subdir, 'DataCollector01.blg')
        
        # Run the relog command
        run_relog_command(source_blg_file, target_csv_file)
    
def remove_quotes_from_csv(input_file, output_file, encoding='utf-8', errors='replace'):
    with open(input_file, 'r', newline='', encoding=encoding, errors=errors) as infile, \
         open(output_file, 'w', newline='', encoding=encoding) as outfile:
        
        reader = csv.reader(infile)
        writer = csv.writer(outfile)
        
        # Read and write the header row as is
        header = next(reader)
        writer.writerow(header)
        
        # Process and write the remaining rows
        for row in reader:
            # Remove `"` characters from all fields in the row
            cleaned_row = [field.replace('"', '') for field in row]
            writer.writerow(cleaned_row)

def process_all_csv_files(input_directory, output_directory, encoding='utf-8', errors='replace'):
    # Ensure the output directory exists
    os.makedirs(output_directory, exist_ok=True)
    
    # Find all CSV files in the input directory
    csv_files = glob.glob(os.path.join(input_directory, '*.csv'))
    
    for csv_file in csv_files:
        # Define the output file path
        filename = os.path.basename(csv_file)
        output_file = os.path.join(output_directory, filename)
        
        # Process the file
        remove_quotes_from_csv(csv_file, output_file, encoding, errors)
        print(f"Processed {csv_file} and saved to {output_file}")

# Example usage
base_directory = "H:\\_UNI\\magisterka\\_perfmon\\24.08\\babylonjs"  # Base directory containing .blg files
csv_input_directory = "H:\\_UNI\\magisterka\\_perfmon\\24.08\\babylonjs\\perfmon-csv"  # Directory where CSV files will be located after conversion
csv_output_directory = "H:\\_UNI\\magisterka\\_perfmon\\24.08\\babylonjs\\perfmon-numerical-csv"  # Directory to save processed CSV files

# Step 1: Convert all .blg files to .csv
# convert_blg_files_to_csv(base_directory)

# Step 2: Process all .csv files to remove quotes
process_all_csv_files(csv_input_directory, csv_output_directory, encoding='utf-8', errors='replace')
