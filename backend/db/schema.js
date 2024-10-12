import mongoose from "mongoose";

const errorSchema = new mongoose.Schema({
	uniqueId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: false},
	errorData: mongoose.Schema.Types.Mixed,
	timestamp: { type: Date, default: Date.now },
});

const ErrorLog = mongoose.model("ErrorLog", errorSchema);

export default ErrorLog;
