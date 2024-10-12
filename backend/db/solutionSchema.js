import { Int32 } from "mongodb";
import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema({
	description: { type: String, required: true },
	commands: { type: [String], default: [] }, // Array of strings for commands
});

const SolutionLog = mongoose.model("SolutionLog", solutionSchema);

export default SolutionLog;
