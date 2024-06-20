const mongoose = require('mongoose');

const LodgeSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: true, 
        minlength: 8
    },
    type: {
        type: String,
        enum: ["Single_room", "Room_in_a_flat", "Self_contained"],
        required: true
    },
    leaseTerms: {
        type: String,
        enum: ["Direct_brief", "Semi_direct_brief",],
        required: true
    },
    vacancy: { 
        type: String,
        enum: ["Totally_vacant", "Male_roommate", "Female_roommate"],
        required: true
    },
    location: {
        type: String,
        enum: ["Maryland", "College-Road", "Nkpokiti", "Kenyetta", "Lomalinda", "Monarch"],
        required: true
    // },
    // distance: {
    //     type: String,
    //     required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 20
    },
    lodgeImages: {
        type: Array,
        required: true
    },
    rent: {
        type: String,
        required: true
    },
    campus: {
        type: String,
        enum: ["UNN", "UNEC"],
        // required: true
        default: "UNEC",

    },
    
    featured: {
        type: Boolean,
        default: false
    },

    // isFave: {
    //     type: Boolean,
    //     default: false
    // },
    // creatorPhone: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User.phone",
    //     // required: true
    // },
    initial: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("Lodge", LodgeSchema);
