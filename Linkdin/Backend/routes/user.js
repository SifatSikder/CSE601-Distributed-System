const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
const Minio = require('minio')
const fs = require('fs');
const multer = require('multer');
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Notification = require("../models/notificationModel");
require('dotenv').config()

router.post("/register", async (req, res) => {

    console.log(req.body);


    //Email and password is necessary to register    
    if ((!req.body.email) || (!req.body.password)) {
        return res.json({ success: false, message: 'Enter all fields' })
    }
    else {
        const user = await User.findOne({ email: req.body.email });
        if (user) return res.json({ success: false, message: "User already exists" });
        else {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            });
            newUser.save((err, newUser) => {
                if (err) {
                    return res.json({ success: false, message: 'User Registration Unsuccessful' })
                }
                else {
                    return res.json({ success: true, message: 'User Registration Successful' })
                }
            })
        }
    }
});

router.post("/login", async (req, res) => {


    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(403).json({ success: false, message: 'Authentication Failed, User not found' })
    }
    else {
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
                // var token = jwt.encode(user, process.env.SECRET_KEY)
                const userInfo = { id: user._id, email: user.email, password: user.password };
                console.log(userInfo);
                var token = jwt.sign(userInfo, process.env.SECRET_KEY)
                return res.json({ success: true, message: token })
            }
            else {
                return res.status(403).json({ success: false, message: 'Authentication failed, wrong password' })
            }
        })
    }
});

function authenticateToken(req, res, next) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

        var token = req.headers.authorization.split(' ')[1];

        if (token == 'null') {
            return res.json({ success: false, message: 'No Token Provided' });
        }
        jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
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

router.get("/dashboard", authenticateToken, async (req, res) => {

    //fetching posts
    var posts = await Post.find({});

    //filtering post(Self posts will not be shown)
    posts = posts.filter(post => post.userID != req.user.id)


    //the above posts array contain postID,postText,postImageUrl
    //but we want an array where the objects will store postID,postText,postImageUrl,postOwnerName,postOwnerEmail
    var postList = [];
    posts.forEach(async post => {

        var postObject = {};
        var postOwner = await User.findById(post.userID);
        postObject['postText'] = post.postText;
        postObject['postImageUrl'] = post.postImageUrl;
        postObject['postOwnerName'] = postOwner.username;
        postObject['postOwnerEmail'] = postOwner.email;
        postList.push(postObject);


        //Post not seen by the user==New post (Need to send a notification)
        if (post.viewers.find(element => element._id == req.user.id) == undefined) {

            const notification = new Notification({
                receiverID: req.user.id,
                postOwnerName: postOwner.username,
                postID: post._id,
            });
            notification.save();

            //Once notification is send via the database the current user must be
            //put into the viewers array
            post.viewers.push(req.user.id);
            post.save();
        }
    })



    //fetching user information
    var user = await User.findById(req.user.id);


    //Filtering notification that should be access by the current user
    var notifications = await Notification.find({ expiredStatus: "alive" });
    notifications = notifications.filter(notification => notification.receiverID == req.user.id)




    //Sending Response
    return res.json({ success: true, message: 'Welcome to dashboard', user: user, postList: postList, notifications: notifications });

});

// File upload settings and multer configuration  
const PATH = './imageStore';
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage })

//Minio configuration
var minioClient = new Minio.Client({
    endPoint: process.env.ENDPOINT,
    port: 9000,
    useSSL: false,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.MINIO_SECRET_KEY
});
var bucketName = process.env.BUCKETNAME


router.post('/:userID/upload-post', upload.single('postImage'), async (req, res) => {

    const file = req.file;
    const postText = req.body.postText;
    var user = await User.findById(req.params.userID);

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
        const fileData = fs.readFileSync(file.path);
        const objectName = file.filename;
        const metadata = { 'Content-type': 'image', };
        minioClient.putObject(bucketName, objectName, fileData, metadata);

        const postImageUrl = `http://localhost:9000/${bucketName}/${objectName}`


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


router.get('/:notificationID/post', async (req, res) => {
    const notification = await Notification.findById(req.params.notificationID);
    const post = await Post.findById(notification.postID);
    var postObject = {};
    var postOwner = await User.findById(post.userID);
    postObject['postText'] = post.postText;
    postObject['postImageUrl'] = post.postImageUrl;
    postObject['postOwnerName'] = postOwner.username;
    postObject['postOwnerEmail'] = postOwner.email;

    console.log('hit khaise');

    return res.json({ success: true, post: postObject });

})


const mongodb = require('mongodb');

async function notificationCleaner() {

    var notifications = await Notification.find({});
    notifications.forEach(notification => {
        notification.expiredStatus = 'expired';
        notification.save();
    })
}


setInterval(notificationCleaner, 50000);

module.exports = router;