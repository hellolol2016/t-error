const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema({
	uniqueId: { type: String, required: true },
	errorData: mongoose.Schema.Types.Mixed,
	timestamp: { type: Date, default: Date.now },
	username: { type: String, required: true }
});

const ErrorLog = mongoose.model('ErrorLog', errorSchema);

module.exports = ErrorLog;