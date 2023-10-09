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
    return res.json({ success: true, notifications: notifications })
});


module.exports = router;