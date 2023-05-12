const mongoose = require('mongoose');
const Post = require('./post.model');
const Account = require('./account.model');

const commentSchema = new mongoose.Schema({
    post_id: {type: mongoose.Schema.Types.ObjectId, ref: 'posts'},
    userComment_id: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts'},
    content: {type: String, trim: true},
});
commentSchema.set('timestamps', true);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;