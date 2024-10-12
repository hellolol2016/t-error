import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    representative: {
        command: { type: String, required: true }, // Command must be provided
        error: { type: String, required: true }    // Error must be provided
    },
    errors: [
        {
            command: { type: String, required: true }, // Command must be provided for each error
            error: { type: String, required: true }    // Error must be provided for each error
        }
    ],
    count: { type: Number, default: 1 },  // Default count
    solution: { type: String, default: null }  // Solution can be null or have a value
});

const GroupLog = mongoose.model("GroupLog", groupSchema);

export default GroupLog;