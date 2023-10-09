const express = require("express");
const router = express.Router();
const Notification = require("../models/notificationModel");
require('dotenv').config()


router.post("/", (req, res) => {

    receiverID = req.body.receiverID
    postOwnerName = req.body.postOwnerName
    postID = req.body.postID

    const notification = new Notification({
        receiverID: receiverID,
        postOwnerName: postOwnerName,
        postID: postID,
    });
    notification.save();
    return res.json({ success: true, message: "Notification successfully created" })
});


router.get("/:userID", async (req, res) => {
    var notifications = await Notification.find({ expiredStatus: "alive" });
    notifications = notifications.filter(notification => notification.receiverID == req.params.userID)
    console.log(notifications);
    return res.json({ success: true, notifications: notifications })
});


router.get("/:notificationID/singleNotification", async (req, res) => {
    var notification = await Notification.findById(req.params.notificationID);
    return res.json({ success: true, notification: notification })
});

async function notificationCleaner() {

    var notifications = await Notification.find({});
    notifications.forEach(notification => {
        notification.expiredStatus = 'expired';
        notification.save();
    })
}

setInterval(notificationCleaner, 5000);

module.exports = router;