// Mobile Menu Toggle for Navigation
document.querySelector('.mobile-menu').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
});

// Smooth Scroll for Navigation Links
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        window.scrollTo({
            top: targetSection.offsetTop - 50, // Adjusting scroll position
            behavior: 'smooth'
        });
    });
});

// Form Validation (Simple Client-Side)
document.querySelector('.booking-form').addEventListener('submit', function(event) {
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const date = document.querySelector('#date');
    const expert = document.querySelector('#expert');

    if (!name.value || !email.value || !date.value || !expert.value) {
        alert('Please fill in all fields before submitting the form.');
        event.preventDefault();
    } else {
        alert('Appointment booked successfully!');
    }
});

// Scroll Reveal Effect (Example)
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', function() {
    sections.forEach(section => {
        if (isInViewport(section)) {
            section.classList.add('visible');
        }
    });
});

// Function to check if a section is in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
}

// Adding visible class to reveal content when scrolled into view
document.addEventListener('DOMContentLoaded', function() {
    const allSections = document.querySelectorAll('section');
    allSections.forEach(section => {
        section.classList.add('hidden');
    });
});

// Adding 'visible' class when section is in view
document.addEventListener('DOMContentLoaded', function() {
    const allSections = document.querySelectorAll('section');
    allSections.forEach(section => {
        section.classList.add('hidden');
    });
});
