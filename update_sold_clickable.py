import json
import re

file_path = r"c:\Users\Lenovo\Desktop\kotre_jacket\data\products.json"

with open(file_path, "r", encoding="utf-8") as f:
    products = json.load(f)

# Keywords that indicate the item was marked sold out in text
sold_keywords = ["sold", "sold out", "sold kiladd", "sold sebelum tayang"]

for p in products:
    desc = p.get("description", "")
    desc_lower = desc.lower()
    
    is_sold = False
    
    # Check if any sold keyword is in the description
    for keyword in sold_keywords:
        if keyword in desc_lower:
            is_sold = True
            break
            
    if is_sold:
        p["status"] = "sold"
        
        # Now clean up the description: 
        # Typically the sold text is the first line, starting with | SOLD OUT or 🤝 sold, thnx!
        # We can split by newline and filter out lines containing the keywords.
        cleaned_lines = []
        for line in desc.splitlines():
            line_lower = line.lower()
            if not any(kw in line_lower for kw in sold_keywords):
                cleaned_lines.append(line)
        
        # After removing sold lines, we may have leading empty lines.
        # Let's cleanly join them
        new_desc = "\n".join(cleaned_lines).strip()
        p["description"] = new_desc

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(products, f, indent=4, ensure_ascii=False)

print("Database cleaned successfully!")

# UPDATE MAIN.JS
main_js_path = r"c:\Users\Lenovo\Desktop\kotre_jacket\js\main.js"
with open(main_js_path, "r", encoding="utf-8") as f:
    main_js_content = f.read()

# Make grid items clickable again
target_cursor = "const cursorStyle = item.status === 'sold' ? 'cursor-not-allowed opacity-80 filter grayscale' : 'cursor-pointer group';"
replace_cursor = "const cursorStyle = item.status === 'sold' ? 'cursor-pointer opacity-80 filter grayscale' : 'cursor-pointer group';"
main_js_content = main_js_content.replace(target_cursor, replace_cursor)

# Make list items clickable again
target_a = '<a href="detail_product.html?id=${item.id}" class="flex items-center space-x-4 group ${item.status === \\\'sold\\\' ? \\\'cursor-not-allowed\\\' : \\\'cursor-pointer\\\'}">'
replace_a = '<a href="detail_product.html?id=${item.id}" class="flex items-center space-x-4 group cursor-pointer">'
main_js_content = main_js_content.replace(target_a, replace_a)

with open(main_js_path, "w", encoding="utf-8") as f:
    f.write(main_js_content)

print("main.js updated to allow clicking!")
