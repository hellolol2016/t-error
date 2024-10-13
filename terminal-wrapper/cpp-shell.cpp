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
#include <limits.h> 
#include <queue>

#define RESET "\033[0m"
#define RED "\033[31m"
#define GREEN "\033[32m"
#define YELLOW "\033[33m"
#define BLUE "\033[34m"
#define BOLD "\033[1m"

using namespace std;

void send_error_to_server(const std::string& username, const std::string& unique_id, const std::string& command, const std::string& error_message, std::queue<std::string>& command_queue);
void execute_command(char* args[], const std::string& username, bool is_from_server, std::queue<std::string>& command_queue);
void handle_command_error(const std::string& username, char* command, const std::string& error_message, std::queue<std::string>& command_queue);

std::string get_json_value(const std::string& json, const std::string& key) {
    size_t key_pos = json.find("\"" + key + "\"");
    if (key_pos != std::string::npos) {
        size_t start = json.find(":", key_pos);
        size_t end = json.find(",", start);
        if (end == std::string::npos) {
            end = json.find("}", start);
        }
        std::string value = json.substr(start + 1, end - start - 1);
        // Remove potential surrounding quotes
        value.erase(remove(value.begin(), value.end(), '\"'), value.end());
        return value;
    }
    return "";
}

// Function to parse a JSON array into a vector of strings
std::vector<std::string> get_json_array(const std::string& json, const std::string& key) {
    std::vector<std::string> result;
    size_t key_pos = json.find("\"" + key + "\"");
    if (key_pos != std::string::npos) {
        size_t start = json.find("[", key_pos);
        size_t end = json.find("]", start);
        std::string array_string = json.substr(start + 1, end - start - 1);

        size_t pos = 0;
        while ((pos = array_string.find("\"")) != std::string::npos) {
            size_t end_quote = array_string.find("\"", pos + 1);
            std::string item = array_string.substr(pos + 1, end_quote - pos - 1);
            result.push_back(item);
            array_string = array_string.substr(end_quote + 1);
        }
    }
    return result;
}

// Function to parse the JSON response
void parse_json_response(const std::string& response_string) {
    std::string status = get_json_value(response_string, "status");
    std::string link = get_json_value(response_string, "supalink");
    std::vector<std::string> commands = get_json_array(response_string, "commands");

    // Output the parsed values
    std::cout << "Status: " << status << std::endl;
    std::cout << "Link: " << link << std::endl;
    std::cout << "Commands: ";
    for (const auto& cmd : commands) {
        std::cout << cmd << " ";
    }
    std::cout << std::endl;
}

// Function to read the username from keys.env
std::string read_username_from_env() {
    std::ifstream env_file("keys.env");
    std::string line;
    std::string username;
    if (env_file.is_open()) {
        while (getline(env_file, line)) {
            if (line.find("username=") == 0) {
                username = line.substr(9); // Extract username after "USERNAME="
                break;
            }
        }
        env_file.close();
    } else {
        std::cerr << RED << "\nUnable to open keys.env file. Please make sure it exists." << RESET << std::endl;
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

size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* response) {
    size_t totalSize = size * nmemb;
    response->append((char*)contents, totalSize);
    return totalSize;
}

void send_error_to_server(const std::string& username, const std::string& unique_id, const std::string& command, const std::string& error_message, std::queue<std::string>& command_queue) {
    CURL* curl = curl_easy_init();
    if (curl) {
        std::string url = "http://localhost:3001/errors";

        std::stringstream json_payload;
        json_payload << "{"
                     << "\"uniqueId\":\"" << unique_id << "\","
                     << "\"username\":\"" << username << "\","
                     << "\"errorData\": {"
                     << "\"command\":\"" << command << "\","
                     << "\"error\":\"" << escape_json_string(error_message) << "\""
                     << "}}";

        std::string json_data = json_payload.str();
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data.c_str());

        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        std::string response_string;
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_string);

        CURLcode res = curl_easy_perform(curl);

        long http_code = 0;
        curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);

        if (res != CURLE_OK) {
            std::cerr << "\nFailed to send error to server: " << curl_easy_strerror(res) << std::endl;
        } else {
            if (http_code == 200) {
                std::string status = get_json_value(response_string, "status");
                std::string link = get_json_value(response_string, "supalink");
                std::vector<std::string> commands = get_json_array(response_string, "commands");

                std::cout << status << std::endl;
                std::cout << link << std::endl;

                std::string answer;
                std::cout << "Do you want to run the solution (y/n)?" << std::endl;
                std::getline(std::cin, answer);

                if (answer == "y") {
                    for (const std::string& command : commands) {
                        if (command.empty()) {
                            continue;
                        }
                        command_queue.push(command);
                    }
                }
            }
        }

        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
    }
}

void execute_command(char* args[], const std::string& username, bool is_from_server, std::queue<std::string>& command_queue) {
    if (args == nullptr || args[0] == nullptr) {
        std::cerr << "No command provided to execute." << std::endl;
        return;
    }

    pid_t pid = fork();

    if (pid < 0) {
        std::cerr << "Fork failed" << std::endl;
        return;
    }

    if (pid == 0) {
        int error_log_fd = open("error_log.txt", O_WRONLY | O_CREAT | O_TRUNC, 0666);
        if (error_log_fd == -1) {
            std::cerr << "\nError opening log file" << std::endl;
            exit(1);
        }

        dup2(error_log_fd, STDERR_FILENO);
        close(error_log_fd);

        if (execvp(args[0], args) == -1) {
            std::cerr << "\nCommand execution failed" << std::endl;
        }
        exit(1);
    } else {
        int status;
        waitpid(pid, &status, 0);

        if (WIFEXITED(status) && WEXITSTATUS(status) != 0) {
            std::ifstream error_log("error_log.txt");
            std::string error_message;
            std::string line;
            while (getline(error_log, line)) {
                error_message += line + "\n";
            }
            error_log.close();

            std::cout << error_message << std::endl;

            if (!is_from_server) {
                std::string full_command = "";
                for (int i = 0; args[i] != nullptr; ++i) {
                    if (i > 0) full_command += " ";
                    full_command += args[i];
                } 

                handle_command_error(username, (char*)full_command.c_str(), error_message, command_queue);
            } else {
                std::cout << "Error occurred in server-provided command." << std::endl;
            }
        } else {
            std::cout << "Command executed successfully!" << std::endl;
        }
    }
}

void handle_command_error(const std::string& username, char* command, const std::string& error_message, std::queue<std::string>& command_queue) {
    std::string unique_id = generate_uuid();
    send_error_to_server(username, unique_id, command, error_message, command_queue);
}

std::string get_current_directory() {
    char cwd[PATH_MAX];
    if (getcwd(cwd, sizeof(cwd)) != nullptr) {
        return std::string(cwd);
    } else {
        return std::string("unknown");
    }
}

int main() {
    char command[256]; 
    char* args[10]; 
    std::queue<std::string> command_queue;

    std::string username = read_username_from_env();

    while (true) {
        std::string command_str;

        if (!command_queue.empty()) {
            command_str = command_queue.front();
            command_queue.pop();
            std::cout << "Executing server command: " << command_str << std::endl;
        } else {
            std::string cwd = get_current_directory();
            std::cout << BLUE << "terror-shell:" << BOLD << cwd << RESET << "> ";
            std::cin.getline(command, 256);
            command_str = std::string(command);
        }

        command_str.erase(0, command_str.find_first_not_of(" \t\n\r\f\v"));
        command_str.erase(command_str.find_last_not_of(" \t\n\r\f\v") + 1);

        if (command_str.empty()) {
            continue;
        }

        std::strcpy(command, command_str.c_str());

        char* token = strtok(command, " ");
        int i = 0;
        while (token != nullptr && i < 10) {
            args[i++] = token;
            token = strtok(nullptr, " ");
        }
        args[i] = nullptr;

        if (strcmp(args[0], "exit") == 0) {
            std::cout << GREEN << "\nExiting cpp-shell. Goodbye!" << RESET << std::endl;
            break;
        }
        execute_command(args, username, false, command_queue);
    }

    return 0;
}
