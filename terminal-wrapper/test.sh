#!/bin/bash

# Server URL to send errors
SERVER_URL="http://localhost:3000/errors"

# File to store the last command run
LAST_COMMAND_FILE="/tmp/last_command.txt"

UNIQUE_ID="vfhfhfh" 
USERNAME="timurtak"

# Function to send error to the server
send_error() {
    local command=$1
    local stderr_output=$2
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")

    # Data payload to send
    json_data=$(jq -n \
        --arg uniqueId "$UNIQUE_ID" \
        --arg username "$USERNAME" \
        --arg command "$command" \
        --arg error "$stderr_output" \
        '{
            "uniqueId": $uniqueId,
            "username": $username,
            "errorData": {
                "command": $command,
                "error": $error
            }
        }')

    echo "JSON data being sent to the server:"
    echo "$json_data" 

    # Send to server
    curl -X POST "$SERVER_URL" \
        -H "Content-Type: application/json" \
        -d "$json_data"
}

# Main loop to run in the background
while true; do
    # Get the last command from PROMPT_COMMAND
    if [ -f "$LAST_COMMAND_FILE" ]; then
        last_command=$(cat "$LAST_COMMAND_FILE")
        # Capture stderr output
        stderr_output=$(eval "$last_command" 2>&1 >/dev/null)
        # If there's any stderr output, send the error
        if [ ! -z "$stderr_output" ]; then
            send_error "$last_command" "$stderr_output"
        fi
        # Remove last command after processing
        rm -f "$LAST_COMMAND_FILE"
    fi
    sleep 1  # Sleep to prevent excessive CPU usage
done
