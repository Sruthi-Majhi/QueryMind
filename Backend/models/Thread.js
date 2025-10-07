import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});


const ThreadSchema = new mongoose.Schema({
    messages: [MessageSchema],
    threadId: {
        type: String,
        required: true,
        unique: true,
    },
    threadTitle: {
        type: String,
        default: "Untitled",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Thread = mongoose.model("Thread", ThreadSchema);
export default Thread;