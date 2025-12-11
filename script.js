// ===== DOM Elements =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const currentYearSpan = document.getElementById('currentYear');
const backToTopBtn = document.getElementById('backToTop');
const progressBar = document.querySelector('.progress-bar');
const cursorFollower = document.querySelector('.cursor-follower');

// ===== ShopEase Images =====
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

let currentImageIndex = 0;
let slideshowInterval;
let isSlideshowPlaying = false;

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    setCurrentYear();
    initNavigation();
    initImageGallery();
    initScrollEffects();
    initAnimations();
    initContactForm();
    initParticles();
    initCursorFollower();
    initTypingEffect();
}

// ===== Current Year =====
function setCurrentYear() {
    currentYearSpan.textContent = new Date().getFullYear();
}

// ===== Navigation =====
function initNavigation() {
    // Mobile menu toggle
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    const hamburger = document.querySelector('.hamburger');
    hamburger.classList.toggle('active');
}

function closeMobileMenu() {
    navLinks.classList.remove('active');
    document.querySelector('.hamburger').classList.remove('active');
}

function smoothScroll(e) {
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
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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

// ===== Image Gallery =====
function initImageGallery() {
    createThumbnails();
    setupGalleryControls();
    setupViewOptions();
    startSlideshow();
}

function createThumbnails() {
    const thumbnailGrid = document.querySelector('.thumbnail-grid');
    const mainImage = document.getElementById('main-image');
    
    if (!thumbnailGrid || !mainImage) return;
    
    thumbnailGrid.innerHTML = '';
    
    shopeaseImages.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="ShopEase Screenshot ${index + 1}" loading="lazy">`;
        
        thumbnail.addEventListener('click', () => {
            setActiveImage(index);
        });
        
        thumbnail.addEventListener('mouseenter', () => {
            if (!isSlideshowPlaying) {
                setActiveImage(index);
            }
        });
        
        thumbnailGrid.appendChild(thumbnail);
    });
}

function setupGalleryControls() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const playBtn = document.querySelector('.play-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            navigateImage(-1);
            resetSlideshow();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            navigateImage(1);
            resetSlideshow();
        });
    }
    
    if (playBtn) {
        playBtn.addEventListener('click', toggleSlideshow);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            navigateImage(-1);
            resetSlideshow();
        } else if (e.key === 'ArrowRight') {
            navigateImage(1);
            resetSlideshow();
        } else if (e.key === ' ') {
            e.preventDefault();
            toggleSlideshow();
        }
    });
}

function setupViewOptions() {
    const viewOptions = document.querySelectorAll('.view-option');
    const thumbnailGrid = document.querySelector('.thumbnail-grid');
    
    viewOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            viewOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Apply view mode
            const viewMode = option.dataset.view;
            applyViewMode(viewMode, thumbnailGrid);
        });
    });
}

function applyViewMode(mode, container) {
    if (!container) return;
    
    container.className = 'thumbnail-grid';
    
    switch(mode) {
        case 'grid':
            container.classList.add('grid-view');
            container.style.gridTemplateColumns = 'repeat(4, 1fr)';
            break;
        case 'carousel':
            container.classList.add('carousel-view');
            container.style.gridTemplateColumns = 'repeat(8, 1fr)';
            container.style.overflowX = 'auto';
            break;
        case 'masonry':
            container.classList.add('masonry-view');
            container.style.gridTemplateColumns = 'repeat(2, 1fr)';
            break;
    }
}

function setActiveImage(index) {
    currentImageIndex = index;
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage) {
        mainImage.src = shopeaseImages[index];
        mainImage.alt = `ShopEase Screenshot ${index + 1}`;
        
        // Add animation
        mainImage.classList.remove('active');
        setTimeout(() => {
            mainImage.classList.add('active');
        }, 10);
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

function startSlideshow() {
    slideshowInterval = setInterval(() => {
        navigateImage(1);
    }, 3000);
    isSlideshowPlaying = true;
    updatePlayButton();
}

function stopSlideshow() {
    clearInterval(slideshowInterval);
    isSlideshowPlaying = false;
    updatePlayButton();
}

function toggleSlideshow() {
    if (isSlideshowPlaying) {
        stopSlideshow();
    } else {
        startSlideshow();
    }
}

function resetSlideshow() {
    stopSlideshow();
    setTimeout(() => {
        if (!isSlideshowPlaying) return;
        startSlideshow();
    }, 10000); // Restart after 10 seconds of inactivity
}

function updatePlayButton() {
    const playBtn = document.querySelector('.play-btn');
    if (!playBtn) return;
    
    const icon = playBtn.querySelector('i');
    if (isSlideshowPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        playBtn.setAttribute('aria-label', 'Pause slideshow');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        playBtn.setAttribute('aria-label', 'Play slideshow');
    }
}

// ===== Scroll Effects =====
function initScrollEffects() {
    // Back to top button
    window.addEventListener('scroll', toggleBackToTop);
    backToTopBtn.addEventListener('click', scrollToTop);
    
    // Progress bar
    window.addEventListener('scroll', updateProgressBar);
    
    // Parallax effect
    window.addEventListener('scroll', applyParallax);
}

function toggleBackToTop() {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function updateProgressBar() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
}

function applyParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// ===== Animations =====
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animation class
                const animation = element.dataset.aos;
                if (animation) {
                    element.classList.add('aos-animate');
                }
                
                // Add specific animation effects
                if (element.classList.contains('timeline-item')) {
                    animateTimelineItem(element);
                }
                
                if (element.classList.contains('feature-card')) {
                    animateFeatureCard(element);
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
    
    // Add hover animations
    addHoverAnimations();
}

function animateTimelineItem(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateX(-30px)';
    
    setTimeout(() => {
        element.style.transition = 'all 0.6s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
    }, 100);
}

function animateFeatureCard(element) {
    element.style.transform = 'translateY(20px)';
    element.style.opacity = '0';
    
    setTimeout(() => {
        element.style.transition = 'all 0.4s ease';
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
    }, 200);
}

function addHoverAnimations() {
    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card, .resume-card, .info-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = 'var(--shadow-xl)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow-lg)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .project-link, .link-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

function createRipple(e) {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// ===== Contact Form =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Add input animations
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.querySelector('span').textContent;
    const originalIcon = submitBtn.querySelector('i').className;
    
    // Show loading state
    submitBtn.querySelector('span').textContent = 'Sending...';
    submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Show success state
        submitBtn.querySelector('span').textContent = 'Message Sent!';
        submitBtn.querySelector('i').className = 'fas fa-check';
        submitBtn.style.background = 'var(--gradient-secondary)';
        
        // Reset form
        form.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.querySelector('i').className = originalIcon;
            submitBtn.style.background = 'var(--gradient-primary)';
            submitBtn.disabled = false;
        }, 3000);
    }, 2000);
}

// ===== Particles Background =====
function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 3 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    // Apply styles
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: var(--primary);
        border-radius: 50%;
        left: ${posX}%;
        top: ${posY}%;
        opacity: ${Math.random() * 0.3 + 0.1};
        animation: float ${duration}s ease-in-out ${delay}s infinite;
    `;
    
    container.appendChild(particle);
}

// ===== Cursor Follower =====
function initCursorFollower() {
    if (!cursorFollower) return;
    
    document.addEventListener('mousemove', (e) => {
        cursorFollower.style.left = `${e.clientX}px`;
        cursorFollower.style.top = `${e.clientY}px`;
    });
    
    // Add interactive effects
    const interactiveElements = document.querySelectorAll('a, button, .thumbnail, .control-btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(2)';
            cursorFollower.style.background = 'var(--primary)';
            cursorFollower.style.opacity = '0.3';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.background = 'var(--primary)';
            cursorFollower.style.opacity = '0.5';
        });
    });
}

// ===== Typing Effect =====
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const texts = [
        'Software Engineer',
        'AI & ML Specialist',
        'Full Stack Developer',
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
            // Pause at end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to next word
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing effect after a short delay
    setTimeout(type, 1000);
}

// ===== Countdown Timer =====
function initCountdownTimer() {
    const countdownElements = document.querySelectorAll('.countdown-value');
    if (!countdownElements.length) return;
    
    const launchDate = new Date('2025-06-01T00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate - now;
        
        if (distance < 0) {
            // Launch date has passed
            countdownElements.forEach(el => el.textContent = '00');
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        const values = [days, hours, minutes];
        
        countdownElements.forEach((el, index) => {
            el.textContent = values[index].toString().padStart(2, '0');
        });
    }
    
    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
}

// ===== Theme Toggle =====
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            themeToggle.querySelector('span').textContent = 'Dark';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            themeToggle.querySelector('span').textContent = 'Light';
        }
    });
}

// ===== Initialize Additional Features =====
initCountdownTimer();
initThemeToggle();

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== Window Load Event =====
window.addEventListener('load', () => {
    // Remove loading state if any
    document.body.classList.add('loaded');
    
    // Initialize any lazy-loaded images
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
});

// ===== Error Handling =====
window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
    // You could add error reporting here
}, true);

// ===== Performance Monitoring =====
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log(`${entry.name}: ${entry.duration}ms`);
        }
    });
    
    perfObserver.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
}