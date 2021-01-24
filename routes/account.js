
const express = require('express');
const router = express.Router();
const passport = require('passport');
// Load User model
const User = require('../models/userModel');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
    
    const {  username, password } = req.body;
    let errors = [];

    if (!username || !password ) {
        const msg = { msg: 'Please enter all fields' }
        errors.push( msg );
        console.log(msg);
    }

    if (password.length < 6) {
        const msg = { msg: 'Password must be at least 6 characters' }
        errors.push( msg );
        console.log(msg);
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            password,
        });
    } else {
        User.findOne({ username: username }).then(user => {
            if (user) {
                const msg = { msg: 'Username already exists' }
                errors.push(msg);
                console.log(msg);
                res.render('register', {
                    errors,
                    username,
                    password,
                });
            } else {
                const newUser = new User({
                    username,
                    password
                });
                User.register({ username: username }, password, (err, user) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('user: ' + user.username + " saved.");
                        req.login(user, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        res.redirect("/")
                        });
                    }
                });
            };
            }
    )};
});


// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/account/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

module.exports = router;