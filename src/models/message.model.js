const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [ "user","model", "system"], // enke alwa koe valu nhi ho saki hai 
        default: "user" // enme se koe nhi hai to user rahega
    }
},{ timestamps: true })

const messageModel = mongoose.model("message",messageSchema)
module.exports = messageModel