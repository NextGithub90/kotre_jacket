import os
import re
import json
import instaloader
import uuid
import shutil

L = instaloader.Instaloader(download_videos=False, save_metadata=False, download_comments=False)

# try:
#     L.load_session_from_file("teti_scra")
#     print("Successfully loaded Instagram session for teti_scra.")
# except Exception as e:
#     print(f"Warning: No valid session found for teti_scra. Script will run anonymously. Error: {e}")

def extract_from_post(shortcode):
    try:
        print(f"Fetching metadata for {shortcode}...")
        post = instaloader.Post.from_shortcode(L.context, shortcode)
    except Exception as e:
        print(f"Error fetching post {shortcode}: {e}")
        return

    caption = post.caption if post.caption else ""
    
    lines = [line.strip() for line in caption.split('\n') if line.strip()]
    name = lines[0] if lines else "Unknown Item"
    status = "available"
    if len(lines) > 1 and ("sold" in lines[0].lower() or "thnx" in lines[0].lower()):
        name = lines[1]
        status = "sold"

    size_match = re.search(r'Size\s*[:-]?\s*(.*?)(?=\n|$)', caption, re.IGNORECASE)
    size = size_match.group(1).strip() if size_match else ""

    measurements_match = re.search(r'P\s*[:-]?\s*(\d+\s*cm)\s*[xX×]\s*L\s*[:-]?\s*(\d+\s*cm)', caption, re.IGNORECASE)
    measurements = f"P: {measurements_match.group(1)} x L: {measurements_match.group(2)}" if measurements_match else ""

    condition_match = re.search(r'Condition\s*[:-]?\s*(.*?)(?=\n|$)', caption, re.IGNORECASE)
    condition = condition_match.group(1).strip() if condition_match else ""

    price_match = re.search(r'Price\s*[:-]?\s*([\d\.]+)', caption, re.IGNORECASE)
    price = price_match.group(1).strip() if price_match else ""
    
    print(f"Downloading images for {shortcode}...")
    temp_dir = f"temp_{shortcode}"
    
    import time
    for attempt in range(3):
        try:
            L.download_post(post, target=temp_dir)
            break
        except Exception as e:
            print(f"Attempt {attempt+1} failed downloading images for {shortcode} (Windows Lock): {e}")
            time.sleep(2)
    else:
        print(f"Skipping {shortcode} due to persistent download errors.")
        return
    dest_dir = os.path.join("assets", "img", "products")
    os.makedirs(dest_dir, exist_ok=True)
    
    product_images = []
    
    for filename in sorted(os.listdir(temp_dir)):
        if filename.endswith(".jpg"):
            new_filename = f"{shortcode}_{uuid.uuid4().hex[:6]}.jpg"
            src = os.path.join(temp_dir, filename)
            dst = os.path.join(dest_dir, new_filename)
            shutil.move(src, dst)
            product_images.append(f"assets/img/products/{new_filename}")
            
    shutil.rmtree(temp_dir, ignore_errors=True)
    
    product_id = shortcode
    product = {
        "id": product_id,
        "name": name,
        "status": status,
        "size": size,
        "measurements": measurements,
        "condition": condition,
        "description": caption,
        "price": price,
        "images": product_images,
        "url": f"https://www.instagram.com/p/{shortcode}/"
    }
    
    json_path = os.path.join("data", "products.json")
    products = []
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            try:
                products = json.load(f)
            except:
                products = []
                
    if not any(p['id'] == product_id for p in products):
        products.insert(0, product)
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(products, f, indent=4, ensure_ascii=False)
        print(f"Successfully added {name} to products.json")
    else:
        print(f"Product {shortcode} already exists in database.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        urls = arg.split(',')
        for u in urls:
            u = u.strip()
            if not u: continue
            
            # Remove query params
            u = u.split('?')[0]
            
            if "instagram.com/p/" in u:
                shortcode = u.split("/p/")[1].split("/")[0]
                extract_from_post(shortcode)
            elif "instagram.com/" in u:
                # It's likely a profile
                username = u.split("instagram.com/")[1].split("/")[0]
                print(f"Detected profile. Fetching posts for @{username}...")
                try:
                    profile = instaloader.Profile.from_username(L.context, username)
                    count = 0
                    max_posts = 15 # limit to prevent block
                    for post in profile.get_posts():
                        if count >= max_posts:
                            break
                        print(f"--- Processing profile post {count+1}/{max_posts} ---")
                        extract_from_post(post.shortcode)
                        count += 1
                except Exception as e:
                    print(f"Error fetching profile: {e}")
            else:
                shortcode = u
                extract_from_post(shortcode)
    else:
        print("Usage: python scripts/extract_ig.py <shortcode_or_url_or_profile_url>")
