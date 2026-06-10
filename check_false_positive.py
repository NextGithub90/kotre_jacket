import json
with open('data/products.json', encoding='utf-8') as f:
    ps = json.load(f)

for p in ps:
    desc = p.get('description', '').lower()
    if 'sold' in desc and not ('sold out' in desc or 'sold,' in desc or 'sold,' in desc or 'sold kiladd' in desc or 'sold sebelum' in desc):
        print("MIGHT BE FALSE POSITIVE:", p['name'])
