#!/bin/bash

# Create a temporary rcfile with the traps and functions
temp_rcfile=$(mktemp)

# Write the functions and traps into the temp rcfile
cat << 'EOF' > "$temp_rcfile"
# Source the user's bashrc
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi

# Function to get the current timestamp
timestamp() {
    date +"%s" # current time in seconds since epoch
}

# Function to send error data to the server
send_error() {
    local command="$1"
    local exit_status="$2"
    local error_message="$3"
    local timestamp=$(timestamp)
    local uniqueId=$(uuidgen)

    # Source the keys.env file to get the username
    if [ -f ~/keys.env ]; then
        source ~/keys.env
    else
        echo "Error: keys.env file not found."
        return
    fi

    # Ensure username is set
    if [ -z "$username" ]; then
        echo "Error: username not set in keys.env."
        return
    fi

    # Escape JSON special characters using jq
    local escaped_command=$(printf '%s' "$command" | jq -Rs .)
    local escaped_error_message=$(printf '%s' "$error_message" | jq -Rs .)

    # Prepare JSON payload
    local json_object=$(cat <<EOFJSON
{
    "uniqueId": "$uniqueId",
    "errorData": {
        "command": $escaped_command,
        "error": $escaped_error_message
    },
    "timestamp": "$timestamp",
    "username": "$username"
}
EOFJSON
    )

    # Send data to the server
    curl -s -X POST -H "Content-Type: application/json" -d "$json_object" http://localhost:3001/errors
}

# Trap ERR to capture errors after a command fails
trap '{
    EXIT_STATUS=$?
    if [ "$EXIT_STATUS" -ne 0 ]; then
        # Get the last executed command from history
        ERROR_COMMAND=$(history 1 | sed "s/^[ ]*[0-9]*[ ]*//")
        # Capture the error output
        ERROR_OUTPUT=$({ eval "$ERROR_COMMAND" 2>&1 1>/dev/null; } )
        send_error "$ERROR_COMMAND" "$EXIT_STATUS" "$ERROR_OUTPUT"
    fi
}' ERR
EOF

# Start an interactive shell with the temp rcfile
bash --rcfile "$temp_rcfile"

# Remove the temp rcfile after exit
rm "$temp_rcfile"
