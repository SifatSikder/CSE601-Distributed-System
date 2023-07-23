const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userID: { type: String, require: true },
    postText: { type: String, default: 'absent' },
    postImageUrl: { type: String, default: 'absent' },
    viewers: [{ _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
})

module.exports = mongoose.model('Post', postSchema);