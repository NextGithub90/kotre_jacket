import json

file_path = r"c:\Users\Lenovo\Desktop\kotre_jacket\data\products.json"

with open(file_path, "r", encoding="utf-8") as f:
    products = json.load(f)

# Keywords that indicate the item was marked sold out in text
sold_keywords = ["sold", "sold out", "sold kiladd", "sold sebelum tayang"]

for p in products:
    desc = p.get("description", "")
    desc_lower = desc.lower()
    
    is_sold = False
    for keyword in sold_keywords:
        if keyword in desc_lower:
            is_sold = True
            break
            
    if is_sold:
        p["status"] = "sold"
        # Notice we are NO LONGER modifying p["description"]. We just change the status!

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(products, f, indent=4, ensure_ascii=False)

print("Database updated ONLY statuses successfully!")
