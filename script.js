// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const currentYearSpan = document.getElementById('currentYear');
const backToTopBtn = document.getElementById('backToTop');

// ShopEase Images Array
const shopeaseImages = [
    'ShopEase/Shopease1.png',
    'ShopEase/Shopease2.png',
    'ShopEase/Shopease3.png',
    'ShopEase/Shopease4.png',
    'ShopEase/Shopease5.png',
    'ShopEase/Shopease6.png',
    'ShopEase/Shopease7.png',
    'ShopEase/Shopease8.png'
];

let currentSlide = 0;
let slideInterval;

// Set Current Year in Footer
currentYearSpan.textContent = new Date().getFullYear();

// Initialize Image Slider
function initImageSlider() {
    const sliderTrack = document.querySelector('.slider-track');
    const sliderDots = document.querySelector('.slider-dots');
    
    if (!sliderTrack || !sliderDots) return;
    
    // Clear existing content
    sliderTrack.innerHTML = '';
    sliderDots.innerHTML = '';
    
    // Create slides and dots
    shopeaseImages.forEach((image, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `<img src="${image}" alt="ShopEase Screenshot ${index + 1}">`;
        sliderTrack.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('div');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });
    
    // Start auto-slide
    startAutoSlide();
}

// Go to specific slide
function goToSlide(index) {
    const sliderTrack = document.querySelector('.slider-track');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!sliderTrack || !dots.length) return;
    
    currentSlide = index;
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
    
    // Reset auto-slide timer
    resetAutoSlide();
}

// Next slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % shopeaseImages.length;
    goToSlide(currentSlide);
}

// Previous slide
function prevSlide() {
    currentSlide = (currentSlide - 1 + shopeaseImages.length) % shopeaseImages.length;
    goToSlide(currentSlide);
}

// Start auto-slide
function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 4000); // Change every 4 seconds
}

// Reset auto-slide
function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Mobile Navigation Toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.querySelector('i').classList.toggle('fa-bars');
    menuToggle.querySelector('i').classList.toggle('fa-times');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.querySelector('i').classList.add('fa-bars');
        menuToggle.querySelector('i').classList.remove('fa-times');
    });
});

// Back to Top Button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Calculate the offset based on navbar height
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize slider controls
function initSliderControls() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Pause slider on hover
    const sliderContainer = document.querySelector('.image-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
}

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const animation = entry.target.getAttribute('data-animation');
            if (animation) {
                entry.target.classList.add(animation);
            }
        }
    });
}, observerOptions);

// Observe all elements with data-animation attribute
document.querySelectorAll('[data-animation]').forEach(el => {
    observer.observe(el);
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initImageSlider();
    initSliderControls();
    updateActiveNavLink();
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Initialize animations on page load
    setTimeout(() => {
        document.querySelectorAll('[data-animation]').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                const animation = el.getAttribute('data-animation');
                el.classList.add(animation);
            }
        });
    }, 100);
});

// Contact form simulation
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        // Don't prevent default - let it open email client
        // Just log for debugging
        console.log('Opening email client...');
    });
});

// Add active class to nav links on click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        // Remove active class from all links
        document.querySelectorAll('.nav-links a').forEach(l => {
            l.classList.remove('active');
        });
        
        // Add active class to clicked link
        this.classList.add('active');
    });
});