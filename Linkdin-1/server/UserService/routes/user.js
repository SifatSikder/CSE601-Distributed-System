const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
const User = require("../models/userModel");

require('dotenv').config()

router.post("/register", async (req, res) => {


    //Email and password is necessary to register    
    if ((!req.body.email) || (!req.body.password)) {
        return res.json({ success: false, message: 'Enter all fields' })
    }
    else {
        const user = await User.findOne({ email: req.body.email });
        if (user) return res.json({ success: false, message: "User already exists" });
        else {
            let newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            });
            await newUser.save()
            return res.json({ success: true, message: 'User Registration Successful' })
        }
    }
});

router.post("/login", async (req, res) => {

    console.log(req.body);


    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(403).json({ success: false, message: 'Authentication Failed, User not found' })
    }
    else {
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
                // var token = jwt.encode(user, process.env.PASSWORD_HASH_SECRET_KEY)
                const userInfo = { id: user._id, email: user.email, password: user.password };
                console.log(userInfo);
                var token = jwt.sign(userInfo, process.env.PASSWORD_HASH_SECRET_KEY)
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


module.exports = router;