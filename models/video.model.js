const mongoose = require('mongoose');
const Account = require("./account.model");

const videoSchema = new mongoose.Schema({
    described: {
        type: String,
        required: true
    },
    video: {filename: String, url: String, publicId: String},
    isAdsCampaign: {
        type: Boolean,
        required: false,
        default: false
    },
    likes: {
        type: Number,
        required: false,
        default: 0
    },
    likedAccounts: [{type: mongoose.Schema.Types.ObjectId, ref: Account}],
});
videoSchema.set('timestamps', true);

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;