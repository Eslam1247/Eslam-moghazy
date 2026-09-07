PORTFOLIO V2 — Mobile & Performance Update

What changed
- Removed Light Mode completely; portfolio is dark-only.
- Mobile no longer uses the flipbook. It becomes a vertical, touch-friendly portfolio with natural scrolling.
- Removed long cinematic preloader.
- Removed particles, custom cursor, hover sounds, click ripples, magnetic effects and desktop tilt from the mobile path.
- PageFlip is loaded only on desktop, so phones do not download it.
- Added mobile-safe sizing with 100svh and responsive cards/typography.
- Added IntersectionObserver progress tracking on mobile.
- Converted portfolio images to optimized WebP and reduced oversized image dimensions dramatically.
- Added lazy loading + async decoding to non-critical images.
- Added reduced-motion support.
- Renamed the main file from inedex.html to index.html.

Important
- Replace the # Open Graph URL in index.html with the real deployed site URL before publishing.
- The Case buttons and CV button still use # because the original file did not contain real case-study/CV URLs.
