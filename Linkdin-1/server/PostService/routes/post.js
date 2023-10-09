const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
const Post = require("../models/postModel");
require('dotenv').config()
var user_url = process.env.USER_URL;
var minio_url = process.env.MINIO_URL;
var notification_url = process.env.NOTIFICATION_URL;
const multer = require('multer');
const fs = require('fs');


function authenticateToken(req, res, next) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

        var token = req.headers.authorization.split(' ')[1];
        if (token == 'null') {
            return res.json({ success: false, message: 'No Token Provided' });
        }
        jwt.verify(token, process.env.PASSWORD_HASH_SECRET_KEY, (err, userInfo) => {
            if (err) {
                return res.status(403).json({ success: false, message: 'Invalid Token' });
            }
            else {
                req.user = userInfo;
                next();
            }
        })
    }
    else {
        return res.json({ success: false, message: 'Access denied' });
    }

}

async function getSingleUser(userID) {

    var fetch = require('node-fetch');
    const response = await fetch(`${user_url}/${userID}/single`);
    const data = await response.json();
    return data.user;

}

async function getImageUrl(fileMetaData, fileData, userID) {
    var fetch = require('node-fetch');
    const response = await fetch(`${minio_url}/${userID}/`, { method: 'POST', body: JSON.stringify({ fileMetaData: fileMetaData, fileData: fileData }), headers: { 'Content-Type': 'application/json' } });
    const data = await response.json();
    return data.postImageUrl;
}

async function createNotification(receiverID, postOwnerName, postID) {
    var fetch = require('node-fetch');
    await fetch(`${notification_url}`, { method: 'POST', body: JSON.stringify({ receiverID: receiverID, postOwnerName: postOwnerName, postID: postID }), headers: { 'Content-Type': 'application/json' } });
}

async function getNotifications(userID) {
    var fetch = require('node-fetch');
    const response = await fetch(`${notification_url}/${userID}`, { method: 'GET' });
    const data = await response.json();

    return data.notifications;
}

async function getSingleNotification(notificationID) {
    var fetch = require('node-fetch');
    const response = await fetch(`${notification_url}/${notificationID}/singleNotification`, { method: 'GET' });
    const data = await response.json();
    return data.notification;
}





// File upload settings and multer configuration
const PATH = './imageStore/';
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage })


router.get("/", authenticateToken, async (req, res) => {


    //fetching posts
    var posts = await Post.find({});

    //filtering post(Self posts will not be shown)
    posts = posts.filter(post => post.userID != req.user.id)


    //the above posts array contain postID,postText,postImageUrl
    //but we want to send an array where the objects will store 
    //postID,postText,postImageUrl,postOwnerName,postOwnerEmail
    var postList = [];
    posts.forEach(async post => {

        var postObject = {};

        var postOwner = await getSingleUser(post.userID);
        console.log('postowner is:-');
        console.log(postOwner);
        postObject['postText'] = post.postText;
        postObject['postImageUrl'] = post.postImageUrl;
        postObject['postOwnerName'] = postOwner.username;
        postObject['postOwnerEmail'] = postOwner.email;
        postList.push(postObject);


        //Post not seen by the user==New post (Need to send a notification)
        if (post.viewers.find(element => element._id == req.user.id) == undefined) {



            await createNotification(req.user.id, postOwner.username, post._id);

            //Once notification is send via the database the current user must be
            //put into the viewers array
            post.viewers.push(req.user.id);
            post.save();
        }
    })

    //fetching user information
    var user = await getSingleUser(req.user.id);


    //Filtering notification that should be access by the current user
    var notifications = await getNotifications(req.user.id)

    //Sending Response
    return res.json({ success: true, message: 'Welcome to dashboard', user: user, postList: postList, notifications: notifications });

});

router.post('/:userID', upload.single('postImage'), async (req, res) => {

    let userID = req.params.userID
    const file = req.file;
    const postText = req.body.postText;
    var user = await getSingleUser(userID);

    //no file no text
    if (!file && postText == '') {
        return res.json({ success: false, message: 'Write something to share' });
    }
    //only text
    else if (!file && postText != '') {

        const post = new Post({
            userID: user._id,
            postText: postText,
        });
        post.save();
        return res.json({ success: true, message: 'Post Shared' });
    }

    if (file) {
        let fileMetaData = file;
        const fileData = fs.readFileSync(file.path);

        let postImageUrl = await getImageUrl(fileMetaData, fileData, userID);

        if (postText == '') {
            const post = new Post({
                userID: user._id,
                postImageUrl: postImageUrl,
            });
            post.save();
        }
        else {
            const post = new Post({
                userID: user._id,
                postImageUrl: postImageUrl,
                postText: postText,
            });
            post.save();
        }
        return res.json({ success: true, message: 'Post Shared' });
    }
})


router.get('/:notificationID/singlePost', async (req, res) => {
    const notification = await getSingleNotification(req.params.notificationID);

    const post = await Post.findById(notification.postID);
    var postOwner = await getSingleUser(post.userID);

    var postObject = {};
    postObject['postText'] = post.postText;
    postObject['postImageUrl'] = post.postImageUrl;
    postObject['postOwnerName'] = postOwner.username;
    postObject['postOwnerEmail'] = postOwner.email;
    return res.json({ success: true, post: postObject });
})

module.exports = router;