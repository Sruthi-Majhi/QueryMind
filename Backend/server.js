import express from 'express';
import "dotenv/config";
import cors from 'cors';
import mongoose from 'mongoose';
import getGeminiResponse from './utils/querymind.js';
import chatRoutes from './routes/chat.js';
import Thread from './models/Thread.js';
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use('/api', chatRoutes);
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
};

// app.post("/test", async(req, res) => {
//     try {
//         const { message, threadId } = req.body;
//         const userMessage = message || "Hello!";
        
//         const aiResponse = await getGeminiResponse(userMessage);
        
//         // Save the conversation to database
//         const thread = new Thread({
//             messages: [
//                 {
//                     role: "user",
//                     content: userMessage
//                 },
//                 {
//                     role: "assistant", 
//                     content: aiResponse
//                 }
//             ],
//             threadId: threadId || `thread_${Date.now()}`,
//             threadTitle: userMessage.substring(0, 50) + (userMessage.length > 50 ? "..." : ""),
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         });
        
//         await thread.save();
        
//         res.json({ 
//             success: true, 
//             response: aiResponse,
//             threadId: thread.threadId,
//             timestamp: new Date().toISOString()
//         });
//     } catch(err) {
//         console.error(err);
//         res.status(500).json({ error: "Error occurred" });
//     }
// });
