import MongoDBService from './db/connection.js'; 
import LogService from './db/db.js';
import ErrorGrouping from './group_logs.js'

async function performDatabaseOperations() {
	try {
		const mongoService = new MongoDBService();
		await mongoService.connect();
		
		const logService = new LogService();
		
		const logs = await logService.readErrorLogs();

        const errorGrouping = new ErrorGrouping(0.8);

		const groups = errorGrouping.groupLogs(logs);

        console.log(groups);

		await mongoService.close();
	} catch (error) {
		console.error('Error during database operations:', error);
	}
}

performDatabaseOperations();