const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.redirect('/signin');
    } catch (err) {
        res.status(400).send('Error during signup. User might already exist.');
    }
});

// Signin route
router.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && await user.comparePassword(password)) {
            req.session.user = user;
            res.redirect('mhss/mental-health-forum/frontend/forum');
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

// Forum page route
router.get('/forum', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signin');
    }
    res.sendFile(__dirname + 'mhss/mental-health-forum/frontend/forum.html');
});

module.exports = router;
