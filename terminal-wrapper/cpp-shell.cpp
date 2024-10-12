#include <iostream>
#include <fstream>
#include <unistd.h>
#include <sys/wait.h>
#include <cstring>
#include <cstdlib>
#include <fcntl.h>
#include <curl/curl.h>
#include <uuid/uuid.h>
#include <sstream>
#include <algorithm>

// Function to read the username from keys.env
std::string read_username_from_env() {
    std::ifstream env_file("keys.env");
    std::string line;
    std::string username;
    if (env_file.is_open()) {
        while (getline(env_file, line)) {
            if (line.find("USERNAME=") == 0) {
                username = line.substr(9); // Extract username after "USERNAME="
                break;
            }
        }
        env_file.close();
    } else {
        std::cerr << "Unable to open keys.env file. Please make sure it exists." << std::endl;
        exit(1);
    }
    return username;
}

// Function to generate a UUID
std::string generate_uuid() {
    uuid_t uuid;
    uuid_generate(uuid);
    char uuid_str[37]; // UUID is 36 characters plus null terminator
    uuid_unparse(uuid, uuid_str);
    return std::string(uuid_str);
}

// Function to escape special characters in a string to make it JSON-safe
std::string escape_json_string(const std::string& input) {
    std::ostringstream ss;
    for (char c : input) {
        switch (c) {
            case '"': ss << "\\\""; break;
            case '\\': ss << "\\\\"; break;
            case '\b': ss << "\\b"; break;
            case '\f': ss << "\\f"; break;
            case '\n': ss << "\\n"; break;
            case '\r': ss << "\\r"; break;
            case '\t': ss << "\\t"; break;
            default:
                if ('\x00' <= c && c <= '\x1f') {
                    ss << "\\u" << std::hex << std::setw(4) << std::setfill('0') << (int)c;
                } else {
                    ss << c;
                }
        }
    }
    return ss.str();
}

// Function to send error data to the server as a JSON object using libcurl
void send_error_to_server(const std::string& username, const std::string& unique_id, const std::string& command, const std::string& error_message) {
    CURL* curl = curl_easy_init();
    if(curl) {
        // Server URL
        std::string url = "http://localhost:3001/errors";

        // Create a JSON payload using stringstream, with escaped error message and new structure
        std::stringstream json_payload;
        json_payload << "{"
                     << "\"uniqueId\":\"" << unique_id << "\","
                     << "\"username\":\"" << "emaan" << "\","
                     << "\"errorData\": {"
                     << "\"command\":\"" << command << "\","
                     << "\"error\":\"" << escape_json_string(error_message) << "\""
                     << "}}";

        // Convert the stringstream to a string
        std::string json_data = json_payload.str();

        // Setup the request
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data.c_str());

        // Set the content-type header to JSON
        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        // Perform the request
        CURLcode res = curl_easy_perform(curl);
        if(res != CURLE_OK) {
            std::cerr << "Failed to send error to server: " << curl_easy_strerror(res) << std::endl;
        } else {
            std::cout << "Error data sent to server successfully!" << std::endl;
        }

        // Cleanup
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
    }
}

// Function to execute a command and handle errors
void execute_command(char* args[], const std::string& username) {
    pid_t pid = fork();

    if (pid < 0) {
        std::cerr << "Fork failed" << std::endl;
        return;
    }

    if (pid == 0) {
        // In the child process
        // Redirect stderr to a temporary file
        int error_log_fd = open("error_log.txt", O_WRONLY | O_CREAT | O_TRUNC, 0666);
        if (error_log_fd == -1) {
            std::cerr << "Error opening log file" << std::endl;
            exit(1);
        }

        // Redirect stderr to the file
        dup2(error_log_fd, STDERR_FILENO);
        close(error_log_fd);

        // Execute the command
        if (execvp(args[0], args) == -1) {
            std::cerr << "Command execution failed" << std::endl;
        }
        exit(1); // Exit child process if execvp fails
    } else {
        // In the parent process
        int status;
        waitpid(pid, &status, 0); // Wait for child process to complete

        if (WIFEXITED(status) && WEXITSTATUS(status) != 0) {
            std::cout << "Command failed with exit code " << WEXITSTATUS(status) << std::endl;

            // Read the error message from the log file
            std::ifstream error_log("error_log.txt");
            std::string error_message;
            std::string line;
            while (getline(error_log, line)) {
                error_message += line + "\n";
            }
            error_log.close();

            // Generate unique ID for the error
            std::string unique_id = generate_uuid();

            // Send the error data to the server
            send_error_to_server(username, unique_id, args[0], error_message);
        }
    }
}

int main() {
    char command[256]; // Buffer to hold the command entered by the user
    char* args[10];    // Array to hold the arguments for execvp

    // Read the username from the keys.env file
    std::string username = read_username_from_env();

    while (true) {
        // Prompt for input
        std::cout << "cpp-shell> ";
        std::cin.getline(command, 256);

        // Parse the command
        char* token = strtok(command, " ");
        int i = 0;
        while (token != nullptr) {
            args[i++] = token;
            token = strtok(nullptr, " ");
        }
        args[i] = nullptr; // Null-terminate the array of arguments

        // Exit the shell if the user types "exit"
        if (strcmp(args[0], "exit") == 0) {
            break;
        }

        // Execute the command
        execute_command(args, username);
    }

    return 0;
}
