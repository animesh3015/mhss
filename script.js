// Mobile menu functionality
// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Card Animation on Scroll
const cards = document.querySelectorAll('.card');

if (cards.length) {
    const observerOptions = {
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once the animation is applied
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.classList.add('hidden'); // Add initial hidden state
        observer.observe(card);
    });
}

// Form Validation
function validateForm(event) {
    const form = event.target;
    const email = form.querySelector('input[type="email"]');
    const message = form.querySelector('textarea');

    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email.value)) {
        isValid = false;
        alert('Please enter a valid email address.');
    }

    if (!message || !message.value.trim()) {
        isValid = false;
        alert('Please enter a message.');
    }

    if (!isValid) {
        event.preventDefault();
    }
}

// Attach validation to forms dynamically
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', validateForm);
});
