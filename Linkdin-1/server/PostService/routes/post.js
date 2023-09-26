const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
const Post = require("../models/postModel");
require('dotenv').config()
var user_url = process.env.USER_URL;


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

async function getUserList() {



    var fetch = require('node-fetch');

    const response = await fetch(`${user_url}/all`);
    const data = await response.json();

    console.log(data);

}

async function getSingleUser(userID) {

    var fetch = require('node-fetch');

    const response = await fetch(`${user_url}/${userID}/single`);
    const data = await response.json();

    return data;

}

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

    })

    //fetching user information
    var user = await getSingleUser(req.user.id);

    //Sending Response
    return res.json({ success: true, message: 'Welcome to dashboard', user: user, postList: postList });

});

router.post('/:userID', /*upload.single('postImage'),*/ async (req, res) => {

    const file = req.file;
    const postText = req.body.postText;
    var user = await getSingleUser(req.params.userID);

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

    // if (file) {
    //     const fileData = fs.readFileSync(file.path);
    //     const objectName = file.filename;
    //     const metadata = { 'Content-type': 'image', };
    //     await minioClient.putObject(bucketName, objectName, fileData, metadata);

    //     const postImageUrl = `http://localhost:9000/${bucketName}/${objectName}`


    //     if (postText == '') {
    //         const post = new Post({
    //             userID: user._id,
    //             postImageUrl: postImageUrl,
    //         });
    //         post.save();
    //     }
    //     else {
    //         const post = new Post({
    //             userID: user._id,
    //             postImageUrl: postImageUrl,
    //             postText: postText,
    //         });
    //         post.save();
    //     }
    //     return res.json({ success: true, message: 'Post Shared' });
    // }
})

module.exports = router;