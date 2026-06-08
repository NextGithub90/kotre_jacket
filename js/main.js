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
    if (navbar && navbar.classList.contains('bg-transparent')) {
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


// Fetch and render Dynamic Products from JSON
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('./data/products.json');
        if (!response.ok) throw new Error('Failed to fetch products');
        const productsDB = await response.json();

        const fullGrid = document.getElementById('dynamic-full-grid');
        const homeGrid = document.querySelector('#shop .grid.gap-8'); // For Best Seller grid

        function drawCards(database) {
            return database.map(item => {
                const coverImage = item.images && item.images.length > 0 ? item.images[0] : 'assets/images/placeholder.webp';
                const tagLabel = item.status === 'sold' ? 'SOLD OUT' : 'AVAILABLE';
                const cursorStyle = item.status === 'sold' ? 'cursor-not-allowed opacity-80' : 'cursor-pointer group';
                return `
                <a href="detail_product.html?id=${item.id}" class="gs-product block relative ${cursorStyle}">
                    <div class="relative overflow-hidden mb-4 bg-secondary dark:bg-black rounded-sm aspect-[4/5] flex items-center justify-center p-2">
                        <img src="${coverImage}" alt="${item.name}" class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal ${item.status !== 'sold' ? 'group-hover:scale-105' : ''} transition-transform duration-700 ease-out" loading="lazy" decoding="async">
                        <div class="absolute top-4 left-4 bg-white dark:bg-gray-800 text-dark dark:text-white text-[10px] font-bold px-2 py-1 shadow-sm uppercase tracking-widest ${item.status === 'sold' ? 'text-red-500' : ''}">${tagLabel}</div>
                        ${item.status !== 'sold' ? `<button class="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-dark text-white px-6 py-2 text-xs font-bold tracking-widest uppercase hover:bg-primary shadow-lg add-to-cart-btn" data-id="${item.id}" data-name="${item.name}" data-image="${coverImage}" data-price="${item.price.replace(/[^0-9]/g, '')}">Add to Cart</button>` : ''}
                    </div>
                    <div class="text-center px-2">
                        <h3 class="text-sm font-bold text-dark dark:text-gray-100 mb-1 font-sans tracking-wide ${item.status !== 'sold' ? 'group-hover:text-primary transition-colors' : ''}">${item.name}</h3>
                        <p class="text-gray-500 dark:text-gray-400 font-bold text-xs mb-2">Rp ${item.price}</p>
                    </div>
                </a>
            `}).join('');
        }

        if (fullGrid) {
            fullGrid.innerHTML = drawCards(productsDB);
        }
        if (homeGrid) {
            // "kategori ganti hanya best seleer aja dan pakai foto yg ada di shop"
            const tabs = document.querySelector('#shop .flex.justify-center.mb-12');
            if (tabs) {
                tabs.innerHTML = '<button class="text-primary border-b-2 border-primary pb-4 -mb-[18px]">Best Seller</button>';
            }
            homeGrid.innerHTML = drawCards(productsDB.slice(0, 8)); // 8 products for best seller
        }

        // Home Page 3 Columns (New Arrival, Featured, Best Seller)
        const colContainers = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-3 .space-y-6');
        if (colContainers && colContainers.length >= 3) {
            function drawListCol(db) {
                return db.map((item) => {
                    const coverImage = item.images && item.images.length > 0 ? item.images[0] : 'assets/images/placeholder.webp';
                    return `
                    <a href="detail_product.html?id=${item.id}" class="flex items-center space-x-4 group cursor-pointer">
                        <div class="w-20 h-20 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden rounded-sm border border-gray-100 dark:border-gray-800">
                            <img src="${coverImage}" alt="${item.name}" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" decoding="async" loading="lazy">
                        </div>
                        <div class="overflow-hidden">
                            <p class="text-sm font-bold text-dark dark:text-gray-100 group-hover:text-primary transition-colors truncate">${item.name}</p>
                            <p class="text-sm font-bold text-red-500 mt-1">Rp ${item.price}</p>
                        </div>
                    </a>
                    `;
                }).join('');
            }
            const shuffled = [...productsDB].sort(() => 0.5 - Math.random());
            colContainers[0].innerHTML = drawListCol(shuffled.slice(0, 3));
            colContainers[1].innerHTML = drawListCol(shuffled.slice(3, 6));
            colContainers[2].innerHTML = drawListCol(shuffled.slice(6, 9));
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
        bindCartListeners();

    } catch (error) {
        console.error("Error loading products:", error);
    }
});

window.updateCartCountGlobal = function() {
    let cart = JSON.parse(localStorage.getItem('cartGlobal') || '[]');
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountEls = document.querySelectorAll('span#cart-count, a[href="cart.html"] span#cart-count, .cart-count-badge');
    cartCountEls.forEach(el => el.innerText = totalQty);
};
document.addEventListener('DOMContentLoaded', window.updateCartCountGlobal);

function bindCartListeners() {
    const addBtns = document.querySelectorAll('.add-to-cart-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const product = {
                id: btn.getAttribute('data-id'),
                name: btn.getAttribute('data-name'),
                price: parseFloat(((btn.getAttribute('data-price') || '0') + '').replace(/[^0-9]/g, '')),
                image: btn.getAttribute('data-image'),
                qty: 1
            };
            
            if(product.id) {
                let cart = JSON.parse(localStorage.getItem('cartGlobal') || '[]');
                const existing = cart.find(p => p.id === product.id);
                if(existing) {
                    existing.qty += 1;
                } else {
                    cart.push(product);
                }
                localStorage.setItem('cartGlobal', JSON.stringify(cart));
                window.updateCartCountGlobal();
            }

            if (window.addToCartPage) {
                window.addToCartPage(btn.getAttribute('data-price'));
            } else if (typeof addToCart !== 'undefined') {
                addToCart(btn.getAttribute('data-price'));
            }
        });
    });
}