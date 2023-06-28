const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporter_id: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts'},
    post_id: {type: mongoose.Schema.Types.ObjectId, ref: "posts"},
    video_id: {type: mongoose.Schema.Types.ObjectId, ref: 'videos'},
    review_id: {type: mongoose.Schema.Types.ObjectId, ref: 'videos'},
    subject: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    // Hoàn tác ngay sẽ xóa luôn document, còn Cancel trong quản lý thì chỉ đổi trạng thái
    status: {
        type: String,
        enum: ["Pending", "Resolved", "Denied", "Cancelled"],
        required: false,
        default: "Pending"
    },
    response: {
        type: String,
        required: false
    }
});
reportSchema.set('timestamps', true);

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;