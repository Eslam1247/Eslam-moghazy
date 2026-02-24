document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            });
        });
    }

    // --- Sticky Navbar Effect ---
    const navbar = document.querySelector('.navbar, .projects-navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            const isMainNavbar = navbar.classList.contains('navbar');
            if (window.scrollY > 50) {
                if (isMainNavbar) {
                    navbar.style.padding = '15px 50px';
                }
                navbar.style.background = 'rgba(18, 18, 18, 0.95)';
                navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            } else {
                if (isMainNavbar) {
                    navbar.style.padding = '20px 50px';
                }
                navbar.style.background = isMainNavbar ? 'rgba(26, 26, 26, 0.85)' : 'rgba(18, 18, 18, 0.8)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-scroll');
    fadeElements.forEach(el => observer.observe(el));

    // --- Active Link Highlight on Scroll ---
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // --- Mouse Move Glow Effect for Hero Image ---
    const heroImage = document.querySelector('.image-wrapper');

    if (heroImage) {
        heroImage.addEventListener('mousemove', (e) => {
            const { x, y, width, height } = heroImage.getBoundingClientRect();
            const centerX = x + width / 2;
            const centerY = y + height / 2;

            const moveX = (e.clientX - centerX) / 20;
            const moveY = (e.clientY - centerY) / 20;

            heroImage.querySelector('img').style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
        });

        heroImage.addEventListener('mouseleave', () => {
            heroImage.querySelector('img').style.transform = `scale(1) translate(0px, 0px)`;
        });
    }

    // --- Reviews Slider ---
    const grid = document.querySelector('.testimonials-grid');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const controls = document.querySelector('.reviews-controls');

    if (grid && cards.length > 0) {
        let currentIndex = 0;

        // Initialize slider state
        grid.classList.add('slider');
        if (controls) controls.style.display = 'flex';
        cards[0].classList.add('active');

        const updateSlider = (index) => {
            if (index < 0 || index >= cards.length) return;

            cards.forEach(card => card.classList.remove('active'));
            cards[index].classList.add('active');
            grid.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;

            // Handle button accessibility/states
            if (prevBtn) prevBtn.style.opacity = index === 0 ? '0.3' : '1';
            if (nextBtn) nextBtn.style.opacity = index === cards.length - 1 ? '0.3' : '1';
            if (prevBtn) prevBtn.disabled = index === 0;
            if (nextBtn) nextBtn.disabled = index === cards.length - 1;
        };

        // Set initial state
        updateSlider(0);

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < cards.length - 1) {
                    updateSlider(currentIndex + 1);
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    updateSlider(currentIndex - 1);
                }
            });
        }

        // Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;

        grid.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        grid.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const threshold = 50;
            if (touchEndX < touchStartX - threshold) {
                // Swipe Left -> Next
                if (currentIndex < cards.length - 1) updateSlider(currentIndex + 1);
            }
            if (touchEndX > touchStartX + threshold) {
                // Swipe Right -> Prev
                if (currentIndex > 0) updateSlider(currentIndex - 1);
            }
        };

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                if (currentIndex > 0) updateSlider(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                if (currentIndex < cards.length - 1) updateSlider(currentIndex + 1);
            }
        });
    }

});
