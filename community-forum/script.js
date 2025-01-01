// script.js
document.getElementById('postForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const content = document.getElementById('postContent').value;

    // Post the new message to the backend
    await fetch('http://localhost:5000/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
    });

    document.getElementById('postContent').value = ''; // Clear the textarea
    fetchPosts(); // Refresh the posts
});

// Function to fetch posts from the backend
async function fetchPosts() {
    const response = await fetch('http://localhost:5000/posts');
    const posts = await response.json();
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.textContent = post.content;
        postsContainer.appendChild(postElement);
    });
}

// Fetch posts on page load
fetchPosts();