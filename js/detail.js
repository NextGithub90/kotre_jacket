document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.body.innerHTML = '<div class="flex items-center justify-center min-h-screen"><h1 class="text-2xl font-bold">Product ID not provided.</h1></div>';
        return;
    }

    try {
        const res = await fetch('./data/products.json');
        if (!res.ok) throw new Error('Network response was not ok');
        const products = await res.json();

        const product = products.find(p => p.id === productId);

        if (!product) {
            document.body.innerHTML = '<div class="flex items-center justify-center min-h-screen"><h1 class="text-2xl font-bold">Product not found.</h1></div>';
            return;
        }

        // --- DOM Elements ---
        const nameEls = document.querySelectorAll('.detail-name');
        const priceEl = document.getElementById('detail-price');
        const statusEl = document.getElementById('detail-status'); // tag
        const sizeEl = document.getElementById('detail-size');
        const measurementsEl = document.getElementById('detail-measurements');
        const conditionEl = document.getElementById('detail-condition');
        const mainImageEl = document.getElementById('detail-main-img');
        const thumbnailsContainer = document.getElementById('detail-thumbnails');
        const descEl = document.getElementById('detail-desc');
        const btnCart = document.getElementById('btn-add-cart'); // The Add to Cart btn
        const btnBuyNow = document.getElementById('btn-buy-now'); // The Buy It Now btn

        // --- Populate Text Data ---
        document.title = `${product.name} - SYUPERMARKET`;
        nameEls.forEach(el => el.innerText = product.name);

        if (priceEl) priceEl.innerText = `Rp ${product.price}`;

        if (product.status === 'sold') {
            if (statusEl) {
                statusEl.innerText = "HABIS";
                statusEl.className = "bg-red-500 text-white text-xs font-bold px-2 py-1 uppercase rounded-sm tracking-wider";
            }
            if (btnCart) {
                btnCart.disabled = true;
                btnCart.innerText = "HABIS";
                btnCart.className = "flex-1 bg-gray-400 text-white py-4 font-bold uppercase tracking-widest text-sm rounded-sm cursor-not-allowed";
            }
        } else {
            if (statusEl) {
                statusEl.innerText = "TERSEDIA";
                statusEl.className = "bg-dark text-white text-xs font-bold px-2 py-1 uppercase rounded-sm tracking-wider";
            }
        }

        if (sizeEl) sizeEl.innerText = product.size;
        if (measurementsEl) measurementsEl.innerText = product.measurements;
        if (conditionEl) conditionEl.innerText = product.condition;

        
        // Inject Random Testimonial
        const testimonials = [
            "Kualitas jaket Thrift di sini sangat otentik 100% dan bahan awet seperti baru. Packing aman!",
            "Bahan premium, persis dengan yang ada di foto. Pengiriman sangat memuaskan dan wangi bajunya!",
            "Kondisi barang nyaris sempurna, tidak kelihatan seperti barang bekas. Recommended seller!",
            "Dapat jaket branded incaran dengan harga yang sangat sepadan. Thrifting di sini memang puas banget.",
            "Admin ramah, fast response. Pakaian tiba dalam keadaan bersih dan siap pakai."
        ];
        const testyEl = document.getElementById('random-testimonial');
        if (testyEl) {
            testyEl.innerText = '\"' + testimonials[Math.floor(Math.random() * testimonials.length)] + '\"';
        }

        if (descEl) {

            // Replace newlines with <br> for HTML rendering
            descEl.innerHTML = product.description.replace(/\\n/g, '<br>');
        }

        // --- Images ---
        if (product.images && product.images.length > 0) {
            mainImageEl.src = product.images[0];
            mainImageEl.alt = product.name;

            thumbnailsContainer.innerHTML = product.images.map((imgSrc, idx) => `
                <img src="${imgSrc}" class="detail-thumb w-full aspect-[4/5] object-cover border-2 cursor-pointer rounded-sm transition-all ${idx === 0 ? 'border-primary' : 'border-transparent hover:border-gray-300'}" decoding="async" loading="lazy">
            `).join('');

            // Add click functionality to thumbnails
            const thumbs = document.querySelectorAll('.detail-thumb');
            thumbs.forEach(thumb => {
                thumb.addEventListener('click', (e) => {
                    mainImageEl.src = e.target.src;
                    thumbs.forEach(t => { t.classList.remove('border-primary'); t.classList.add('border-transparent'); });
                    e.target.classList.add('border-primary');
                    e.target.classList.remove('border-transparent');
                });
            });
        }


        // Add to Cart global binding
        if (btnCart && product.status !== 'sold') {
            btnCart.addEventListener('click', (e) => {
                const pInfo = {
                    id: product.id,
                    name: product.name,
                    price: parseFloat((product.price + '').replace(/[^0-9]/g, '')),
                    image: (product.images && product.images.length > 0) ? product.images[0] : 'assets/images/placeholder.webp',
                    qty: 1
                };
                let cart = JSON.parse(localStorage.getItem('cartGlobal') || '[]');
                const existing = cart.find(p => p.id === pInfo.id);
                if (existing) { existing.qty += 1; } else { cart.push(pInfo); }
                localStorage.setItem('cartGlobal', JSON.stringify(cart));
                if (window.updateCartCountGlobal) window.updateCartCountGlobal();

                // Show notification if needed, usually main.js handles grid but detail.js needs this
                if (typeof addToCart !== 'undefined') {
                    addToCart(pInfo.price);
                }
            });
        }

        // Buy It Now logic
        if (btnBuyNow) {
            if (product.status === 'sold') {
                btnBuyNow.disabled = true;
                btnBuyNow.innerText = "HABIS";
                btnBuyNow.className = "w-full bg-gray-300 text-gray-500 py-4 font-bold uppercase tracking-widest text-sm mb-8 rounded-sm cursor-not-allowed";
            } else {
                btnBuyNow.addEventListener('click', (e) => {
                    e.preventDefault();
                    const pInfo = {
                        id: product.id,
                        name: product.name,
                        price: parseFloat((product.price + '').replace(/[^0-9]/g, '')),
                        image: (product.images && product.images.length > 0) ? product.images[0] : 'assets/images/placeholder.webp',
                        qty: 1
                    };

                    if (window.openPaymentModal) {
                        window.openPaymentModal({
                            source: 'buynow',
                            items: [pInfo],
                            total: pInfo.price
                        });
                    }
                });
            }
        }

        // --- Related Products ---
        const relatedGrid = document.getElementById('related-products-grid');
        if (relatedGrid && products.length > 1) {
            const otherProducts = products.filter(p => p.id !== productId);
            const shuffled = otherProducts.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 4);

            relatedGrid.innerHTML = selected.map(p => `
                <a href="detail_product.html?id=${p.id}" class="flex flex-col cursor-pointer group">
                    <div class="relative bg-gray-50 aspect-[4/5] flex items-center justify-center overflow-hidden mb-4 rounded-sm">
                        <img src="${p.images[0]}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                        ${p.status === 'sold' ? '<div class="absolute inset-0 bg-black/40 flex items-center justify-center"><span class="text-white text-xs font-bold tracking-widest uppercase border border-white px-2 py-1">HABIS</span></div>' : ''}
                    </div>
                    <h3 class="font-bold text-sm text-dark dark:text-gray-100 mb-1 truncate">${p.name}</h3>
                    <p class="text-sm font-bold text-gray-500 dark:text-gray-400">Rp ${p.price}</p>
                </a>
            `).join('');
        }
    } catch (err) {
        console.error("Error fetching product:", err);
    }
});
