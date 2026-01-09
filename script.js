// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const galleryGrid = document.querySelector('.gallery-grid');
    
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
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Contact form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real application, you would send the form data to a server
        // For this demo, we'll just show an alert
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
    
    // Load ShopEase gallery images
    function loadGalleryImages() {
        galleryGrid.innerHTML = '';
        
        // Show 4 images at a time
        const startIndex = currentImageIndex;
        const endIndex = Math.min(startIndex + 4, shopEaseImages.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const imgIndex = i % shopEaseImages.length;
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = shopEaseImages[imgIndex];
            img.alt = `ShopEase Screenshot ${imgIndex + 1}`;
            img.loading = 'lazy';
            
            galleryItem.appendChild(img);
            galleryGrid.appendChild(galleryItem);
        }
    }
    
    // Initialize gallery
    loadGalleryImages();
    
    // Gallery navigation
    prevBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 4 + shopEaseImages.length) % shopEaseImages.length;
        loadGalleryImages();
    });
    
    nextBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 4) % shopEaseImages.length;
        loadGalleryImages();
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.skill-category, .project-card, .stat-card, .contact-item').forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.8s forwards;
        }
        
        .skill-category, .project-card, .stat-card, .contact-item {
            opacity: 0;
            transform: translateY(30px);
        }
    `;
    document.head.appendChild(style);
    
    // Initialize typing effect for hero section
    const heroText = document.querySelector('.hero-text p');
    const originalText = heroText.textContent;
    
    // Create a typing effect
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Start typing effect after a delay
    setTimeout(() => {
        typeWriter(heroText, originalText);
    }, 1500);
});