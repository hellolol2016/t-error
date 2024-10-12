import ErrorLog from "./errorSchema.js";
import GroupLog from "./groupSchema.js";
import SolutionLog from "./solutionSchema.js";

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
			const newSolution = new SolutionLog(solution);
			await newSolution.save();
		
			console.log(
				`[mongodb] new error log inserted with uniqueId: ${newSolution.uniqueId}`
			);
			
			const groupId = solution.groupId;

			const updatedGroup = await GroupLog.findByIdAndUpdate(
				groupId,
				{ $set: { solution: newSolution.uniqueId } },  // Update the solution field with the solution ID
				{ new: true }  // Option to return the updated document
			);


		} catch (error) {
			console.error("[mongodb] error writing to MongoDB:", error);
		}
	}
}

export default LogService;
