import ErrorLog from "./schema.js";

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
}

export default LogService;
