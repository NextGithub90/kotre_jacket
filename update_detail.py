import os

detail_js = r"c:\Users\Lenovo\Desktop\kotre_jacket\js\detail.js"

with open(detail_js, 'r', encoding='utf-8') as f:
    content = f.read()

# Translations
content = content.replace('statusEl.innerText = "SOLD OUT";', 'statusEl.innerText = "HABIS";')
content = content.replace('btnCart.innerText = "SOLD OUT";', 'btnCart.innerText = "HABIS";')
content = content.replace('btnBuyNow.innerText = "SOLD OUT";', 'btnBuyNow.innerText = "HABIS";')
content = content.replace('statusEl.innerText = "AVAILABLE";', 'statusEl.innerText = "TERSEDIA";')

# Translate Related Products sold out overlay if any
content = content.replace('Sold Out</span>', 'HABIS</span>')

# Add Random Testimonial Logic
injection_target = "if (descEl) {"
injection_code = """
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
            testyEl.innerText = '\\"' + testimonials[Math.floor(Math.random() * testimonials.length)] + '\\"';
        }

        if (descEl) {
"""

content = content.replace(injection_target, injection_code)

with open(detail_js, 'w', encoding='utf-8') as f:
    f.write(content)

print("done detail")
