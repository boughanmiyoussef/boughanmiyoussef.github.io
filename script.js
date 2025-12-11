// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // ShopEase Gallery
    const thumbsContainer = document.getElementById('thumbs');
    const mainImage = document.getElementById('mainImage');
    const imageCount = 8;

    // Generate thumbnails
    for (let i = 1; i <= imageCount; i++) {
        const img = document.createElement('img');
        img.src = `assets/images/ShopEase${i}.png`;
        img.alt = `ShopEase Screenshot ${i}`;
        img.dataset.index = i;
        if (i === 1) img.classList.add('active');
        img.addEventListener('click', () => {
            // Update active class
            document.querySelectorAll('#thumbs img').forEach(t => t.classList.remove('active'));
            img.classList.add('active');
            // Swap main image
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = img.src;
                mainImage.style.opacity = '1';
            }, 200);
        });
        thumbsContainer.appendChild(img);
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Current year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});