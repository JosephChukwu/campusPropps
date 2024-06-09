const user = require('../models/user.js');
const asyncHandler = require('express-async-handler');

const isAgent = asyncHandler(async (req, res, next) => {
    try {
        if (!req.user || !req.user.role) {
            console.log('User object or role not found');
            return res.status(403).json('Access denied; limited to only agents');
        }

        const userRole = req.user.role;

        if (userRole === "Agent") {
            return next(); // User is an agent, proceed
        } else {
            console.log('Access denied; user is not an agent');
            res.status(403).json('Access denied; limited to only agents'); // User is not an agent, restrict access
        }
    } catch (error) {
        console.error('Error in isAgent middleware:', error);
        res.status(500).json('Internal server error');
    }
});


module.exports = isAgent