const router = require('express').Router();
const Post = require("../../models/postModel");
const uploads = require("../uploads");


// Posts routes

router.get("/:postId", function (req, res) {
    const requestedPostId = req.params.postId;

    Post.findOne({ _id: requestedPostId }, function (err, post) {

        if (!err) {
            res.render("post", {
                title: post.title,
                content: post.content,
                author: post.author,
                img: post.img,
                user: req.user
            })
        } else {
            console.log(err, post);
        };
    });
});

// EDIT ROUTES

router.get("/edit/:postId", async function (req, res) {
    const requestedPostId = req.params.postId;
    
    if(req.isAuthenticated()){
        
        await Post.findOne({ _id: requestedPostId }, function (err, post) {
            
            if (!err) {
                res.render("edit", {
                    title: post.title,
                    content: post.content,
                    _id: post._id,
                    user: req.user
                })
            } else {
                console.log(err, post);
            };
        });
    } else {
        res.redirect("/account/login");
    }
});
router.post("/edit/:id", uploads.upload.single("img"), (req, res ) => {
    if (req.file) {
        console.log(req.body.img);
        uploads.cloudinary.uploader.upload(req.file.path, function (result) {
            console.log(result.secure_url);
            req.body.img = result.secure_url;
          Post.findByIdAndUpdate({ _id: req.params.id }, { 
            title: req.body.postTitle, 
            content: req.body.postBody, 
              img: req.body.img
        },
        (err) => {
            if(err){
                console.log(err);
            } else {
                console.log("Post and image updated succesfully!");
                res.redirect("/user-profile/" + req.user._id)
            }
              })
        })
    } else {
        Post.findByIdAndUpdate({ _id: req.params.id }, {
            title: req.body.postTitle,
            content: req.body.postBody,
        },
            (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Post updated succesfully!");
                    res.redirect("/user-profile/" + req.user._id)
                }
            })
    }
});

// DELETE ROUTES
router.get("/delete/:id", async  (req, res) => {
    const postId = req.params.id;
    Post.deleteOne({ '_id': postId },  function (err){
        console.log("Post deleted");
        console.log(req.user._id);
        res.redirect("/user-profile/" + req.user._id );
    });
    

});

module.exports = router;