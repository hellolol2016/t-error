require('dotenv').config({ path: './keys.env' });
const mongoose = require('mongoose');

const DBNAME = "HackHarvard"
const URI = `mongodb+srv://timtak:${process.env.MONGOPASSWORD}@learningcluster.uvkbeii.mongodb.net/${DBNAME}`;

class MongoDBService {
	constructor() {
		this.connected = false;
	}

	async connect() {
		if (!this.connected) {
			try {
				await mongoose.connect(URI, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
				});
				console.log('[mongodb] connected to mongodb via mongoose');
				this.connected = true;
			} catch (error) {
				console.error('[mongodb] error connecting to mongodb:', error);
				this.connected = false;
			}
		}
	}

	async close() {
		if (this.connected) {
			await mongoose.connection.close();
			console.log('[mongodb] mongodb connection closed');
			this.connected = false;
		}
	}
}

module.exports = MongoDBService;
