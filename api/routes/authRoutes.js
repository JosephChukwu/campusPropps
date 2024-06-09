const express = require('express');
const { loginUser, createUser, google, signOut } = require('../controllers/authController.js');
const authRoute = express.Router()


//register user
authRoute.post('/SignUp', createUser)

//login user
authRoute.post('/SignIn', loginUser)

//google auth routre
authRoute.post('/google', google)

//sign out 
authRoute.get('/signout', signOut)


module.exports = authRoute;