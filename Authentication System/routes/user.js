const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')

const User = require("../models/userModel");

router.post("/register", async (req, res) => {


    //Email and password is necessary to register    
    if ((!req.body.email) || (!req.body.password)) {
        return res.json({ success: false, msg: 'Enter all fields' })
    }
    else {
        const user = await User.findOne({ email: req.body.email });
        if (user) return res.json({ success: false, message: "User already exists" });
        else {
            const newUser = new User({
                password: req.body.password,
                email: req.body.email,
            });
            newUser.save((err, newUser) => {
                if (err) {
                    return res.json({ success: false, msg: 'User Registration Unsuccessful' })
                }
                else {
                    return res.json({ success: true, msg: 'User Registration Successful' })
                }
            })
        }
    }
});

router.post("/login", async (req, res) => {


    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(403).json({ success: false, msg: 'Authentication Failed, User not found' })
    }
    else {
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
                // var token = jwt.encode(user, process.env.SECRET_KEY)
                const userInfo = { id: user._id, email: user.email, password: user.password };
                console.log(userInfo);
                var token = jwt.sign(userInfo, process.env.SECRET_KEY)
                return res.json({ success: true, token: token })
            }
            else {
                return res.status(403).json({ success: false, msg: 'Authentication failed, wrong password' })
            }
        })
    }
});

function authenticateToken(req, res, next) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        var token = req.headers.authorization.split(' ')[1];
        if (token == null) {
            return res.status(403).json({ success: false, msg: 'No Token Provided' });
        }
        jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
            if (err) {
                return res.status(403).json({ success: false, msg: 'Invalid Token' });
            }
            else {
                req.user = userInfo;
                next();
            }
        })
    }

}



router.get("/dashboard", authenticateToken, async (req, res) => {

    var user = await User.findById(req.user.id);
    if (user == null) {
        return res.json({ success: false, message: 'Invalid Credentials' });
    }
    return res.json({ success: true, user: user });

});


module.exports = router;
