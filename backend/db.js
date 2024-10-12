const { connectToDatabase } = require('./connection');

class LogService {
	constructor(collectionName, db) {
		this.collection = db.collection(collectionName);
	}

	async writeErrorLog(errorLog) {
		try {
			const result = await this.collection.insertOne(errorLog);
			console.log(`[mongodb] new error log inserted with _id: ${result.insertedId}`);
		} catch (error) {
			console.error('[mongodb] error writing to MongoDB:', error);
		}
	}

	async readErrorLogs() {
		try {
			const logs = await this.collection.find({}).toArray();
			return logs;
		} catch (error) {
			console.error('[mongodb] error reading from MongoDB:', error);
			return [];
		}
	}
}

module.exports = LogService;
