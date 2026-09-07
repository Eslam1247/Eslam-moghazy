document.addEventListener("DOMContentLoaded", () => {
    const pages = [...document.querySelectorAll(".page")];
    const progressBar = document.getElementById("progress-bar-fill");
    const currentPageEl = document.getElementById("current-page-num");
    const totalPageEl = document.getElementById("total-page-num");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const book = document.getElementById("book");

    const isMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

    // ---------------------------------------------------------
    // Fast start: no blocking preloader, no particles, no audio,
    // no custom cursor, no magnetic effects on touch devices.
    // ---------------------------------------------------------

    function updateProgress(index, total = pages.length) {
        if (!progressBar || total < 2) return;
        const percent = Math.max(0, Math.min(100, (index / (total - 1)) * 100));
        progressBar.style.width = `${percent}%`;
        if (currentPageEl) currentPageEl.textContent = index + 1;
        if (totalPageEl) totalPageEl.textContent = total;
    }

    if (isMobile) {
        // Mobile is a normal, accessible scrolling portfolio.
        // This avoids the expensive/awkward flipbook interaction on phones.
        document.body.classList.add("mobile-mode");
        updateProgress(0);

        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible) {
                const index = pages.indexOf(visible.target);
                if (index >= 0) {
                    updateProgress(index);
                    visible.target.classList.add("is-active");
                }
            }
        }, {
            root: null,
            threshold: [0.25, 0.5, 0.75]
        });

        pages.forEach(page => observer.observe(page));

        // Smoothly reveal the first screen without a long preloader.
        if (!reduceMotion) {
            requestAnimationFrame(() => pages[0]?.classList.add("is-active"));
        }

        return;
    }

    // ---------------------------------------------------------
    // Desktop: load PageFlip only when it is actually needed.
    // Mobile never downloads the library.
    // ---------------------------------------------------------
    function loadPageFlipLibrary() {
        return new Promise((resolve, reject) => {
            if (window.St?.PageFlip) {
                resolve();
                return;
            }

            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js";
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    loadPageFlipLibrary()
        .then(() => {
            if (!window.St?.PageFlip || !book) throw new Error("PageFlip unavailable");

            const pageFlip = new St.PageFlip(book, {
                width: 450,
                height: 600,
                size: "fixed",
                minWidth: 320,
                maxWidth: 600,
                minHeight: 440,
                maxHeight: 800,
                drawShadow: true,
                showCover: true,
                usePortrait: false,
                mobileScrollSupport: false,
                maxShadowOpacity: 0.35,
                flippingTime: reduceMotion ? 0 : 650
            });

            pageFlip.loadFromHTML(pages);
            updateProgress(0, pageFlip.getPageCount());

            pageFlip.on("flip", (event) => {
                const index = Number(event.data) || 0;
                updateProgress(index, pageFlip.getPageCount());

                pages.forEach((page, i) => {
                    page.classList.toggle("is-active", i === index || i === index + 1);
                });
            });

            prevBtn?.addEventListener("click", () => pageFlip.flipPrev());
            nextBtn?.addEventListener("click", () => pageFlip.flipNext());

            document.getElementById("restartBtn")?.addEventListener("click", () => {
                pageFlip.turnToPage(0);
            });

            pages[0]?.classList.add("is-active");
        })
        .catch(() => {
            // Graceful fallback if CDN is unavailable:
            // turn the desktop book into a normal vertical page stack.
            document.body.classList.add("fallback-mode");
            book?.classList.add("fallback-book");
            pages.forEach(page => page.classList.add("is-active"));
            if (prevBtn?.parentElement) prevBtn.parentElement.style.display = "none";
            updateProgress(0);
        });

    // Keep keyboard navigation useful on desktop.
    document.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        if (!window.St?.PageFlip) return;
        // PageFlip owns keyboard interaction when initialized.
    });
});
