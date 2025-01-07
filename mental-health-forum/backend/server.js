const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const User = require('./models/User'); // Assuming you have a User model

const app = express();
const port = 3000;

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://user1:Abcd123@cluster0.vmafq.mongodb.net/your-db-name?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.log('Failed to connect to MongoDB Atlas', err));


// Middleware
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.json()); // To parse JSON data
app.use(session({
    secret: 'your-secret-key', // Change this secret key
    resave: false,
    saveUninitialized: true,
}));

// Serve static files (e.g., CSS, JS) from the frontend directory
app.use(express.static(path.join(__dirname, '../../frontend')));

// Serve the index page (landing page with Sign Up and Sign In buttons)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Serve the Sign Up page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/signup.html'));
});

// Serve the Sign In page
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/signin.html'));
});

// Serve the Forum page (from frontend)
app.get('/forum', (req, res) => {
    if (req.session.userId) {
        // Serve the forum.html from frontend directory
        res.sendFile(path.join(__dirname, '../../frontend/forum.html'));
    } else {
        res.redirect('/signin');
    }
});

// Sign Up Route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists!');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            username,
            password: hashedPassword,
        });
        await user.save();

        // Redirect to sign in page after successful signup
        res.redirect('/signin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Sign In Route
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Store user session
        req.session.userId = user._id;

        // Redirect to the forum page
        res.redirect('/forum');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Log out Route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
