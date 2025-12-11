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
let autoSlideInterval;
let isAutoSlidePlaying = true;

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    setCurrentYear();
    initNavigation();
    initShopEaseGallery();
    initBackToTop();
    initScrollAnimations();
}

// Set current year in footer
function setCurrentYear() {
    currentYearSpan.textContent = new Date().getFullYear();
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

// Enhanced ShopEase Gallery
function initShopEaseGallery() {
    if (!document.querySelector('.shop-ease-card')) return;
    
    createSlideshow();
    createGrid();
    setupViewToggle();
    setupSlideshowControls();
    startAutoSlide();
}

function createSlideshow() {
    const sliderThumbnails = document.querySelector('.slider-thumbnails');
    const mainSlideImg = document.getElementById('main-slide-img');
    const slideCounter = document.getElementById('slide-counter');
    
    if (!sliderThumbnails || !mainSlideImg) return;
    
    // Clear existing thumbnails
    sliderThumbnails.innerHTML = '';
    
    // Create thumbnails
    shopeaseImages.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail-item ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="ShopEase Screenshot ${index + 1}" loading="lazy">`;
        
        thumbnail.addEventListener('click', () => {
            showSlide(index);
        });
        
        thumbnail.addEventListener('mouseenter', () => {
            if (!isAutoSlidePlaying) {
                showSlide(index);
            }
        });
        
        sliderThumbnails.appendChild(thumbnail);
    });
    
    // Set initial slide
    showSlide(0);
}

function createGrid() {
    const imageGrid = document.querySelector('.image-grid');
    if (!imageGrid) return;
    
    imageGrid.innerHTML = '';
    
    shopeaseImages.forEach((image, index) => {
        const gridImage = document.createElement('div');
        gridImage.className = 'grid-image';
        gridImage.innerHTML = `<img src="${image}" alt="ShopEase Screenshot ${index + 1}" loading="lazy">`;
        
        gridImage.addEventListener('click', () => {
            // Switch to slideshow view and show this image
            switchToSlideshow();
            showSlide(index);
        });
        
        imageGrid.appendChild(gridImage);
    });
}

function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const sliderView = document.querySelector('.slider-view');
    const gridView = document.querySelector('.grid-view');
    const closeGridBtn = document.querySelector('.close-grid');
    
    if (!viewButtons.length) return;
    
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const viewType = button.dataset.view;
            
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Switch view
            if (viewType === 'slider') {
                switchToSlideshow();
            } else {
                switchToGridView();
            }
        });
    });
    
    if (closeGridBtn) {
        closeGridBtn.addEventListener('click', switchToSlideshow);
    }
}

function switchToSlideshow() {
    const sliderView = document.querySelector('.slider-view');
    const gridView = document.querySelector('.grid-view');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    if (sliderView) sliderView.classList.add('active');
    if (gridView) gridView.classList.remove('active');
    
    // Update button states
    viewButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === 'slider');
    });
    
    // Resume autoslide
    if (!isAutoSlidePlaying) {
        startAutoSlide();
    }
}

function switchToGridView() {
    const sliderView = document.querySelector('.slider-view');
    const gridView = document.querySelector('.grid-view');
    
    if (sliderView) sliderView.classList.remove('active');
    if (gridView) gridView.classList.add('active');
    
    // Pause autoslide when in grid view
    stopAutoSlide();
}

function setupSlideshowControls() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const playPauseBtn = document.querySelector('.play-pause');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            navigateSlide(-1);
            resetAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            navigateSlide(1);
            resetAutoSlide();
        });
    }
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', toggleAutoSlide);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            navigateSlide(-1);
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            navigateSlide(1);
            resetAutoSlide();
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            toggleAutoSlide();
        }
    });
}

function showSlide(index) {
    currentSlide = index;
    const mainSlideImg = document.getElementById('main-slide-img');
    const slideCounter = document.getElementById('slide-counter');
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    
    if (mainSlideImg) {
        // Add fade effect
        mainSlideImg.style.opacity = '0';
        setTimeout(() => {
            mainSlideImg.src = shopeaseImages[index];
            mainSlideImg.alt = `ShopEase Screenshot ${index + 1}`;
            mainSlideImg.style.opacity = '1';
            mainSlideImg.style.transition = 'opacity 0.3s ease';
        }, 150);
    }
    
    if (slideCounter) {
        slideCounter.textContent = `${index + 1} of ${shopeaseImages.length}`;
    }
    
    // Update active thumbnail
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function navigateSlide(direction) {
    currentSlide = (currentSlide + direction + shopeaseImages.length) % shopeaseImages.length;
    showSlide(currentSlide);
}

function startAutoSlide() {
    stopAutoSlide(); // Clear any existing interval
    autoSlideInterval = setInterval(() => {
        navigateSlide(1);
    }, 4000); // Change every 4 seconds
    
    isAutoSlidePlaying = true;
    updatePlayPauseButton();
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
    isAutoSlidePlaying = false;
    updatePlayPauseButton();
}

function toggleAutoSlide() {
    if (isAutoSlidePlaying) {
        stopAutoSlide();
    } else {
        startAutoSlide();
    }
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

function updatePlayPauseButton() {
    const playPauseBtn = document.querySelector('.play-pause');
    if (!playPauseBtn) return;
    
    const icon = playPauseBtn.querySelector('i');
    if (isAutoSlidePlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        playPauseBtn.setAttribute('aria-label', 'Play slideshow');
    }
}

// Back to Top Button
function initBackToTop() {
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
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
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
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

// Contact form simulation
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        // Don't prevent default - let it open email client
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

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);