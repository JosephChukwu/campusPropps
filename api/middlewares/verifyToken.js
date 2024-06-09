const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const user = require('../models/user.js');
const errorHandler = require('../utils/error.js');
// const expressAsyncHandler = require('express-async-handler');

const verifyToken = asyncHandler(async(req, res, next) => {
    const token = req.cookies.access_token 
    if(!token) return next(errorHandler(401, 'Invalid or expired token;Login required!'))

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return next(errorHandler(403, 'Invalid or expired token;Login required!'))

        req.user = user;
        console.log(user)
        next();
    })
})

module.exports = verifyToken

    // Check if the authorization header is present
//     if (!req.headers.authorization) {
//         return res.status(403).json({ msg: "Not authorized; no token" });
//     }

//     // Check if the authorization header starts with "Bearer "
//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
//         const token = req.headers.authorization.split(" ")[1]; // Split the bearer and the token to access the token itself

//         // Verify the token
//         jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
//             if (error) {
//                 console.log('token is invalid')
//                 return res.status(403).json({ msg: "Wrong or expired token" });
//             } else {
//                 console.log('Token is valid; data:', data);
//                 // Token is valid, populate req.user with user data
//                 req.user = data; // data = { id: user._id }
//                 next()
//             }
//         });
//     } else {
//         return res.status(403).json({ msg: "Invalid authorization header format" });
//     }
// })

