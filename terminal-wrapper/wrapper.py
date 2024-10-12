import subprocess
import sys

def run_command(command):
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    stdout, stderr = process.communicate()
    
    if process.returncode == 0:
        print("Command executed successfully.")
        print("Output:", stdout)
        return True
    else:
        print("An error occurred while executing the command.")
        print("Error message:", stderr)
        print("Return code:", process.returncode)
        return False

if len(sys.argv) > 1:
    argument = sys.argv[1]
    success = run_command(argument)
    print(f"The argument provided is: {argument}")
else:
    print("No argument provided")