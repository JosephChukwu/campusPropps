const Lodge = require("../models/lodge.js");

const AsyncHandler = require("express-async-handler");
const User = require("../models/user.js");
const errorHandler = require("../utils/error");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose')

//update user info
const updateUser = AsyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,  
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profileimage: req.body.profileimage,
          campus: req.body.campus,
          role: req.body.role,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
});

//users booked lodges
const bookLodge = AsyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.bookedLodges.push({ id, date });

    await user.save();

    res.status(200).json("You have successfully booked this lodge");
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

//get booked lodges
const getBookedLodges = AsyncHandler(async (req, res) => {
  // const { id } = req.params;

  try {
    //get the users id and use it to get the bookedLodges
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookedLodges = user.bookedLodges;

    res.status(200).json(bookedLodges);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

//controller to add to faves
const addFaves = AsyncHandler(async (req, res, next) => {
  const lodgeId = req.params.lodgeId;
  const email = req.body.email;
  try {
    console.log(`Received request to toggle favorite for lodgeId: ${lodgeId} by user: ${email}`);

    const user = await User.findOne({ email: email });

    if (!user) {
      return next(errorHandler(401, "error: User not found!"));
    }

    let updatedUser;
    if (user.favorites.includes(lodgeId)) {
      updatedUser = await User.findOneAndUpdate(
        { email: email },
        { $pull: { favorites: lodgeId } }, // Remove lodgeId from favorites
        { new: true } // To return the updated user
      );
      console.log(`Removed lodgeId: ${lodgeId} from favorites for user: ${email}`);
      return res.status(200).json({ message: "Removed lodge from favorites", updatedUser });
    }

    user.favorites.push(lodgeId);
    updatedUser = await user.save();
    console.log(`Added lodgeId: ${lodgeId} to favorites for user: ${email}`);
    return res.status(200).json({ message: "Added lodge to favorites", updatedUser });

  } catch (error) {
    console.error(`Error toggling favorite: ${error.message}`);
    next(error);
  }
}
);



//to get all favorites of a user
const getFaves = AsyncHandler(async (req, res, next) => {
  const email = req.query.email;
  // console.log("Received request for /allFaves with query:", req.query);

  // console.log("Fetching favorites for email:", email);
  
  try {
    const user = await User.findOne({email: email});
    if (!user) {
      console.log("User not found");
      return next(errorHandler(401, "User not found"));
    }

    const allFavesIds = user.favorites; // Assuming this is an array of lodge IDs
    const lodgesPromises = allFavesIds.map(id => 
      Lodge.findById(id).populate("creator", "-password").exec()
    );
    const lodges = await Promise.all(lodgesPromises);
    
    console.log("Favorites fetched:", lodges);
    res.status(200).json({ message: 'Here are your favorite lodges', lodges });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    next(error);
  }
});





//to get the lodegs an agent posted
const agentLodges = AsyncHandler(async(req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const lodges = await Lodge.find({ creator: req.params.id });
      res.status(200).json(lodges);
    
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "you can only view your own lodges!"))
  }
  
})





module.exports = { updateUser, bookLodge, getBookedLodges, addFaves, getFaves, agentLodges };
