// API Configuration
const API_BASE_URL = "https://mhss.onrender.com";

// DOM Elements
const messagesContainer = document.getElementById("messages-container");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const postMessageSection = document.getElementById("post-message-section");
const postMessageForm = document.getElementById("post-message-form");

// Token for Authentication
let token = localStorage.getItem("token");

// Fetch and Display Messages
async function fetchMessages() {
    try {
        const response = await fetch(`${API_BASE_URL}/forum/messages`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const messages = await response.json();
        messagesContainer.innerHTML = "";
        messages.forEach(msg => {
            const messageDiv = document.createElement("div");
            messageDiv.className = "message-item";
            messageDiv.innerHTML = `
                <strong>${msg.user}</strong>
                <p>${msg.text}</p>
                <small>${new Date(msg.timestamp).toLocaleString()}</small>
            `;
            messagesContainer.appendChild(messageDiv);
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        messagesContainer.innerHTML = '<p class="error">Failed to load messages. Please try again later.</p>';
    }
}

// Show or Hide Post Form Based on Login Status
function updateUI() {
    if (token) {
        postMessageSection.style.display = "block";
        signupBtn.style.display = "none";
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
    } else {
        postMessageSection.style.display = "none";
        signupBtn.style.display = "inline-block";
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
    }
}

// Handle Sign-Up
signupBtn.addEventListener("click", async () => {
    try {
        const email = prompt("Enter your email:");
        const password = prompt("Enter your password:");
        
        if (!email || !password) {
            alert("Email and password are required!");
            return;
        }

        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Signup failed');
        }
        
        alert(result.message);
    } catch (error) {
        console.error('Signup error:', error);
        alert(`Signup failed: ${error.message}`);
    }
});

// Handle Log-In
loginBtn.addEventListener("click", async () => {
    try {
        const email = prompt("Enter your email:");
        const password = prompt("Enter your password:");

        if (!email || !password) {
            alert("Email and password are required!");
            return;
        }

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Login failed');
        }

        if (result.token) {
            token = result.token;
            localStorage.setItem("token", token);
            updateUI();
            fetchMessages();
        } else {
            throw new Error('No token received');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert(`Login failed: ${error.message}`);
    }
});

// Handle Log-Out
logoutBtn.addEventListener("click", () => {
    token = null;
    localStorage.removeItem("token");
    updateUI();
    fetchMessages(); // Refresh messages after logout
});

// Handle Post Message
postMessageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const messageInput = document.getElementById("message-input");
        const text = messageInput.value.trim();

        if (!text) {
            alert("Please enter a message!");
            return;
        }

        const response = await fetch(`${API_BASE_URL}/forum/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to post message');
        }

        messageInput.value = "";
        await fetchMessages();
    } catch (error) {
        console.error('Error posting message:', error);
        alert(`Failed to post message: ${error.message}`);
    }
});

// Initialize page
updateUI();
fetchMessages();

// Add automatic refresh every 30 seconds
setInterval(fetchMessages, 30000);