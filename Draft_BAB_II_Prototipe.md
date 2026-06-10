# BAB II: PERANCANGAN PROTOTIPE SISTEM E-COMMERCE

Berikut adalah penjelasan dan penjabaran tentang bagaimana rancangan prototipe sistem e-commerce di bab ini diterapkan secara nyata ke dalam *source code* website Kotre Jacket (SyuPermarket).

---

## 1. Pemilihan Platform E-Commerce CMS

Pada prototipe sistem ini, platform yang dieksekusi **tidak menggunakan CMS E-Commerce tradisional** yang terpusat (seperti WordPress/WooCommerce, Shopify, atau Magento). Sistem ini justru dikembangkan secara kustom menggunakan pendekatan **Jamstack (JavaScript, API, Markup)** dan **Serverless**.

* **Penjelasan Teknis:** 
  Website dibangun sepenuhnya dengan **HTML Murni** dan **Vanilla JavaScript**. Data produk tidak disimpan dalam database relasional berukuran besar, melainkan dirender langsung dari sebuah *flat file* JSON (`database.json`). Pendekatan *headless CMS* / tanpa server tradisional ini dipilih karena proses *deployment*-nya (misalnya melalui platform Vercel) membuat website dapat dimuat jauh lebih cepat, ringan, dan juga terbebas dari berbagai celah kerentanan keamanan bawaan CMS konvensional.

---

## 2. Perancangan User Interface (UI) & User Experience (UX)

Sistem antarmuka difokuskan pada konsep reaktif (*reactivity*) tanpa halaman yang berulang-ulang dimuat ulang, guna memberikan kesan mewah sekaligus fungsional.

### A. User Interface (UI)
Desain tatap muka dirancang secara modern menggunakan *framework* utilitas **Tailwind CSS**. 
1. **Konsep Modular & Bersih:** Tampilan dipecah menjadi beberapa halaman yang fokus pada fungsinya masing-masing (seperti `index.html`, `shop.html`, `detail_product.html`, `cart.html`).
2. **Kesan Premium:** Penggunaan skema warna dinamis (*Light/Dark Mode*), struktur *grid layout* yang presisi pada etalase katalog, serta komponen *modal popup* yang fungsional membantu menguatkan kesan *editorial* dan profesional pada tampilan toko.

### B. User Experience (UX)
Pengalaman pengguna dirancang agar mengalir (*seamless*) dengan orientasi konversi yang tinggi.
1. **Interaksi Keranjang (*Smart Cart*):** Proses penambahan barang ke keranjang keranjang (*Add to Cart*) dikelola di belakang layar menggunakan `localStorage` peramban. Pelanggan bisa terus berbelanja tanpa terjeda oleh *loading* halaman.
2. **Navigasi Mulus:** Terdapat fitur efek animasi elemen menggunakan **GSAP** untuk meningkatkan kepuasan visual saat menggulir (*scrolling*). Menu dirancang dalam pola *sidebar drawer* yang praktis agar mudah diakses baik dari perangkat telepon cerdas (mobile) maupun desktop.

---

## 3. Integrasi Komponen Sistem

### A. Pengaturan Metode Pembayaran & Payment Gateway
Website telah terintegrasi secara komputasi awan (*cloud logic*) dengan antarmuka **Payment Gateway Nasional Midtrans (Snap API)**—mengacu pada konfigurasi di file `api/create-payment.js` dan antarmuka pembayarannya pada `js/payment-modal.js`.

* **Alur Transaksi:**
  Ketika pelanggan mengklik *checkout*, keranjang akan mengkalkulasi barang lalu memberikan perintah ke *Serverless/API Endpoint* untuk menciptakan *Snap Token*. Tanpa harus dialihkan ke halaman situs web lain, Midtrans akan memunculkan rentetan opsi gerbang pembayaran (Transfer Virtual Account Bank, QRIS, maupun E-Wallet) dalam sebuah *popup* aman di dalam website tersebut. Terdapat juga skema *fallback* jika transaksi dibatalkan sehingga pengguna tetap memiliki opsi pembayaran.

### B. Sistem Logistik
Mengingat model bisnis untuk industri penyediaan *thrift* / jaket eksklusif, pengaturan **sistem logistik mengadopsi model semi-otomatis melalui Gateway Direct WhatsApp**.

* **Alur Logistik:**
  Sistem ini meyakini bahwa kalkulasi ongkos kirim (*shipping*) otomatis dapat dihindari di awal transaksi *(Checkout)* untuk menekan angka keraguan pelanggan. 
  Setelah konfirmasi transaksi sukses divalidasi dari Midtrans, sistem otomatis *"meng-generate"* format obrolan (berisi data ID Pesanan unik `SYUPERMKT-...`, Item, dan Subtotal) untuk kemudian **melontarkan pembeli ke aplikasi WhatsApp** milik penjual/Customer Support.  
  Di titik komunikasi WhatsApp inilah, koordinasi terkait pengisian formasi data Logistik (pemilihan jenis kurir pengiriman dan kalkulasi ongkos kirim fisik) disepakati secara langsung antara pelanggan dengan pemilik toko.
