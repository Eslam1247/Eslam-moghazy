document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Cinematic Preloader ---
    const preloader = document.getElementById('preloader');
    const cinematicTexts = document.querySelectorAll('.cinematic-text');
    
    cinematicTexts.forEach((text, index) => {
        setTimeout(() => {
            text.classList.add('animate-cinema');
        }, index * 400); 
    });

    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.visibility = 'hidden';
        }, 1000);
    }, 3500);

    // --- 2. Floating Particles & Parallax ---
    const particlesContainer = document.getElementById('particles-container');
    function createParticles() {
        for (let i = 0; i < 40; i++) {
            let particle = document.createElement('div');
            particle.classList.add('particle');
            let size = Math.random() * 3 + 1; 
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 15 + 10}s`; 
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particlesContainer.appendChild(particle);
        }
    }
    createParticles();

    // --- 3. Custom Cursor & Mobile Ripple Logic ---
    const cursor = document.getElementById("cursor");
    const cursorFollower = document.getElementById("cursor-follower");
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let followerX = mouseX, followerY = mouseY;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if(cursor) {
            cursor.style.left = mouseX + "px";
            cursor.style.top = mouseY + "px";
        }
        
        if(particlesContainer) {
            const moveX = (mouseX - window.innerWidth / 2) * -0.01;
            const moveY = (mouseY - window.innerHeight / 2) * -0.01;
            particlesContainer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        if(cursorFollower) {
            cursorFollower.style.left = followerX + "px";
            cursorFollower.style.top = followerY + "px";
        }
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = document.querySelectorAll(".hover-target, a, button, .tool-tag, .skill-tags span, .social-card");
    hoverTargets.forEach(target => {
        target.addEventListener("mouseenter", () => cursorFollower && cursorFollower.classList.add("active"));
        target.addEventListener("mouseleave", () => cursorFollower && cursorFollower.classList.remove("active"));
    });

    document.addEventListener("click", function (e) {
        let ripple = document.createElement("div");
        ripple.classList.add("click-ripple");
        document.body.appendChild(ripple);
        
        let size = 40; 
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - size/2}px`;
        ripple.style.top = `${e.clientY - size/2}px`;
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // --- 4. Magnetic Effect ---
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const position = el.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        el.addEventListener('mouseout', () => {
            el.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- 5. Global Audio Settings ---
    const muteToggle = document.getElementById("mute-toggle");
    const flipSound = document.getElementById("flipSound");
    const hoverSound = document.getElementById("hoverSound");
    if(flipSound) flipSound.volume = 0.4;
    if(hoverSound) hoverSound.volume = 0.1;
    let isMuted = false;

    muteToggle.addEventListener("click", () => {
        isMuted = !isMuted;
        muteToggle.textContent = isMuted ? "🔇" : "🔊";
    });

    function playHoverSound() {
        if (!isMuted && hoverSound) {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(()=>{}); 
        }
    }

    hoverTargets.forEach(target => {
        target.addEventListener("mouseenter", playHoverSound);
    });

    // --- 6. PageFlip Initialization & Counters ---
    const bookElement = document.getElementById("book");
    const isMobile = window.innerWidth <= 768;

    const pageFlip = new St.PageFlip(bookElement, {
        width: isMobile ? window.innerWidth * 0.9 : 450,
        height: isMobile ? window.innerHeight * 0.75 : 600,
        size: "fixed",
        minWidth: 300,
        maxWidth: 600,
        minHeight: 400,
        maxHeight: 800,
        drawShadow: true,
        showCover: true,
        usePortrait: isMobile,
        mobileScrollSupport: false
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page"));

    const progressBarFill = document.getElementById("progress-bar-fill");
    const currentPageEl = document.getElementById("current-page-num");
    const totalPageEl = document.getElementById("total-page-num");
    
    // Set total pages on load
    setTimeout(() => {
        if(totalPageEl) totalPageEl.innerText = pageFlip.getPageCount();
    }, 500);

    pageFlip.on("flip", (e) => {
        if (!isMuted && flipSound) {
            flipSound.currentTime = 0;
            flipSound.play().catch(()=>{});
        }
        
        const totalPages = pageFlip.getPageCount();
        const currentPage = e.data;
        
        // Update Progress Bar & Counter
        const progressPercentage = (currentPage / (totalPages - 1)) * 100;
        progressBarFill.style.width = `${progressPercentage}%`;
        if(currentPageEl) currentPageEl.innerText = currentPage + 1;

        // Active classes for stagger animations
        document.querySelectorAll(".page").forEach((page, index) => {
            if (index === currentPage || index === currentPage + 1) {
                page.classList.add("is-active");
            } else {
                page.classList.remove("is-active");
            }
        });
    });

    document.getElementById("prevBtn").addEventListener("click", () => pageFlip.flipPrev());
    document.getElementById("nextBtn").addEventListener("click", () => pageFlip.flipNext());
    
    const restartBtn = document.getElementById("restartBtn");
    if(restartBtn) {
        restartBtn.addEventListener("click", () => pageFlip.turnToPage(0));
    }

    // 3D Tilt Effect
    const tiltCards = document.querySelectorAll('.tilt-card');
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
        tiltCards.forEach(card => {
            if (card.closest('.page.is-active') || card.closest('.page-cover.is-active')) {
                card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            }
        });
    });

    // --- 7. Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const transitionLayer = document.getElementById('theme-transition-layer');
    let currentTheme = 'dark';

    themeToggle.addEventListener('click', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        transitionLayer.style.transition = 'none';
        transitionLayer.style.clipPath = `circle(0px at ${x}px ${y}px)`;
        transitionLayer.style.backgroundColor = currentTheme === 'dark' ? '#E2E8F0' : '#020617';
        
        void transitionLayer.offsetWidth;
        
        transitionLayer.style.transition = 'clip-path 1s cubic-bezier(0.77, 0, 0.175, 1)';
        transitionLayer.style.clipPath = `circle(150% at ${x}px ${y}px)`;
        
        setTimeout(() => {
            if (currentTheme === 'dark') {
                document.body.setAttribute('data-theme', 'light');
                themeToggle.innerHTML = '🌙 Dark Mode';
                currentTheme = 'light';
            } else {
                document.body.removeAttribute('data-theme');
                themeToggle.innerHTML = '☀️ Light Mode';
                currentTheme = 'dark';
            }
            transitionLayer.style.clipPath = `circle(0px at ${x}px ${y}px)`;
        }, 1000);
    });

    // --- 8. Copy Email Toast ---
    const copyEmailBtn = document.getElementById("copyEmailBtn");
    const toast = document.getElementById("toast");
    
    if(copyEmailBtn) {
        copyEmailBtn.addEventListener("click", () => {
            const email = copyEmailBtn.getAttribute("data-email");
            navigator.clipboard.writeText(email).then(() => {
                toast.classList.add("show");
                setTimeout(() => {
                    toast.classList.remove("show");
                }, 3000);
            });
        });
    }

    // Initialize first page animation
    setTimeout(() => {
        document.querySelectorAll(".page")[0].classList.add("is-active");
    }, 3500); 
});