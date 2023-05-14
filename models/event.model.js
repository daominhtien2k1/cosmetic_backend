const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    image: {filename: String, url: String, publicId: String},
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true,
        default: Date.now,
    },
    endTime: {
        type: Date,
        required: true,
        default: Date.now,
    },
    participationCondition: {
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        required: false,
        default: 0
    },
    shortUrl: {
        type: String,
        required: true
    }

});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;