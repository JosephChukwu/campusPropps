const express = require('express')
const verifyToken = require('../middlewares/verifyToken')
const {updateUser, bookLodge, getBookedLodges, addFaves, getFaves, agentLodges} = require('../controllers/userController.js')

const userRouter = express.Router()


userRouter.patch('/updateUser/:id', verifyToken, updateUser)

userRouter.post('/bookLodge/:id', verifyToken, bookLodge)

userRouter.get('/bookedLodges/:id',verifyToken, getBookedLodges)

userRouter.post('/addToFave/:lodgeId', addFaves)

userRouter.get('/allFaves', getFaves)

//get agents lodges
userRouter.get('/agentLodges/:id', verifyToken, agentLodges)

module.exports = userRouter