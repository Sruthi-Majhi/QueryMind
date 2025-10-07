import "dotenv/config";

const getGeminiResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{ 
                role: "user", 
                parts: [{ text:message}] 
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 64,
                topP: 0.95,
                maxOutputTokens: 2048
            }
        })
    }
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, options);
        const data = await response.json();
        
        // Extract just the text response
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
        return aiResponse;
    } catch(err) {
        console.error(err);
        throw new Error("Failed to get AI response");
    }
}

export default getGeminiResponse;