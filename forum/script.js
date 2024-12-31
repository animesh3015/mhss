// API Configuration
const API_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let isAuthenticated = !!authToken;

// DOM Elements
const authButtons = document.getElementById('authButtons');
const userInfo = document.getElementById('userInfo');
const username = document.getElementById('username');
const authRequiredMessage = document.getElementById('authRequiredMessage');
const messageInput = document.getElementById('messageInput');
const signInModal = document.getElementById('signInModal');
const signUpModal = document.getElementById('signUpModal');
const signInError = document.getElementById('signInError');
const signUpError = document.getElementById('signUpError');

// Update UI based on authentication status
function updateUIState() {
    if (isAuthenticated && currentUser) {
        authButtons.classList.add('hidden');
        userInfo.classList.remove('hidden');
        username.textContent = currentUser.username;
        authRequiredMessage.classList.add('hidden');
        messageInput.classList.remove('hidden');
        loadMessages();
    } else {
        authButtons.classList.remove('hidden');
        userInfo.classList.add('hidden');
        authRequiredMessage.classList.remove('hidden');
        messageInput.classList.add('hidden');
    }
}

// Load messages
async function loadMessages() {
    try {
        const response = await fetch(`${API_URL}/messages`);
        const messages = await response.json();
        
        const messagesHTML = messages.map(message => `
            <div class="message-container">
                <div class="message-header">
                    <span class="message-author">${message.author.username}</span>
                    <span class="message-date">${new Date(message.createdAt).toLocaleString()}</span>
                </div>
                <div class="message-content">${message.content}</div>
            </div>
        `).join('');
        
        document.getElementById('messagesContainer').innerHTML = messagesHTML;
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Event Listeners
document.getElementById('signInBtn').addEventListener('click', () => {
    signInModal.classList.remove('hidden');
});

document.getElementById('signUpBtn').addEventListener('click', () => {
    signUpModal.classList.remove('hidden');
});

document.getElementById('signOutBtn').addEventListener('click', () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
    isAuthenticated = false;
    updateUIState();
});

document.querySelectorAll('.closeModal').forEach(button => {
    button.addEventListener('click', () => {
        signInModal.classList.add('hidden');
        signUpModal.classList.add('hidden');
        signInError.classList.add('hidden');
        signUpError.classList.add('hidden');
    });
});

// Sign In Form
document.getElementById('signInForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    try {
        const response = await fetch(`${API_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            isAuthenticated = true;
            updateUIState();
            signInModal.classList.add('hidden');
            e.target.reset();
        } else {
            signInError.textContent = data.error;
            signInError.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error signing in:', error);
        signInError.textContent = 'An error occurred while signing in';
        signInError.classList.remove('hidden');
    }
});

// Sign Up Form
document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            isAuthenticated = true;
            updateUIState();
            signUpModal.classList.add('hidden');
            e.target.reset();
        } else {
            signUpError.textContent = data.error;
            signUpError.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error signing up:', error);
        signUpError.textContent = 'An error occurred while signing up';
        signUpError.classList.remove('hidden');
    }
});

// Post Message Form
document.getElementById('messageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
        alert('Please sign in to post messages');
        return;
    }

    const content = e.target.querySelector('textarea').value;
    
    try {
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            e.target.reset();
            loadMessages();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to post message');
        }
    } catch (error) {
        console.error('Error posting message:', error);
        alert('Failed to post message');
    }
});

// Initialize
updateUIState();