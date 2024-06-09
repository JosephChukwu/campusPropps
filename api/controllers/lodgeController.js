//const express = require('express');
const asyncHandler = require("express-async-handler");
const Lodge = require("../models/lodge.js");
const User = require("../models/user.js");
const errorHandler = require("../utils/error.js");
//const lodgeController = require('express').Router()
//const asyncHandler = require(express-async-handler)

//get all lodges
const getAll = asyncHandler(async (req, res, next) => {
  try {
    const lodges = await Lodge.find({})
      .sort({ createdAt: -1 })
      .populate("creator", "-password");
    return res.status(200).json({ success: true, lodges });
  } catch (error) {
    next(error);

    // return res.status(500).json(error.message);
  }
});

//get when logged in via csmpus
const getAlll = asyncHandler(async (req, res) => {
  try {
    console.log("req.user:", req.user);

    const userCampus = req.user.campus; // Get user's campus from the session
    // const location = req.query.location;

    const lodges = await Lodge.find({ campus: userCampus }).populate(
      "creator",
      "-password"
    );
    return res.status(200).json(lodges);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});



//get featured
const getFeatured = asyncHandler(async (req, res) => {
  try {
    const featuredLodges = await Lodge.find({ featured: true }).populate(
      "creator",
      "-password"
    );

    return res.status(200).json(featuredLodges);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});



//get all from a specific type
const getType = asyncHandler(async (req, res) => {
  const type = req.query;
  try {
    if (type) {
      const lodges = await Lodge.find(type).populate("creator", "-password");
      return res.status(200).json(lodges);
    } else {
      return res.status(500).json({ msg: "Type doesn't exist" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});



//get counts of types
const typesCount = asyncHandler(async (req, res) => {
  try {
    const singleroomType = await Lodge.countDocuments({ type: "Single_room" });
    const roominflatType = await Lodge.countDocuments({
      type: "Room_in_a_flat",
    });
    const selfconType = await Lodge.countDocuments({ type: "Self_contained" });

    return res.status(200).json({
      Single_room: singleroomType,
      Room_in_a_flat: roominflatType,
      Self_contained: selfconType,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});



//get individual lodge
const singleLodge = asyncHandler(async (req, res, next) => {
  try {
    const lodge = await Lodge.findById(req.params.id).populate(
      "creator",
      "-password"
    );
    if (!lodge) {
      return next(errorHandler(401, "Lodge Id doesn't exist!"));
    } else {
      return res.status(200).json(lodge);
    }
  } catch (error) {
    next(error);
  }
});

//filter button
const filteredLodges = asyncHandler(async (req, res,next) => {
  console.log("recieved req for fiter kodges")
  // console.log("req.user", req.user);
  const filters = req.query; // Query parameters containing filter criteria
  console.log(filters)
  const userCampus = req.query.campus;


  // Construct the base query
  const query = Lodge.find({ campus: userCampus }); // Filter by the user's campus

  // Apply filters
  if (filters.location) {
    query.where("location").equals(filters.location);
  }

  if (filters.type) {
    query.where("type").equals(filters.type);
  }

  if (filters.vacancy) {
    query.where("vacancy").equals(filters.vacancy);
  }
  try {
    const filteredLodges = await query.populate("creator", "-password").exec();

    return res.status(200).json(filteredLodges);
    console.log(filteredLodges)
  } catch (error) {
    next(error)
    // return res.status(500).json(error.message);
  }
});





//create a lodge
const createLodge = asyncHandler(async (req, res, next) => {
  try {
    const { campus } = req.body;
    const userId = req.params.id;

    // console.log(req.user);
    // const userCampus = req.user.campus;

    // Check if the user has a valid campus
    // if (!userCampus) {
    //   return res.status(400).json({ message: "User has no campus specified." });
    // }
    // else {
    //   console.log("user campus:", userCampus);
    // }
    // console.log(req.body);

    // const lodgeCampus = req.body.campus;

    // if (!lodgeCampus || userCampus !== lodgeCampus) {
    //   return res
    //     .status(403)
    //     .json({ message: "Ooops, You can only create a lodge in your campus" });
    // }

    // Check if the user is an agent
    if (!req.user || !req.user.role || req.user.role !== "Agent") {
      return res.status(403).json("Access denied; limited to only agents");
    }

    // Check if the campus matches the user's campus
    if (campus !== req.user.campus) {
      return res
        .status(403)
        .json("Access denied; you can only create a lodge in your campus");
    }

    const newLodge = await Lodge.create({ ...req.body, creator: req.user.id });
    return res.status(201).json(newLodge);
  } catch (error) {
    next(error);
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json(error.message);
  }
});

//update a lodge
const updateLodge = asyncHandler(async (req, res) => {
  try {
    const lodge = await Lodge.findById(req.params.id);
    if (lodge.creator.toString() !== req.user.id) {
      throw new Error("You cannot update another agent's lodge");
    } else {
      const updatedLodge = await Lodge.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json(updatedLodge);
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

//delete a lodge
const deleteLodge = asyncHandler(async (req, res) => {
  try {
    const lodge = await Lodge.findById(req.params.id);
    if (lodge.creator.toString() !== req.user.id) {
      throw new Error("You cannot delete other agents' lodges");
    } else {
      //await lodge.remove()
      await lodge.deleteOne({ _id: req.params.id });
    }
    return res
      .status(200)
      .json({ msg: "Lodge has been successfully deleted " });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = {
  getAll,
  getFeatured,
  getType,
  typesCount,
  singleLodge,
  createLodge,
  updateLodge,
  deleteLodge,
  getAlll,
  filteredLodges,
};
