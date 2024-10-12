#!/bin/bash

timestamp() {
  date +"%s" # current time
}

# Source the username
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/keys.env" ]; then
    source "$SCRIPT_DIR/keys.env"
    echo "Username from keys.env: $username"
else
    echo "Error: keys.env file not found in $SCRIPT_DIR."
    exit 1
fi

# Generate data
command="test_command"
exit_status="1"
error_message="test error message"
timestamp=$(timestamp)
uniqueId=$(uuidgen)

# Prepare JSON payload
json_object=$(cat <<EOF
{
    "uniqueId": "$uniqueId",
    "errorData": {
        "command": "$command",
        "error": "$error_message"
    },
    "timestamp": "$timestamp",
    "username": "$username"
}
EOF
)

echo "JSON Payload: $json_object"

# Send data to server
curl -v -X POST -H "Content-Type: application/json" -d "$json_object" http://localhost:8000/errors