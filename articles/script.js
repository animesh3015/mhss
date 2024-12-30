// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Modal functionality for Sign Up / Sign In form
const authModal = document.getElementById('auth-modal');
const closeModalBtn = document.querySelector('.close-button');
const toggleAuthLink = document.getElementById('toggle-link');
const authTitle = document.getElementById('auth-title');

// Open the modal when the user clicks on the login or signup button
// Example: Add buttons in your main HTML to trigger opening of modal
document.querySelectorAll('.open-auth-modal').forEach(button => {
    button.addEventListener('click', () => {
        authModal.style.display = 'block';
    });
});

// Close modal when the close button (×) is clicked
closeModalBtn.addEventListener('click', () => {
    authModal.style.display = 'none';
});

// Toggle between Sign In and Sign Up forms in the modal
toggleAuthLink.addEventListener('click', () => {
    const isSignUp = authTitle.textContent === 'Sign Up';
    
    // Toggle the title and the form fields based on the action
    if (isSignUp) {
        authTitle.textContent = 'Sign In';
        toggleAuthLink.textContent = 'Don\'t have an account? Sign Up';
    } else {
        authTitle.textContent = 'Sign Up';
        toggleAuthLink.textContent = 'Already have an account? Sign In';
    }
});
