const mongoose = require('mongoose')

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("MongoDB err-",error);
    }
}

module.exports = connectDB