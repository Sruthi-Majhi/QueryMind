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
        console.log("Starting Gemini API call...");
        console.log("API Key exists:", !!process.env.GEMINI_API_KEY);
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, 
            { ...options, signal: controller.signal }
        );
        clearTimeout(timeout);
        
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        
        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));
        
        if (!response.ok) {
            console.error("API returned non-OK status:", response.status);
            throw new Error(`API Error: ${response.status} - ${data.error?.message || JSON.stringify(data)}`);
        }
        
        // Check if there was an API error
        if (data.error) {
            console.error("Gemini API Error:", data.error);
            throw new Error(data.error.message || "API returned an error");
        }
        
        // Check if we got candidates
        if (!data.candidates || data.candidates.length === 0) {
            console.error("No candidates in response:", data);
            return "I couldn't generate a response. Please try again.";
        }
        
        // Extract just the text response
        const aiResponse = data.candidates[0]?.content?.parts?.[0]?.text;
        
        if (!aiResponse) {
            console.error("No text found in response:", data.candidates[0]);
            return "I couldn't generate a response. Please try again.";
        }
        
        console.log("Successfully got response:", aiResponse.substring(0, 100));
        return aiResponse;
    } catch(err) {
        console.error("Gemini Error:", err.message);
        console.error("Full error:", err);
        throw err;
    }
}

export default getGeminiResponse;