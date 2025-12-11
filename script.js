// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTopBtn = document.getElementById('backToTop');
const currentYearSpan = document.querySelector('#currentYear');

// ShopEase Images
const shopeaseImages = [
    'ShopEase/Shopease1.png',
    'ShopEase/Shopease2.png',
    'Shopease/Shopease3.png',
    'Shopease/Shopease4.png',
    'Shopease/Shopease5.png',
    'Shopease/Shopease6.png',
    'Shopease/Shopease7.png',
    'Shopease/Shopease8.png'
];

let currentImageIndex = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    // Set current year
    currentYearSpan.textContent = new Date().getFullYear();
    
    // Initialize components
    initThemeToggle();
    initNavigation();
    initImageGallery();
    initTypingEffect();
    initCountdown();
    initBackToTop();
}

// Theme Toggle
function initThemeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Navigation
function initNavigation() {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });
    
    // Close mobile menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        });
    });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Image Gallery
function initImageGallery() {
    if (!document.querySelector('.thumbnail-strip')) return;
    
    createThumbnails();
    setupGalleryControls();
    startAutoSlide();
}

function createThumbnails() {
    const thumbnailStrip = document.querySelector('.thumbnail-strip');
    thumbnailStrip.innerHTML = '';
    
    shopeaseImages.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="ShopEase Screenshot ${index + 1}">`;
        
        thumbnail.addEventListener('click', () => {
            setActiveImage(index);
        });
        
        thumbnail.addEventListener('mouseenter', () => {
            setActiveImage(index);
        });
        
        thumbnailStrip.appendChild(thumbnail);
    });
}

function setupGalleryControls() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            navigateImage(-1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            navigateImage(1);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') navigateImage(-1);
        if (e.key === 'ArrowRight') navigateImage(1);
    });
}

function setActiveImage(index) {
    currentImageIndex = index;
    const mainImage = document.getElementById('main-image');
    const counter = document.getElementById('image-counter');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage) {
        mainImage.src = shopeaseImages[index];
        mainImage.alt = `ShopEase Screenshot ${index + 1}`;
        
        // Add fade effect
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.opacity = '1';
            mainImage.style.transition = 'opacity 0.3s ease';
        }, 10);
    }
    
    if (counter) {
        counter.textContent = `${index + 1} / ${shopeaseImages.length}`;
    }
    
    // Update active thumbnail
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function navigateImage(direction) {
    currentImageIndex = (currentImageIndex + direction + shopeaseImages.length) % shopeaseImages.length;
    setActiveImage(currentImageIndex);
}

function startAutoSlide() {
    setInterval(() => {
        navigateImage(1);
    }, 4000); // Change image every 4 seconds
}

// Typing Effect
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const texts = [
        'AI & Machine Learning Engineer',
        'Full Stack Developer',
        'Software Engineer',
        'Problem Solver'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
}

// Countdown Timer
function initCountdown() {
    const countdownValues = document.querySelectorAll('.countdown-value');
    if (!countdownValues.length) return;
    
    const launchDate = new Date('2025-06-01T00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate - now;
        
        if (distance < 0) {
            countdownValues.forEach(el => el.textContent = '00');
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        const values = [days, hours, minutes];
        
        countdownValues.forEach((el, index) => {
            el.textContent = values[index].toString().padStart(2, '0');
        });
    }
    
    updateCountdown();
    setInterval(updateCountdown, 60000);
}

// Back to Top Button
function initBackToTop() {
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Show success message
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Reset form
            this.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 2000);
    });
}

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = 'var(--shadow-lg)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    }
});