const express = require('express');
const { getAll, getFeatured, getType, typesCount, singleLodge, createLodge, updateLodge, deleteLodge, getAlll, filteredLodges } = require('../controllers/lodgeController.js');
const lodgeRoute = express.Router()
const verifyToken = require('../middlewares/verifyToken.js');
const { upload, uploadImage } = require('../controllers/uploadcontroller.js');
const isAgent = require('../middlewares/userRoles.js');



//get all lodges
lodgeRoute.get('/allLodges', getAll )

//get all lodges based on campus after logging in
lodgeRoute.get('/campusLodges',verifyToken, getAlll)

//get lodges by filter
lodgeRoute.get('/filter', filteredLodges)

//get feeatured lodges
lodgeRoute.get('/featured', getFeatured)

//get lodges by type
lodgeRoute.get('/getType', getType)

//get the counts of types
lodgeRoute.get('/typesCount', typesCount)

//geta single lodge
lodgeRoute.get('/singleLodge/:id', singleLodge)

//create a new lodge
lodgeRoute.post('/createLodge/:id',verifyToken,isAgent, createLodge)
// lodgeRoute.post('/image', upload.array('image', 5), uploadImage)

//update a lodge
lodgeRoute.patch('/updateLodge/:id',verifyToken,isAgent, updateLodge)

//delete a single lodge
lodgeRoute.delete('/deleteLodge/:id',verifyToken,isAgent, deleteLodge)

module.exports = lodgeRoute;