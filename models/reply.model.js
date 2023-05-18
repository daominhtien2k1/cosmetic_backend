const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    review_id: {type: mongoose.Schema.Types.ObjectId, ref: 'reviews'},
    userReply_id: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts'},
    content: {type: String, trim: true},
});
replySchema.set('timestamps', true);

const Reply = mongoose.model('Reply', replySchema);
module.exports = Reply;