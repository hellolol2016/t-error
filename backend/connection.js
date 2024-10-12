require('dotenv').config({ path: './keys.env' });
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://timtak:${process.env.MONGOPASSWORD}@learningcluster.uvkbeii.mongodb.net/?retryWrites=true&w=majority&appName=learningCluster`;
const DBNAME = "HackHarvard";

class MongoDBService {
	constructor() {
		this.client = null;
		this.db = null;
	}

	async connect() {
		if (!this.client) {
			this.client = new MongoClient(uri, {
				serverApi: {
					version: ServerApiVersion.v1,
					strict: true,
					deprecationErrors: true,
				},
			});
			await this.client.connect();
			console.log('[mongodb] connected');
			this.db = this.client.db(DBNAME);
		}
		return this.db;
	}

	async close() {
		if (this.client) {
			await this.client.close();
			console.log('[mongodb] connection closed');
			this.client = null;
			this.db = null;
		}
	}
}

module.exports = MongoDBService;
