import os
from PIL import Image
import json

img_dir = "assets/img/products"
converted_count = 0

if os.path.exists(img_dir):
    for file in os.listdir(img_dir):
        if file.lower().endswith(('.jpg', '.jpeg', '.png')):
            file_path = os.path.join(img_dir, file)
            # Find last dot to replace extension properly
            base = file.rsplit('.', 1)[0]
            webp_path = os.path.join(img_dir, base + '.webp')
            
            try:
                with Image.open(file_path) as im:
                    im.save(webp_path, 'WEBP', quality=80, optimize=True)
                os.remove(file_path)
                converted_count += 1
            except Exception as e:
                print(f"Error converting {file}: {e}")

print(f"Converted {converted_count} images to highly optimized WebP.")

# Update JSON
json_path = "data/products.json"
if os.path.exists(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        products = json.load(f)

    for p in products:
        new_images = []
        for img in p.get('images', []):
            if img.lower().endswith(('.jpg', '.jpeg', '.png')):
                base = img.rsplit('.', 1)[0]
                new_images.append(base + '.webp')
            else:
                new_images.append(img)
        p['images'] = new_images

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=4, ensure_ascii=False)

    print("Updated data/products.json successfully.")
