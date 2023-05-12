const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts',
        required: true
    },
    keyword: {
        type: String,
        required: true,
    },
});
searchSchema.set('timestamps', true);

const Search = mongoose.model('Search', searchSchema);

module.exports = Search;

