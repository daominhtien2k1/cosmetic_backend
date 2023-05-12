const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporter_id: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts'},
    post_id: {type: mongoose.Schema.Types.ObjectId, ref: "posts"},
    video_id: {type: mongoose.Schema.Types.ObjectId, ref: 'videos'},
    subject: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
});
reportSchema.set('timestamps', true);

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;