const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    receiverID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    postOwnerName: { type: String, },
    postID: { type: String, },
    status: { type: String, default: 'unread' },
    expiredStatus: { type: String, default: 'alive' },
})

module.exports = mongoose.model('Notification', notificationSchema);