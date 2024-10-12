import MongoDBService from './db/connection.js'; 
import LogService from './db/db.js';
import ErrorGrouping from './group_logs.js'
import GroupLog from "./db/groupSchema.js";

async function performDatabaseOperations() {
	try {
		const mongoService = new MongoDBService();
		await mongoService.connect();
		
		const logService = new LogService();
		
		const logs = await logService.readErrorLogs();

        const errorGrouping = new ErrorGrouping(0.8);

        // for (const log of logs) {
        //     await errorGrouping.matchAndStoreSingleLog(log);
        // }

		// const groups = errorGrouping.groupLogs(logs);

        // console.log(groups);

        const t = await GroupLog.find({});
        console.log(t);

		await mongoService.close();
	} catch (error) {
		console.error('Error during database operations:', error);
	}
}

performDatabaseOperations();