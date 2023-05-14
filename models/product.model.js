const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: false
    },
    clicks: {
        type: Number,
        required: false,
        default: 0
    },
});

const Carousel = mongoose.model('Carousel', carouselSchema);

module.exports = {
    Carousel
}