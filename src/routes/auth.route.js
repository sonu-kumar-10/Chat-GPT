const express = require('express');
const router = express()



const authcontroller = require('../controllers/auth.controller')

router.post('/register',authcontroller.register)
router.post('/login',authcontroller.login)

module.exports = router