const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
const Minio = require('minio')
const fs = require('fs');
const multer = require('multer');
const User = require("../models/userModel");
const Post = require("../models/postModel");
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

    var user = await User.findById(req.user.id);
    if (user == null || user == 'null') {
        return res.json({ success: false, message: 'Invalid Credentials' });
    }
    //fetching posts
    var postList = await Post.find({});
    var filteredpostList = [];
    for (let index = 0; index < postList.length; index++) {
        if (user._id != postList[index].userID) {
            filteredpostList.push(postList[index]);
        }

    }
    return res.json({ success: true, message: 'Welcome to dashboard', user: user, postList: filteredpostList });

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
var region = process.env.REGION


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
        await minioClient.putObject(bucketName, objectName, fileData, metadata);

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

module.exports = router;