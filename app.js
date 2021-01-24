//jshint esversion:6
require("dotenv").config()
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const _ = require("lodash"); 


const app = express();

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));



app.set("view engine", "ejs");

// Express session
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  expires: null,
  cookie: { 
    secure: false ,
    originalMaxAge: 10 * 365 * 24 * 60 * 60 },
  store: new MongoStore({ mongooseConnection: mongoose.connection }
  )
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
const User = require("./models/userModel");

// Passport Config
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// DB Config

mongoose.connect("mongodb+srv://admin-gonz:AAAA@cluster0.31ltn.azure.mongodb.net/blogDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);

// Connect flash
app.use(flash());

// overriding methods to delete posts
app.use(methodOverride("_method"))

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// Router
app.use('/', require("./routes/home"));
app.use('/account', require("./routes/account"));
app.use("/compose", require("./routes/compose"));
app.use("/posts", require("./routes/posts/post"));
app.use("/about", require("./routes/posts/about"));
app.use("/user-profile", require("./routes/user-profile"));

app.listen(process.env.PORT || 3000, function() {
  console.log("Server has started");
});
