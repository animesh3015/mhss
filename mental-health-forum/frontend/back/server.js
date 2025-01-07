// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize app
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// MongoDB URI (from Atlas)
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://user1:Abcd123@cluster0.vmafq.mongodb.net/mental_health_forum?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Create Schema and Model for posts
const postSchema = new mongoose.Schema({
  username: { type: String, default: 'Anonymous' },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// Routes

// Route to get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // Sort by date in descending order
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err });
  }
});

// Route to create a new post
app.post('/api/posts', async (req, res) => {
  try {
    const { username, message } = req.body;
    const newPost = new Post({ username, message });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
