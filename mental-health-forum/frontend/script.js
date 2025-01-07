// Function to fetch and display posts from the backend
async function fetchPosts() {
    try {
      const response = await fetch('http://localhost:3000/api/posts');
      const posts = await response.json();
  
      const postsContainer = document.getElementById('posts-container');
      postsContainer.innerHTML = '';
  
      posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
          <p><strong>${post.username}</strong> said:</p>
          <p>${post.message}</p>
          <hr>
        `;
        postsContainer.appendChild(postDiv);
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }
  
  // Event listener for creating a post
  document.getElementById('create-post-form').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const message = document.getElementById('message').value;
  
    const postData = {
      message: message,
      username: 'Anonymous'  // You can replace this with actual username from authentication
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
  
      if (response.ok) {
        alert('Post created successfully!');
        fetchPosts();  // Refresh the list of posts
      } else {
        alert('Error creating post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  });
  
  // Fetch and display posts on page load
  fetchPosts();
  