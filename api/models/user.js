const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    // phone: { type: Number, required: true, unique: true },
    profileimage: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png",
    },
    password: { type: String, min: 6, required: true },
    phone: { type: Number, min: 10 },
    role: {
      type: String,
      enum: ["Agent", "PT"],
      default: "PT",
      // required: true,
    },
    allLodges: [{ type: mongoose.Types.ObjectId, ref: "Lodge" }],
    favorites: { type: Array, default: [] },
    bookedLodges: { type: Array, default: [] },
    campus: {
      type: String,
      enum: ["UNN", "UNEC"],
      default: "UNEC",
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
