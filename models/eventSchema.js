const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        requried: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        requried: true
    },

    location: {
        type: String,
        deafult: "Virtual/Online",
        trim: true
    },

    capacity: {
        type: Number,
        deafult: 100
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema, "Events");