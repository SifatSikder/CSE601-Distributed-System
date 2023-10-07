const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userID: { type: String, require: true },
    postText: { type: String, default: 'absent' },
    postImageUrl: { type: String, default: 'absent' },
})

module.exports = mongoose.model('Post', postSchema); 