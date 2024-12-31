// Import dependencies
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize app
const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key"; // Replace with a secure key

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Replace with your MySQL password
    database: 'ForumApp'
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1); // Stop the server if DB connection fails
    }
    console.log("Conneted to MySQL database.");
});

// Routes

// User Registration
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";
        db.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send({ message: "Email already in use." });
                }
                return res.status(500).send({ message: "Error registering user." });
            }
            res.status(201).send({ message: "User registered successfully." });
        });
    } catch (error) {
        res.status(500).send({ message: "Server error." });
    }
});

// User Login
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM Users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send({ message: "Invalid email or password." });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid email or password." });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.send({ token, username: user.username });
    });
});

// Post a Message
app.post('/messages', (req, res) => {
    const { user_id, content } = req.body;
    const query = "INSERT INTO Messages (user_id, content) VALUES (?, ?)";
    db.query(query, [user_id, content], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Error posting message." });
        }
        res.status(201).send({ message: "Message posted successfully." });
    });
});

// Get Messages
app.get('/messages', (req, res) => {
    const query = `
        SELECT Messages.id, Users.username, Messages.content, Messages.created_at 
        FROM Messages 
        JOIN Users ON Messages.user_id = Users.id
        ORDER BY Messages.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Error fetching messages." });
        }
        res.send(results);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
