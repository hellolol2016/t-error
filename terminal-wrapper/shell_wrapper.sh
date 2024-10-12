#!/bin/bash

timestamp() {
  date +"%s" # current time
}

# Function to send error data to the server
send_error() {
    local command="$1"
    local exit_status="$2"
    local error_message="$3"
    local timestamp=$(timestamp)
    local uniqueId=$(uuidgen)

    # Source the keys.env file to get the username
    if [ -f keys.env ]; then
        source keys.env
    else
        echo "Error: keys.env file not found."
        return
    fi

    # Ensure username is set
    if [ -z "$username" ]; then
        echo "Error: username not set in keys.env."
        return
    fi

    echo "Sending error data to server..."
    echo "Command: $command"
    echo "Exit Status: $exit_status"
    echo "Error Message: $error_message"
    echo "Timestamp: $timestamp"
    echo "Unique ID: $uniqueId"

    # Escape JSON special characters
    local escaped_command=$(printf '%s' "$command" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')
    local escaped_error_message=$(printf '%s' "$error_message" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')

    # Prepare JSON payload
    local json_object=$(cat <<EOF
{
    "uniqueId": "$uniqueId",
    "errorData": {
        "command": $escaped_command,
        "error": $escaped_error_message
    },
    "timestamp": "$timestamp",
    "username": "$username"
}
EOF
    )

    # Send data to server
    curl -v -X POST -H "Content-Type: application/json" -d "$json_object" http://localhost:3000/errors
}

# # Start a new shell session with error trapping
# bash --rcfile <(cat ~/.bashrc; echo "
# # Trap DEBUG to capture each command before execution
# trap 'last_command=\$current_command; current_command=\$BASH_COMMAND' DEBUG

# # Trap ERR to capture errors after a command fails
# trap '{
#     EXIT_STATUS=\$?
#     echo \$last_command
#     echo \$current_command
#     echo \$EXIT_STATUS
#     echo --------
#     if [ \$EXIT_STATUS -ne 0 ]; then
#         # Capture the error output
#         ERROR_OUTPUT=\$(2>&1 eval \"last_command\"), 
#         echo \$ERROR_OUTPUT
#         echo -----------
#         send_error \"\$last_command\" \"\$EXIT_STATUS\" \"\$ERROR_OUTPUT\"
#     fi
# }' ERR
# ")

# # \$(2>&1 eval \"\$last_command\"), 


# Start a new shell session with error trapping
bash --rcfile <(cat ~/.bashrc; echo "
# Trap DEBUG to capture each command before execution
STDOUT_LOG=$(mktemp)
STDERR_LOG=$(mktemp)

# Function to clean up temporary files
cleanup() {
    rm -f "\$STDOUT_LOG" "\$STDERR_LOG"
}
trap cleanup EXIT

# Initialize command variables
last_command=''
current_command=''

# Trap DEBUG to capture each command before execution
trap '{
    # Update command variables
    last_command="\$current_command"
    current_command="\$BASH_COMMAND"
    # Redirect outputs to temporary files
    exec 3>&1 4>&2 1>>"\$STDOUT_LOG" 2>>"\$STDERR_LOG"
}' DEBUG

# Trap ERR to capture errors after a command fails
trap '{
    EXIT_STATUS=$?
    if [ \$EXIT_STATUS -ne 0 ]; then
        # Read error output from the temporary file
        ERROR_OUTPUT=$(cat "\$STDERR_LOG")
        # Reset the stderr log file for the next command
        > "\$STDERR_LOG"
        # Call your send_error function
        send_error "\$last_command" "\$EXIT_STATUS" "\$ERROR_OUTPUT"
    fi
    # Restore stdout and stderr
    exec 1>&3 2>&4
}' ERR
")

STDOUT_LOG=$(mktemp)
STDERR_LOG=$(mktemp)

# Function to clean up temporary files
cleanup() {
    rm -f "$STDOUT_LOG" "$STDERR_LOG"
}
trap cleanup EXIT

# Initialize command variables
last_command=''
current_command=''

# Trap DEBUG to capture each command before execution
trap '{
    # Update command variables
    last_command="$current_command"
    current_command="$BASH_COMMAND"
    # Redirect outputs to temporary files
    exec 3>&1 4>&2 1>>"$STDOUT_LOG" 2>>"$STDERR_LOG"
}' DEBUG