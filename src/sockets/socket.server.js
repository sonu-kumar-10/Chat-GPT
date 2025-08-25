const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.services");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");
const { text } = require("express");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  // 🔹 Socket middleware for authentication
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);

      if (!user) return next(new Error("Authentication error: User not found"));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid Token"));
    }
  });

  // 🔹 Connection handler
  io.on("connection", (socket) => {
    console.log(" User connected:", socket.user.email);

    socket.on("ai-message", async (messagePayLoad) => {
      console.log("New message:", messagePayLoad);

      const message = await messageModel.create({
        chat: messagePayLoad.chat,
        user: socket.user._id,
        content: messagePayLoad.content,
        role: "user",
      });

      const vectors = await aiService.generateVector(messagePayLoad.content);

      const memory = await queryMemory({
        queryVector: vectors,
        limit: 3,
        metadata: {
          user: socket.user._id
        },
      });
      await createMemory({
        vectors,
        messageId: message._id,
        metadata: {
          chat: messagePayLoad.chat,
          user: socket.user._id,
          text: messagePayLoad.content,
        },
      });



      const chatHistory = (
        await messageModel
          .find({
            chat: messagePayLoad.chat,
          })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
      ).reverse();

      const stm = chatHistory.map((item) => ({
        role: item.role,
        parts: [{ text: item.content }],
      }));

      const ltm = [
        {
          role: "user",
          parts: [{
            text: `these are some previous message from the chat,use them to a generate responce
            ${memory.map(item => item.metadata.text).join("\n")}` // next line
          }]
        }
      ]
      

      const response = await aiService.generateResponse([ ...ltm, ...stm]);

      const responseMessage = await messageModel.create({
        chat: messagePayLoad.chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });

      const responseVector = await aiService.generateVector(response);
      await createMemory({
        vectors: responseVector,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayLoad.chat,
          user: socket.user._id,
          text: response,
        },
      });
      socket.emit("ai-responce", {
        content: response,
        chat: messagePayLoad.chat,
      });

      console.log("AI response sent");
    });
  });
}

module.exports = initSocketServer;
