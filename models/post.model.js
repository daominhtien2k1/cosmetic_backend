const mongoose = require('mongoose');
const Account = require('./account.model');
const Report = require('./report.model');

const postSchema = new mongoose.Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts',
        required: true
    },
    described: {
        type: String,
        required: true
    },
    images: [{filename: String, url: String, publicId: String}],
    video: {filename: String, url: String, publicId: String},
    likedAccounts: [{type: mongoose.Schema.Types.ObjectId, ref: 'accounts'}],
    commentList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }],
    likes: {
        type: Number,
        required: false,
        default: 0
    },
    comments: {
        type: Number,
        required: false,
        default: 0
    },
    status: {
        type: String,
        required: false
    },
    canComment: {
        type: Boolean,
        required: true,
        default: true
    },
    banned: {
        type: Boolean,
        required: true,
        default: false
    },
    reports_post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports'
    }]
});
postSchema.index({ described: "text"});
postSchema.set('timestamps', true);

const Post = mongoose.model('Post', postSchema);
Post.prototype.getVideoThumb = () => {
    const videoTailReg = /\.((wmv$)|(mp4$)|(avi$)|(wmv$)|(mov$)|(flv$))/gi
    if(this.video != undefined){
        return this.video.url.replace(videoTailReg, ".jpg");
    }
}
module.exports = Post;