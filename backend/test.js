import express from 'express';    
import MongoDBService from './db/connection.js'; 
import LogService from './services/LogService.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

async function performDatabaseOperations() {
	try {
		const mongoService = new MongoDBService();
		await mongoService.connect();
		
		const logService = new LogService();
		
		const test_log_1 = {
			uniqueId: "1",
			errorData: { command: "git pull", error: "error message" }
		};

		await logService.writeErrorLog(test_log_1);

		const logs = await logService.readErrorLogs();
		console.log(logs);

		await mongoService.close();
	} catch (error) {
		console.error('Error during database operations:', error);
	}
}

performDatabaseOperations();

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
