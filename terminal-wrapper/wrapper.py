import subprocess
import sys
import uuid
import os
import time
from datetime import datetime
import json
import requests

api_url = "http://localhost:3000/api/newError" 

def create_user_id():
    if not os.path.isfile('user_id.txt'):
        user_id = str(uuid.uuid4())
        with open('user_id.txt', 'w') as f:
            f.write(user_id)
        return user_id
    else:
        with open('user_id.txt', 'r') as f:
            user_id = f.read()
        return user_id

def run_command(command):
    user_id = create_user_id() 
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    stdout, stderr = process.communicate()
    timestamp = datetime.fromtimestamp(time.time()) 
    if process.returncode == 0:
        print("Command executed successfully at",timestamp,". User id is",user_id)
        print("Output:", stdout)
        return True
    else:
        json_object = {
            "user_id": user_id,
            "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "command": command,
            "stderr": stderr,
        }
        requests.post(url=api_url, json=json_object)
        print("An error occurred while executing the command at",timestamp,". Everyone laugh at user " + user_id)
        print("Error message:", stderr)
        print("Return code:", process.returncode)
        
        return False

if len(sys.argv) > 1:
    argument = sys.argv[1]
    success = run_command(argument)
    print(f"The argument provided is: {argument}")
else:
    print("No argument provided")