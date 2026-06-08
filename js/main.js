// Animations with GSAP
document.addEventListener("DOMContentLoaded", (event) => {
    // === Dark Mode Init & Toggle ===
    const htmlEl = document.documentElement;
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlEl.classList.add('dark');
    } else {
        htmlEl.classList.remove('dark');
    }

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const iconEl = themeToggleBtn.querySelector('.theme-icon');
        if (htmlEl.classList.contains('dark')) {
            if (iconEl) iconEl.setAttribute('data-lucide', 'sun');
        } else {
            if (iconEl) iconEl.setAttribute('data-lucide', 'moon');
        }

        themeToggleBtn.addEventListener('click', () => {
            htmlEl.classList.toggle('dark');
            const isDark = htmlEl.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if (iconEl) {
                iconEl.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
                lucide.createIcons();
            }
        });
    }

    // Register scroll trigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations
    const heroTl = gsap.timeline();

    heroTl.from(".gs-hero-img", {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: "power3.out"
    })
        .from(".gs-hero-text > *", {
            opacity: 0,
            y: 30,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.6");

    // Features Section
    gsap.from(".gs-feature", {
        scrollTrigger: {
            trigger: ".gs-feature",
            start: "top 80%"
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out"
    });

    // Product Cards
    gsap.from(".gs-product", {
        scrollTrigger: {
            trigger: "#shop",
            start: "top 75%"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.2)"
    });

    // Testimonial
    gsap.from(".gs-testimonial-img", {
        scrollTrigger: {
            trigger: ".gs-testimonial-img",
            start: "top 70%"
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".gs-testimonial-text", {
        scrollTrigger: {
            trigger: ".gs-testimonial-text",
            start: "top 70%"
        },
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    // Instagram Feed
    gsap.from(".gs-insta > *", {
        scrollTrigger: {
            trigger: ".gs-insta",
            start: "top 85%"
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.5)"
    });

    // === Navbar Scroll ===
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.remove('bg-transparent', 'text-white', 'py-6');
                navbar.classList.add('bg-white/95', 'backdrop-blur-md', 'text-dark', 'py-4', 'shadow-sm', 'dark:bg-gray-900/95', 'dark:text-white');
            } else {
                navbar.classList.add('bg-transparent', 'text-white', 'py-6');
                navbar.classList.remove('bg-white/95', 'backdrop-blur-md', 'text-dark', 'py-4', 'shadow-sm', 'dark:bg-gray-900/95', 'dark:text-white');
            }
        });
    }

    // === Mobile Sidebar ===
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileBackdrop = document.getElementById('mobile-backdrop');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');

    function toggleMobileMenu(show) {
        if (!mobileSidebar || !mobileBackdrop) return;
        if (show) {
            mobileSidebar.classList.remove('translate-x-full');
            mobileBackdrop.classList.remove('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'hidden';
        } else {
            mobileSidebar.classList.add('translate-x-full');
            mobileBackdrop.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => toggleMobileMenu(true));

        if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
        if (mobileBackdrop) mobileBackdrop.addEventListener('click', () => toggleMobileMenu(false));

        const mobileLinks = document.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => toggleMobileMenu(false));
        });
    }

    // === Custom Hero Slider ===
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');

    if (slides.length > 0) {
        let currentSlide = 0;
        let heroInterval;

        function goToSlide(index) {
            // Hide all slides
            slides.forEach(s => {
                s.classList.add('opacity-0', 'pointer-events-none');
                s.classList.remove('opacity-100', 'active-slide');
            });
            // Show target slide
            slides[index].classList.remove('opacity-0', 'pointer-events-none');
            // Small timeout to allow Display to register before class mutation for CSS transitions
            setTimeout(() => {
                slides[index].classList.add('opacity-100', 'active-slide');
            }, 10);

            // Update pagination dots
            dots.forEach((d, i) => {
                d.classList.toggle('opacity-100', i === index);
                d.classList.toggle('opacity-40', i !== index);
            });

            currentSlide = index;
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        }

        // Attach dot click handlers
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearInterval(heroInterval);
                goToSlide(parseInt(dot.dataset.slide));
                heroInterval = setInterval(nextSlide, 8000); // 8 second slow cinematic pace
            });
        });

        // Boot first slide and start auto-play
        goToSlide(0);
        heroInterval = setInterval(nextSlide, 8000);
    }

    // === Cart Logic ===
    let cartCount = 0;
    const cartCountEl = document.getElementById("cart-count");

    window.addToCart = function (price) {
        cartCount++;
        cartCountEl.innerText = cartCount;

        // Cart bounce animation
        gsap.fromTo(cartCountEl, { scale: 1 }, { scale: 1.5, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" });
        gsap.fromTo("#cart-btn", { y: 0 }, { y: -5, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" });

        // Show Toast
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.remove('opacity-0', 'translate-y-12', 'pointer-events-none');
            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-12', 'pointer-events-none');
            }, 3000);
        }
    };

    // === Detail Page Logic ===
    // Modal logic has been retired in favor of standalone detail_product.html page


    // Attach logic to existing Product Cards dynamically
    const productCards = document.querySelectorAll('.gs-product');
    productCards.forEach((card) => {
        const titleEl = card.querySelector('h3');
        const priceEl = card.querySelector('p.text-primary');
        const imgEl = card.querySelector('img');

        if (titleEl && priceEl && imgEl) {
            const title = titleEl.innerText;
            const priceText = priceEl.innerText.split(' ')[0]; // Split to ignore strike-through
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 150.00;
            const imgSrc = imgEl.src;

            const actionBtns = card.querySelectorAll('.absolute.bottom-4 button');
            if (actionBtns.length >= 3) {
                // cart btn
                actionBtns[0].addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    addToCart(price);
                });

                // eye btn
                actionBtns[2].addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.location.href = 'detail_product.html';
                });
            }
        }
    });
});
