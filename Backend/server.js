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

