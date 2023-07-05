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
    // Hoàn tác ngay sẽ xóa luôn document, còn Hủy trong quản lý thì chỉ đổi trạng thái
    status: {
        type: String,
        enum: ["Đang giải quyết", "Đã giải quyết", "Từ chối", "Hủy bỏ"],
        required: false,
        default: "Đang giải quyết"
    },
    response: {
        type: String,
        required: false
    }
});
reportSchema.set('timestamps', true);

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;