const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function genrateResponce(content) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
            {
                role: "user",
                parts: [{ text: content }]
            }
        ]
    });

    // return response.response.text(); 
    console.log(response.response.candidates[0].content.parts[0].text);
}

async function genrateVector(content) {
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: [
            {
                role: "user",
                parts: [{ text: content }]
            }
        ],
        config: {
            outputDimensionality: 768
        }
    });

    return response.embeddings[0].values;
    
}

module.exports = { genrateResponce, genrateVector }