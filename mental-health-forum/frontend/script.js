// API Base URL
const API_BASE_URL = "http://localhost:3000/api";

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
    const response = await fetch(`${API_BASE_URL}/forum/messages`);
    const messages = await response.json();
    messagesContainer.innerHTML = "";
    messages.forEach(msg => {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = `${msg.user}: ${msg.text}`;
        messagesContainer.appendChild(messageDiv);
    });
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
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    alert(result.message);
});

// Handle Log-In
loginBtn.addEventListener("click", async () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (result.token) {
        token = result.token;
        localStorage.setItem("token", token);
        updateUI();
        fetchMessages();
    } else {
        alert("Login failed!");
    }
});

// Handle Log-Out
logoutBtn.addEventListener("click", () => {
    token = null;
    localStorage.removeItem("token");
    updateUI();
});

// Handle Post Message
postMessageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = document.getElementById("message-input").value;
    const response = await fetch(`${API_BASE_URL}/forum/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
    });
    if (response.ok) {
        fetchMessages();
        document.getElementById("message-input").value = "";
    } else {
        alert("Failed to post message!");
    }
});

// Initial Setup
updateUI();
fetchMessages();
