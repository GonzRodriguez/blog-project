const router = require('express').Router();
const User = require("../models/userModel");
const Post = require("../models/postModel");
const uploads = require("./uploads");
const postDate = new Date();


router.get("/:profileId", (req, res) => {
    const profileId = req.params.profileId;
    User.findOne({ _id: profileId}, async (err, foundUser ) => { 
        const author = foundUser
        if(!err){
          await  Post.find({author: author.username}, (err, foundPost) => {
              if(!err){
                  res.render("userProfile",{
                      profilePost: foundPost,
                      createdAt: postDate,
                      userId: profileId,
                      user: req.user,
                      userProfile: author
                  });
              }

            });
        }
    });
});

router.post("/:profileId", uploads.upload.single("imgProfile"),(req, res) => {
    const profileId = req.params.profileId;
    uploads.cloudinary.uploader.upload(req.file.path, function (result) {
        req.body.imgProfile = result.secure_url;
        console.log(req.body.imgProfile);
        console.log(profileId);
        User.updateOne({_id: profileId }, { profileImage: req.body.imgProfile }, (err) => {
            if(!err){
                console.log("Photo uploaded")
                res.redirect("/user-profile/" + profileId);
            } else {
                console.log(err);
            } 
    })
    });
});

module.exports = router;