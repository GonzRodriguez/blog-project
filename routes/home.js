const express = require('express');
const router = express.Router();
const Post = require("../models/postModel");
const User = require('../models/userModel');

const postDate = new Date();
 

router.get("/", async (req, res) => {
    const user = req.user;

            Post.find({}, function (err, foundPosts) {
                if(!err){
                    res.render("home", {
                        post: foundPosts,
                        createdAt: postDate,
                        user: user
                    });
                } else {
                    console.log(err);
                }
            });
});

module.exports = router;