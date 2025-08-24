const { Pinecone } = require("@pinecone-database/pinecone");


// Initialize Pinecone client
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const projectChatGptIndex = pc.index("project-chat-gtp")

async function createMemory({ vectors, metadata, messageId }) {
    await projectChatGptIndex.upsert( [ {
        id: messageId,
        values: vectors,
        metadata
    }])
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
    
    const data = await projectChatGptIndex.query({
        vector: queryVector,
        topK: limit,
        filter:metadata ? { metadata } : undefined,
        includeMetadata: true
    })

    return data.matches
}



module.exports = { createMemory, queryMemory };