const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
    config: {
      temperature: 0.7
    }
  })
  return response.text
}



async function generateVector(content) {
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

module.exports = { generateResponse, generateVector };