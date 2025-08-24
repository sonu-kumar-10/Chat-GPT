const { default: mongoose } = require('mongoose');
const chatModel = require('../models/chat.model')

const createChat = async (req,res) =>{
    const { title } = req.body;
    const user = req.user

    const chat = await chatModel.create({
        user: user._id,
        title
    })

    res.status(201).json({
        message: "Chat created Successfull",
        user:{
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }
    })
}

module.exports = { createChat }