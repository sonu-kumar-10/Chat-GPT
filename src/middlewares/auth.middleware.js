const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const authUser = async (req,res,next)=>{
    const { token } = req.cookies

    if(!token) {
       return res.status(400).json({
            message: "Unauthorized"
        })
    }

    //user exsit karta hai to
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id)
        req.user = user
        next()

    } catch (error) {
         res.status(400).json({
            message: "Unauthorized"
        })
    }

}

module.exports = { authUser };