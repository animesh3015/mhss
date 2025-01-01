// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to get all posts
app.get('/posts', async (req, res) => {
  try {
    const postsSnapshot = await db.collection('posts').get();
    const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to create a new post
app.post('/posts', async (req, res) => {
  const { content } = req.body;
  try {
    const newPostRef = await db.collection('posts').add({ content });
    res.status(201).json({ id: newPostRef.id, content });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});