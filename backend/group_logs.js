import { stringSimilarity } from "string-similarity-js";

export default class ErrorGrouping {
    constructor(similarityThreshold) {
        this.groups = [];
        this.errors = [];
        this.logs = [];
        this.similarityThreshold = similarityThreshold;
    }

    preprocessText(text) {
        return text
            .toLowerCase()
            .replace(/\/[^ ]+/g, '<path>')
            .replace(/[a-zA-Z]:\\[^ ]+/g, '<path>')
            .replace(/\d+/g, '<num>')     
            .replace(/[\r\n]+/g, ' ')    
            .replace(/[^a-z0-9<> ]+/g, '')  
            .replace(/\s+/g, ' ')          
            .trim();
    }

    preprocessLogs() {
        this.logs.forEach(log => {  
            const command = this.preprocessText(log.errorData.command);
            const error = this.preprocessText(log.errorData.error);
            // Push an object containing separate command and error fields
            this.errors.push({ command, error });
        });
    }

    groupLogs(logs) {
        this.logs = logs;
        this.preprocessLogs();
    
        this.errors.forEach(({ command, error }) => {
            let foundGroup = false;
            for (let group of this.groups) {
                const combinedError = `command: ${group.representative.command} - error: ${group.representative.error}`;
                const currentError = `command: ${command} - error: ${error}`;
                const similarity = stringSimilarity(currentError, combinedError);
                if (similarity >= this.similarityThreshold) {
                    group.errors.push({ command, error });
                    group.count += 1;
                    foundGroup = true;
                    break;
                }
            }
            if (!foundGroup) {
                // When creating a new group, include command and error in a structured format
                this.groups.push({
                    representative: { command, error },
                    errors: [{ command, error }],
                    count: 1
                });
            }
        });

        // Format output for the frontend as JSON structure
        return this.groups.map(group => ({
            representative: group.representative,
            count: group.count,
            errors: group.errors
        }));
    }
}
