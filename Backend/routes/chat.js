import Thread from '../models/Thread.js';
import express from 'express';
import getGeminiResponse from '../utils/querymind.js';


const router = express.Router();




router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error occurred" });
    }
});


router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {

        let thread = await Thread.findOne({threadId});

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch thread" });
    }
})

router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {

        const thread = await Thread.findOneAndDelete({ threadId });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch thread" });
    }
})


router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        res.status(400).json({ error: "missing required fields" });
        return;
    }


    try {

        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                threadTitle: message,
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            })


        }

        else {
            thread.messages.push({
                role: "user",
                content: message
            });
        }

        const assistantReply = await getGeminiResponse(message);
        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });

        await thread.save();

        res.json({ reply: assistantReply });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error:"something went wrong"});
    }

});
export default router;