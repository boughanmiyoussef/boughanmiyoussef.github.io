// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initSmoothScrolling();
    initBackToTop();
    initGallery();
    initContactForm();
    initMobileMenu();
    initPrintStyles();
    initPerformanceOptimization();
});

// ====== Navigation Functions ======
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Highlight active nav link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
        
        // Navbar background on scroll
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}

// ====== Mobile Menu ======
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// ====== Scroll Animations ======
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    
    const revealSections = function() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            
            if (sectionTop < windowHeight - revealPoint) {
                section.classList.add('visible');
            }
        });
    };
    
    // Initial check
    revealSections();
    
    // Check on scroll with throttling
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                revealSections();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ====== Smooth Scrolling ======
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                // Smooth scroll
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ====== Back to Top Button ======
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ====== Project Gallery ======
function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const currentImageSpan = document.getElementById('currentImage');
    const totalImagesSpan = document.getElementById('totalImages');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // ShopEase images array
    const shopEaseImages = [
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
    const imagesPerPage = 4;
    
    // Initialize gallery
    function loadGalleryImages() {
        if (!galleryGrid) return;
        
        galleryGrid.innerHTML = '';
        
        // Calculate start and end indices
        const startIndex = currentImageIndex;
        const endIndex = Math.min(startIndex + imagesPerPage, shopEaseImages.length);
        
        // Load images
        for (let i = startIndex; i < endIndex; i++) {
            const imgIndex = i % shopEaseImages.length;
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-index', imgIndex);
            
            const img = document.createElement('img');
            img.src = shopEaseImages[imgIndex];
            img.alt = `ShopEase Screenshot ${imgIndex + 1}`;
            img.loading = 'lazy';
            
            // Add click to enlarge functionality
            galleryItem.addEventListener('click', function() {
                openLightbox(imgIndex);
            });
            
            galleryItem.appendChild(img);
            galleryGrid.appendChild(galleryItem);
        }
        
        // Update counters
        if (currentImageSpan) {
            currentImageSpan.textContent = Math.floor(currentImageIndex / imagesPerPage) + 1;
        }
        
        if (totalImagesSpan) {
            totalImagesSpan.textContent = Math.ceil(shopEaseImages.length / imagesPerPage);
        }
    }
    
    // Navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex - imagesPerPage + shopEaseImages.length) % shopEaseImages.length;
            loadGalleryImages();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex + imagesPerPage) % shopEaseImages.length;
            loadGalleryImages();
        });
    }
    
    // Lightbox functionality
    function openLightbox(index) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                <img src="${shopEaseImages[index]}" alt="ShopEase Screenshot">
                <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
                <div class="lightbox-counter">${index + 1} / ${shopEaseImages.length}</div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        let currentIndex = index;
        
        // Close lightbox
        lightbox.querySelector('.lightbox-close').addEventListener('click', function() {
            document.body.removeChild(lightbox);
        });
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                document.body.removeChild(lightbox);
            }
        });
        
        // Navigation
        lightbox.querySelector('.lightbox-prev').addEventListener('click', function(e) {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + shopEaseImages.length) % shopEaseImages.length;
            updateLightboxImage();
        });
        
        lightbox.querySelector('.lightbox-next').addEventListener('click', function(e) {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % shopEaseImages.length;
            updateLightboxImage();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function handleKeyPress(e) {
            if (!document.querySelector('.lightbox')) return;
            
            switch(e.key) {
                case 'Escape':
                    document.body.removeChild(lightbox);
                    document.removeEventListener('keydown', handleKeyPress);
                    break;
                case 'ArrowLeft':
                    currentIndex = (currentIndex - 1 + shopEaseImages.length) % shopEaseImages.length;
                    updateLightboxImage();
                    break;
                case 'ArrowRight':
                    currentIndex = (currentIndex + 1) % shopEaseImages.length;
                    updateLightboxImage();
                    break;
            }
        });
        
        function updateLightboxImage() {
            const img = lightbox.querySelector('img');
            img.src = shopEaseImages[currentIndex];
            img.alt = `ShopEase Screenshot ${currentIndex + 1}`;
            lightbox.querySelector('.lightbox-counter').textContent = `${currentIndex + 1} / ${shopEaseImages.length}`;
        }
        
        // Add lightbox styles
        if (!document.querySelector('#lightbox-styles')) {
            const style = document.createElement('style');
            style.id = 'lightbox-styles';
            style.textContent = `
                .lightbox {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .lightbox-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                .lightbox-content img {
                    max-width: 100%;
                    max-height: 80vh;
                    border-radius: 8px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }
                .lightbox-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                }
                .lightbox-prev,
                .lightbox-next {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s;
                }
                .lightbox-prev:hover,
                .lightbox-next:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                .lightbox-prev {
                    left: 20px;
                }
                .lightbox-next {
                    right: 20px;
                }
                .lightbox-counter {
                    position: absolute;
                    bottom: -40px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    color: white;
                    font-size: 1rem;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Initialize gallery
    loadGalleryImages();
}

// ====== Contact Form ======
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData);
            
            // Simple validation
            if (!formValues.name || !formValues.email || !formValues.message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formValues.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // In a real application, you would send the data to a server
            // For this demo, simulate successful submission
            showNotification('Message sent successfully! I will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Log submission (for demo purposes)
            console.log('Contact form submitted:', {
                ...formValues,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    // Notification function
    function showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Add notification styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    z-index: 3000;
                    animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 4.7s forwards;
                    max-width: 400px;
                    border-left: 4px solid #2563eb;
                }
                .notification.success {
                    border-left-color: #10b981;
                }
                .notification.error {
                    border-left-color: #ef4444;
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification-content i {
                    font-size: 1.2rem;
                }
                .notification.success i {
                    color: #10b981;
                }
                .notification.error i {
                    color: #ef4444;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #64748b;
                    cursor: pointer;
                    padding: 0;
                    width: 25px;
                    height: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Close notification
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// ====== Print Styles ======
function initPrintStyles() {
    // Add print button functionality
    const printButton = document.createElement('button');
    printButton.className = 'print-btn';
    printButton.innerHTML = '<i class="fas fa-print"></i>';
    printButton.title = 'Print Portfolio';
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    // Add print button styles
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        .print-btn {
            position: fixed;
            bottom: 90px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--gradient-primary);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            box-shadow: var(--box-shadow);
            transition: var(--transition);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .print-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 10px 30px rgba(37, 99, 235, 0.4);
        }
        @media print {
            .print-btn {
                display: none;
            }
        }
    `;
    document.head.appendChild(printStyles);
    document.body.appendChild(printButton);
}

// ====== Performance Optimization ======
function initPerformanceOptimization() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Debounce scroll events
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
    
    // Optimize scroll performance
    window.addEventListener('scroll', debounce(function() {
        // Your scroll-dependent code here
    }, 100));
}

// ====== CV Button Tracking ======
function trackCVAction(action) {
    // You can integrate with Google Analytics here
    if (typeof gtag !== 'undefined') {
        gtag('event', `cv_${action}`, {
            'event_category': 'engagement',
            'event_label': 'CV Interaction'
        });
    }
    
    // Or simply log to console for debugging
    console.log(`CV ${action} tracked at:`, new Date().toISOString());
}

// Attach tracking to CV buttons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.cv-buttons a').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.toLowerCase().includes('view') ? 'view' : 'download';
            trackCVAction(action);
        });
    });
});

// ====== Initialize Everything ======
// Call all initialization functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearSpan = document.querySelector('.footer-bottom p');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.innerHTML = yearSpan.innerHTML.replace('2025', currentYear);
    }
    
    // Add loading class to body and remove when loaded
    document.body.classList.add('loading');
    window.addEventListener('load', function() {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    });
});

// Add loading styles
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    .loading {
        overflow: hidden;
    }
    .loading::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--gradient-primary);
        z-index: 9999;
        animation: fadeOut 0.5s ease 1s forwards;
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; visibility: hidden; }
    }
`;
document.head.appendChild(loadingStyles);