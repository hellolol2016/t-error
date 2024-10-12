import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables from keys.env
dotenv.config({ path: "./keys.env" });

const DBNAME = "HackHarvard";
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
        console.log("[mongodb] connected to mongodb via mongoose");
        this.connected = true;
      } catch (error) {
        console.error("[mongodb] error connecting to mongodb:", error);
        this.connected = false;
      }
    }
  }

  async close() {
    if (this.connected) {
      await mongoose.connection.close();
      console.log("[mongodb] mongodb connection closed");
      this.connected = false;
    }
  }
}

export default MongoDBService;
