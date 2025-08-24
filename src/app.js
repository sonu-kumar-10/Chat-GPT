
const cookieParser = require('cookie-parser');
const express = require('express')
const  app = express()

// Routes 
const authRoute = require('../src/routes/auth.route') 
const chatRoute = require('../src/routes/chat.route') 


//Use middlewere
app.use(express.json())
app.use(cookieParser())


// Using Route
app.use('/api/auth',authRoute)
app.use('/api/chat',chatRoute)
module.exports= app;


