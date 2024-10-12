const MongoDBService = require('./connection');
const LogService = require('./db');

const COLLECTION_NAME = "errorLogs";

test_log_1 = {
    id: 1,
    command: "git pull",
    error: "error message"
};

test_log_2 = {
    id: 2,
    command: "git checkout branch1",
    error: "can't checkout branch"
};

async function performDatabaseOperations() {
	const mongoService = new MongoDBService();
    const db = await mongoService.connect();
    const logService = new LogService(COLLECTION_NAME, db);

    await logService.writeErrorLog(test_log_1);
    await logService.writeErrorLog(test_log_2);

    errors = await logService.readErrorLogs();

    console.log(errors);

	await mongoService.close();
}

performDatabaseOperations();