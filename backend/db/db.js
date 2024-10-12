import ErrorLog from "./errorSchema.js";
import GroupLog from "./groupSchema.js";
import SolutionLog from "./solutionSchema.js";
import { v4 as uuidv4 } from 'uuid';

class LogService {
  	async writeErrorLog(errorLogData) {
		try {
			const newErrorLog = new ErrorLog(errorLogData);
			await newErrorLog.save();
			console.log(
				`[mongodb] new error log inserted with uniqueId: ${errorLogData.uniqueId}`
			);
		} catch (error) {
			console.error("[mongodb] error writing to MongoDB:", error);
		}
  	}

  	async readErrorLogs(query) {
		try {
			const logs = await ErrorLog.find(query);
			return logs;
		} catch (error) {
			console.error("[mongo] error reading from MongoDB:", error);
			return [];
		}
  	}

	async readGroupLogs(query) {
		try {
			const groups = await GroupLog.find(query);
			return groups;
		} catch (error) {
			console.error("[mongo] error reading from MongoDB:", error);
			return [];
		}
	}

	async writeSolution(solution) {
		try {
			console.log(solution);

			const uniqueId = uuidv4();

			const newSolution = new SolutionLog({uniqueId, description: solution.description, commands: solution.commands});
			await newSolution.save();
			
			const groupId = solution.groupId;

			const updatedGroup = await GroupLog.findByIdAndUpdate(
				groupId,
				{ $set: { solution: newSolution.uniqueId } },
				{ new: true } 
			);
		} catch (error) {
			console.error("[mongodb] error writing to MongoDB:", error);
		}
	}

	async getSolution(query) {
		try {
			const solution = await SolutionLog.find(query);
			return solution;
		} catch (error) {
			console.error("[mongodb] error writing to MongoDB:", error);
		}
	}
}

export default LogService;
