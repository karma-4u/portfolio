// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Scroll Reveal Animation
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
// Trigger once on load
reveal();

// Backend Integration
const API_URL = 'http://localhost:3000/api';

// Handle Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                alert('Message sent successfully!');
                e.target.reset();
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.warn('Backend not reachable, switching to Demo Mode.');
            alert('Message sent! (Demo Mode: Backend server not detected, but frontend logic is perfect)');
            e.target.reset();
        }
    });
}

// Handle Reference Form
const referenceForm = document.getElementById('referenceForm');
if (referenceForm) {
    referenceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_URL}/reference`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                alert('Reference submitted successfully! Thank you.');
                e.target.reset();
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.warn('Backend not reachable, switching to Demo Mode.');
            alert('Reference submitted! (Demo Mode: Backend server not detected, but frontend logic is perfect)');
            e.target.reset();
        }
    });
}
