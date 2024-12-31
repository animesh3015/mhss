const backendUrl = 'mysql://root:iloveumummy30@@localhost:3306/community_forum'; // Update with your backend URL

// Sign-Up Form Submission
document.querySelector('#sign-up-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.querySelector('#sign-up-username').value;
    const email = document.querySelector('#sign-up-email').value;
    const password = document.querySelector('#sign-up-password').value;

    const response = await fetch(`${backendUrl}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    alert(data.message);
});

// Login Form Submission
document.querySelector('#sign-in-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#sign-in-email').value;
    const password = document.querySelector('#sign-in-password').value;

    const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
        alert('Login successful');
        localStorage.setItem('token', data.token); // Save the token
        loadMessages(); // Load messages after successful login
    } else {
        alert(data.message);
    }
});

// Post a New Message
document.querySelector('#post-message-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.querySelector('#message-content').value;
    const token = localStorage.getItem('token');

    const response = await fetch(`${backendUrl}/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Send the token for authentication
        },
        body: JSON.stringify({ content }),
    });

    const data = await response.json();
    if (data.success) {
        alert('Message posted!');
        loadMessages(); // Refresh messages
    } else {
        alert(data.message);
    }
});

// Load All Messages
async function loadMessages() {
    const response = await fetch(`${backendUrl}/messages`);
    const data = await response.json();

    const messagesContainer = document.querySelector('#messages-container');
    messagesContainer.innerHTML = '';

    data.forEach((message) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.innerHTML = `
            <p><strong>${message.username}</strong>: ${message.content}</p>
            <span>${new Date(message.created_at).toLocaleString()}</span>
        `;
        messagesContainer.appendChild(messageDiv);
    });
}

// Load messages on page load
document.addEventListener('DOMContentLoaded', loadMessages);
