import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import MongoDBService from "./db/connection.js";
import LogService from "./db/db.js";
import ErrorGrouping from "./group_logs.js";
import GroupLog from "./db/groupSchema.js";
import dotenv from "dotenv";

const COLLECTION_NAME = "errorLogs";
const SIMILARITY_THRESHOLD = 0.8;
const PORT = 3001;

const app = express();

const mongodbService = new MongoDBService();
await mongodbService.connect();
const logService = new LogService();

const errorGrouping = new ErrorGrouping(SIMILARITY_THRESHOLD);

app.use(cors());
app.use(bodyParser.json());
dotenv.config({ path: "./keys.env" });

function generateLink(solutionId) {
    return `http://${process.env.HOST}:${PORT}/solution/${solutionId}`;
}

app.post("/errors", async (req, res) => {
	try {
		const { uniqueId, username, errorData } = req.body;

		if (!uniqueId || !errorData) {
			return res
				.status(400)
				.json({ message: "uniqueId and errorData are required." });
		}

		await logService.writeErrorLog({ 
			uniqueId, 
			username, 
			errorData });

		const matchedGroup = await errorGrouping.matchAndStoreSingleLog({ 
			uniqueId, 
			username, 
			errorData });

		if (matchedGroup.solution === null) {
			res.status(201).json({ message: "Error data received and saved."});
		} else {
			res.status(200).json({ message: "Solution for this error exists", link: generateLink(matchedGroup.solution)});
		}
	} catch (error) {
		if (error.code === 11000) {
			res.status(409).json({ message: "uniqueId already exists."});
		} else {
			console.error("Error saving data:", error);
			res.status(500).json({ message: "Internal server error." });
		}
	}
});

app.post("/writeSolution", async (req, res) => {
	try {
		const { groupId, description, commands } = req.body;

		const solution = await logService.writeSolution({ groupId, description, commands } );

		console.log("Received and saved error data:", solution);
		res.status(201).json({ message: "Error data received and saved.", id: 0 });
	} catch (error) {
		if (error.code === 11000) {
			res.status(409).json({ message: "uniqueId already exists.", error });
		} else {
			console.error("Error saving data:", error);
			res.status(500).json({ message: "Internal server error." });
		}
	}
})

app.get("/errors", async (req, res) => {
  try {
    const errorLog = await logService.readErrorLogs({});

    if (!errorLog) {
      return res.status(404).json({ message: "Error data not found." });
    }

    res.status(200).json(errorLog);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/getErrorGroups", async (req, res) => {
  try {
    const groups = await logService.readGroupLogs();

    res.status(200).json(groups);
  } catch (error) {
    console.error("[server] error grouping data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/getSolutions/:solutionId", async (req, res) => {

})

app.get("/", (req, res) => {
  res.send("Enhanced Error Monitoring Server is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
