const Post = require("../models/postModel");
const router = require("express").Router();
const uploads = require("./uploads");



router.get("/", async function (req, res) {

    if (req.isAuthenticated()){
        res.render("compose", {user: req.user});
    } else {
        res.redirect("/account/login")
    }
});


router.post("/", uploads.upload.single("img"), function (req, res,) {
    // add cloudinary url for the image to the campground object under image property
        if(req.file){
        uploads.cloudinary.uploader.upload(req.file.path, function (result) {
            req.body.img = result.secure_url;
            const post = new Post({
                title: req.body.postTitle,
                content: req.body.postBody,
                author: req.user.username,
                authorId: req.user._id,
                img: req.body.img
            });
            post.save(function (err) {
                if (!err) {
                    res.redirect("/");
                } else {
                    console.log(err);
                }
            });
        });
    } else {
        const post = new Post({
            title: req.body.postTitle,
            content: req.body.postBody,
            author: req.user.username,
            authorId: req.user._id,
        });
        post.save(function (err) {
            if (!err) {
                res.redirect("/");
            } else {
                console.log(err);
            }
        });
    }
});



module.exports = router;