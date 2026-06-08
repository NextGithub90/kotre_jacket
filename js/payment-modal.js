/**
 * SYUPERMARKET — Payment Modal
 * Handles both: Cart Checkout & Buy It Now flows
 * Integrates: Midtrans Snap + WhatsApp Confirmation
 *
 * ⚠️  NOTE: Server Key is for backend only (do NOT expose in production).
 *     This file uses only the Client Key for Snap.js.
 *     For full Midtrans integration (create snap_token), add a backend endpoint.
 */

// ─── Config ──────────────────────────────────────────────────────────────
const MIDTRANS_CLIENT_KEY = 'Mid-client-ovifXC9m5tF152Om';
const MIDTRANS_IS_PRODUCTION = false; // set true when go-live
const WA_NUMBER = '6281234567890'; // ← Ganti dengan nomor WhatsApp toko kamu

// ─── Inject Styles ───────────────────────────────────────────────────────
(function injectModalStyles() {
    if (document.getElementById('payment-modal-styles')) return;
    const style = document.createElement('style');
    style.id = 'payment-modal-styles';
    style.textContent = `
    #payment-modal-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        z-index: 9999;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
        padding: 16px;
        animation: pmFadeIn 0.25s ease;
    }
    #payment-modal-overlay.open {
        display: flex;
    }
    @keyframes pmFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    #payment-modal-box {
        background: #fff;
        color: #212529;
        border-radius: 8px;
        width: 100%;
        max-width: 480px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 24px 64px rgba(0,0,0,0.25);
        animation: pmSlideUp 0.3s cubic-bezier(.16,1,.3,1);
        position: relative;
    }
    .dark #payment-modal-box {
        background: #1a1b2e;
        color: #f0f0f0;
    }
    @keyframes pmSlideUp {
        from { transform: translateY(40px); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
    }
    #payment-modal-box .pm-header {
        padding: 20px 24px 16px;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .dark #payment-modal-box .pm-header { border-color: #2d2e4a; }
    #payment-modal-box .pm-title {
        font-size: 16px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }
    #payment-modal-box .pm-close {
        cursor: pointer;
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s;
        font-size: 20px;
        line-height: 1;
    }
    #payment-modal-box .pm-close:hover { background: #f1f3f5; }
    .dark #payment-modal-box .pm-close:hover { background: #2d2e4a; }

    #payment-modal-box .pm-body { padding: 20px 24px; }

    /* Order summary items */
    #payment-modal-box .pm-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid #f1f3f5;
    }
    .dark #payment-modal-box .pm-item { border-color: #2d2e4a; }
    #payment-modal-box .pm-item img {
        width: 56px;
        height: 70px;
        object-fit: cover;
        border-radius: 4px;
        background: #f8f9fa;
        flex-shrink: 0;
    }
    #payment-modal-box .pm-item-name {
        font-size: 13px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        flex: 1;
    }
    #payment-modal-box .pm-item-price {
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
    }
    #payment-modal-box .pm-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 14px;
        padding-top: 14px;
        border-top: 2px solid #212529;
        font-size: 15px;
        font-weight: 800;
        letter-spacing: 0.05em;
    }
    .dark #payment-modal-box .pm-total { border-color: #f0f0f0; }

    /* Form */
    #payment-modal-box .pm-form { margin-top: 18px; }
    #payment-modal-box .pm-form label {
        display: block;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #6c757d;
        margin-bottom: 6px;
        margin-top: 14px;
    }
    #payment-modal-box .pm-form input {
        width: 100%;
        padding: 11px 14px;
        border: 1.5px solid #dee2e6;
        border-radius: 4px;
        font-size: 14px;
        font-family: inherit;
        outline: none;
        background: transparent;
        color: inherit;
        transition: border-color 0.2s;
        box-sizing: border-box;
    }
    #payment-modal-box .pm-form input:focus { border-color: #4361ee; }
    .dark #payment-modal-box .pm-form input { border-color: #3d3e5a; }

    /* Buttons */
    #payment-modal-box .pm-btn-group {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    #payment-modal-box .pm-btn {
        width: 100%;
        padding: 14px;
        border: none;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s;
    }
    #payment-modal-box .pm-btn-midtrans {
        background: #212529;
        color: #fff;
    }
    #payment-modal-box .pm-btn-midtrans:hover { background: #4361ee; }
    #payment-modal-box .pm-btn-midtrans:disabled {
        background: #868e96;
        cursor: not-allowed;
    }
    #payment-modal-box .pm-btn-wa {
        background: #25D366;
        color: #fff;
    }
    #payment-modal-box .pm-btn-wa:hover { background: #1da851; }

    #payment-modal-box .pm-note {
        font-size: 11px;
        color: #868e96;
        text-align: center;
        margin-top: 14px;
        line-height: 1.6;
    }

    /* Spinner */
    .pm-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.4);
        border-top-color: #fff;
        border-radius: 50%;
        animation: pmSpin 0.6s linear infinite;
        display: inline-block;
    }
    @keyframes pmSpin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
})();

// ─── Inject Snap.js ──────────────────────────────────────────────────────
(function loadSnapJs() {
    if (document.getElementById('midtrans-snap-js')) return;
    const script = document.createElement('script');
    script.id = 'midtrans-snap-js';
    script.src = MIDTRANS_IS_PRODUCTION
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
    document.head.appendChild(script);
})();

// ─── Inject Modal HTML ───────────────────────────────────────────────────
(function injectModalHTML() {
    if (document.getElementById('payment-modal-overlay')) return;

    // Wait for DOM if not ready
    function _inject() {
        if (document.getElementById('payment-modal-overlay')) return;
        const div = document.createElement('div');
        div.id = 'payment-modal-overlay';
        div.innerHTML = `
        <div id="payment-modal-box" role="dialog" aria-modal="true" aria-labelledby="pm-title-text">
            <div class="pm-header">
                <div class="pm-title">
                    <span id="pm-title-text">🛍️ Konfirmasi Pesanan</span>
                </div>
                <button class="pm-close" id="pm-close-btn" aria-label="Tutup">✕</button>
            </div>
            <div class="pm-body">
                <!-- Order Items injected here -->
                <div id="pm-items-container"></div>

                <!-- Total -->
                <div class="pm-total">
                    <span>TOTAL</span>
                    <span id="pm-total-amount">Rp 0</span>
                </div>

                <!-- Buyer Form -->
                <div class="pm-form">
                    <label for="pm-name">Nama Lengkap</label>
                    <input type="text" id="pm-name" placeholder="Masukkan nama kamu..." autocomplete="name">
                    <label for="pm-phone">Nomor WhatsApp</label>
                    <input type="tel" id="pm-phone" placeholder="Contoh: 08123456789" autocomplete="tel">
                </div>

                <!-- Payment Buttons -->
                <div class="pm-btn-group">
                    <button class="pm-btn pm-btn-midtrans" id="pm-btn-midtrans">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                        Bayar via Transfer / QRIS
                    </button>
                </div>

                <p class="pm-note">🔒 Pembayaran aman & terpercaya<br>Kami tidak menyimpan data kartu kamu.</p>
            </div>
        </div>`;
        document.body.appendChild(div);

        // Bind close events
        document.getElementById('pm-close-btn').addEventListener('click', closePaymentModal);
        div.addEventListener('click', function (e) {
            if (e.target === div) closePaymentModal();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closePaymentModal();
        });

        // Bind payment buttons
        document.getElementById('pm-btn-midtrans').addEventListener('click', handleMidtransPayment);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _inject);
    } else {
        _inject();
    }
})();

// ─── State ───────────────────────────────────────────────────────────────
let _currentOrderData = null;

// ─── Public API ──────────────────────────────────────────────────────────

/**
 * Open the payment modal.
 * @param {Object} orderData
 * @param {Array}  orderData.items   - [{ id, name, image, price (number), qty }]
 * @param {number} orderData.total   - Total in Rupiah (number)
 * @param {string} [orderData.source] - 'cart' | 'buynow'
 */
window.openPaymentModal = function (orderData) {
    _currentOrderData = orderData;

    // Render items
    const container = document.getElementById('pm-items-container');
    if (!container) return;
    container.innerHTML = orderData.items.map(item => `
        <div class="pm-item">
            <img src="${item.image || ''}" alt="${item.name}" onerror="this.style.display='none'">
            <div class="pm-item-name">${item.name}<br><span style="font-weight:400;font-size:11px;text-transform:none;letter-spacing:0">× ${item.qty}</span></div>
            <div class="pm-item-price">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</div>
        </div>
    `).join('');

    // Render total
    document.getElementById('pm-total-amount').textContent = 'Rp ' + orderData.total.toLocaleString('id-ID');

    // Clear form
    document.getElementById('pm-name').value = '';
    document.getElementById('pm-phone').value = '';

    // Show modal
    const overlay = document.getElementById('payment-modal-overlay');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus first input
    setTimeout(() => document.getElementById('pm-name').focus(), 300);
};

window.closePaymentModal = function () {
    const overlay = document.getElementById('payment-modal-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
};

// ─── Validation ──────────────────────────────────────────────────────────
function validateForm() {
    const name = document.getElementById('pm-name').value.trim();
    const phone = document.getElementById('pm-phone').value.trim();
    if (!name) {
        alert('Harap masukkan nama lengkap kamu.');
        document.getElementById('pm-name').focus();
        return false;
    }
    if (!phone || phone.length < 9) {
        alert('Harap masukkan nomor WhatsApp yang valid.');
        document.getElementById('pm-phone').focus();
        return false;
    }
    return { name, phone };
}

// ─── Midtrans Handler ────────────────────────────────────────────────────
async function handleMidtransPayment() {
    const form = validateForm();
    if (!form) return;

    if (!_currentOrderData) return;

    const btn = document.getElementById('pm-btn-midtrans');
    btn.disabled = true;
    btn.innerHTML = `<span class="pm-spinner"></span> Memproses...`;

    try {
        /**
         * ⚠️  Untuk mendapatkan snap_token, normalnya butuh backend (Node.js/PHP).
         *    Backend hit Midtrans API dengan Server Key, lalu kirim snap_token ke frontend.
         *    
         *    Kalau kamu sudah punya backend endpoint, ganti URL di bawah ini.
         *    Contoh endpoint: POST /api/create-payment
         *    Body: { orderId, grossAmount, customerName, customerPhone, items }
         */
        const orderId = 'SYUPERMKT-' + Date.now();

        // Try calling backend if available
        let snapToken = null;
        try {
            const resp = await fetch('/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    grossAmount: _currentOrderData.total,
                    customerName: form.name,
                    customerPhone: form.phone,
                    items: _currentOrderData.items
                }),
                signal: AbortSignal.timeout(5000)
            });
            if (resp.ok) {
                const data = await resp.json();
                snapToken = data.token || data.snap_token;
            }
        } catch (_) {
            // Backend not available — fallback to WhatsApp
        }

        if (snapToken && window.snap) {
            // Open Midtrans Snap popup
            window.snap.pay(snapToken, {
                onSuccess: function (result) {
                    closePaymentModal();
                    redirectToWAAfterSuccess(result);
                },
                onPending: function (result) {
                    closePaymentModal();
                    showPaymentPending(result);
                },
                onError: function (result) {
                    console.error('Midtrans error:', result);
                    alert('Pembayaran gagal. Silakan coba lagi.');
                },
                onClose: function () {
                    // User closed Snap popup
                }
            });
        } else {
            alert('ℹ️ Sistem pembayaran sedang tidak tersedia (koneksi server terputus).');
        }
    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan. Silakan coba lewat WhatsApp.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
            Bayar via Transfer / QRIS`;
    }
}

// ─── WhatsApp Handler ─────────────────────────────────────────────────────
function handleWhatsAppPayment() {
    const form = validateForm();
    if (!form) return;
    if (!_currentOrderData) return;

    const itemLines = _currentOrderData.items.map(item =>
        `• ${item.name} ×${item.qty} — Rp ${(item.price * item.qty).toLocaleString('id-ID')}`
    ).join('\n');

    const orderId = 'SYUPERMKT-' + Date.now();

    const message = [
        `🛍️ *PESANAN BARU — SYUPERMARKET*`,
        ``,
        `*Order ID:* ${orderId}`,
        `*Nama:*    ${form.name}`,
        `*No. HP:*  ${form.phone}`,
        ``,
        `*Produk:*`,
        itemLines,
        ``,
        `*Total: Rp ${_currentOrderData.total.toLocaleString('id-ID')}*`,
        ``,
        `Mohon konfirmasi ketersediaan dan info rekening. Terima kasih! 🙏`
    ].join('\n');

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;

    closePaymentModal();
    window.open(waUrl, '_blank');
}

// ─── Redirect Success to WA ───────────────────────────────────────────────
function redirectToWAAfterSuccess(result) {
    const name = document.getElementById('pm-name').value.trim() || 'Pembeli';
    const phone = document.getElementById('pm-phone').value.trim() || '-';

    // Fallback if _currentOrderData is missing for some reason
    const totalContent = _currentOrderData ? _currentOrderData.total.toLocaleString('id-ID') : result.gross_amount;
    const itemLines = _currentOrderData ? _currentOrderData.items.map(item =>
        `• ${item.name} ×${item.qty}`
    ).join('\n') : '-';

    const message = [
        `✅ *PEMBAYARAN BERHASIL (MIDTRANS)*`,
        ``,
        `*Order ID:* ${result.order_id}`,
        `*Nama:*    ${name}`,
        `*No. HP:*  ${phone}`,
        ``,
        `*Produk:*`,
        itemLines,
        ``,
        `*Total Dibayar:* Rp ${totalContent}`,
        ``,
        `Mohon segera konfirmasi pesanan saya. Terima kasih! 🙏`
    ].join('\n');

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;

    window.open(waUrl, '_self');
}

function showPaymentPending(result) {
    const overlay = document.getElementById('payment-modal-overlay');
    overlay.classList.add('open');
    document.getElementById('payment-modal-box').innerHTML = `
        <div style="padding:40px 24px;text-align:center;">
            <div style="font-size:48px;margin-bottom:16px;">⏳</div>
            <h2 style="font-size:18px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">Menunggu Pembayaran</h2>
            <p style="font-size:13px;color:#6c757d;margin-bottom:24px;">Order ID: ${result.order_id}<br>Segera selesaikan pembayaran sesuai instruksi.</p>
            <button onclick="closePaymentModal()"
                style="background:#212529;color:#fff;border:none;padding:12px 32px;font-weight:700;font-size:12px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border-radius:4px;">
                Tutup
            </button>
        </div>`;
}
