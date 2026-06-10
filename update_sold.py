import os
import re

main_js = r"c:\Users\Lenovo\Desktop\kotre_jacket\js\main.js"

with open(main_js, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace texts
content = content.replace(
    "const tagLabel = item.status === 'sold' ? 'SOLD OUT' : 'AVAILABLE';",
    "const tagLabel = item.status === 'sold' ? 'HABIS' : 'TERSEDIA';"
)
content = content.replace(
    "const cursorStyle = item.status === 'sold' ? 'cursor-not-allowed opacity-80' : 'cursor-pointer group';",
    "const cursorStyle = item.status === 'sold' ? 'cursor-not-allowed opacity-80 filter grayscale' : 'cursor-pointer group';"
)

target_col = '<div class="w-20 h-20 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden rounded-sm border border-gray-100 dark:border-gray-800">'
replace_col = '<div class="w-20 h-20 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden rounded-sm border border-gray-100 dark:border-gray-800 ${item.status === \'sold\' ? \'filter grayscale opacity-90\' : \'\'}">'
content = content.replace(target_col, replace_col)

target_a = '<a href="detail_product.html?id=${item.id}" class="flex items-center space-x-4 group cursor-pointer">'
replace_a = '<a href="detail_product.html?id=${item.id}" class="flex items-center space-x-4 group ${item.status === \'sold\' ? \'cursor-not-allowed\' : \'cursor-pointer\'}">'
content = content.replace(target_a, replace_a)

with open(main_js, 'w', encoding='utf-8') as f:
    f.write(content)

# DETAIL PRODUCT HTML
detail_html = r"c:\Users\Lenovo\Desktop\kotre_jacket\detail_product.html"
with open(detail_html, 'r', encoding='utf-8') as f:
    html = f.read()

stars_regex = re.compile(r'<div class="flex items-center space-x-4 mb-6">.*?<i data-lucide="star".*?</div>', re.DOTALL)
html = stars_regex.sub('', html)

# Add Testimonial block below "Description" section or Buy Now Button
buy_btn = '''<button id="btn-buy-now"
                class="w-full bg-[#fde047] text-dark dark:text-gray-100 py-4 font-bold uppercase tracking-widest text-sm hover:bg-yellow-400 transition-colors mb-8 rounded-sm">
                Beli Sekarang
            </button>'''

testimonial_html = '''
            <!-- Dynamic Random Testimonial -->
            <div class="bg-gray-50 dark:bg-gray-800 p-4 border-l-4 border-primary rounded-sm mb-8">
                <p class="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Kata Pembeli Kami</p>
                <div class="flex space-x-2 text-yellow-400 mb-2">
                    <i data-lucide="star" class="w-3 h-3 fill-current"></i><i data-lucide="star" class="w-3 h-3 fill-current"></i><i data-lucide="star" class="w-3 h-3 fill-current"></i><i data-lucide="star" class="w-3 h-3 fill-current"></i><i data-lucide="star" class="w-3 h-3 fill-current"></i>
                </div>
                <p id="random-testimonial" class="text-sm italic font-serif text-gray-600 dark:text-gray-300">
                    "Kualitas jaket Thrift di sini sangat otentik 100% dan bahan masih awet seperti baru. Packingnya juga aman!"
                </p>
                <p class="text-xs font-bold text-dark dark:text-gray-100 mt-2">- Pembeli Terverifikasi</p>
            </div>
'''
html = html.replace(buy_btn, buy_btn + testimonial_html)

with open(detail_html, 'w', encoding='utf-8') as f:
    f.write(html)
print("done")
