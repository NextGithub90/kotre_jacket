import os
from playwright.sync_api import sync_playwright
import subprocess

def get_shortcodes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("Navigating to Instagram profile...")
        try:
            page.goto("https://www.instagram.com/syupermarket/", timeout=15000)
        except Exception as e:
            print("Navigation message:", e)
        
        print("Waiting for page load...")
        page.wait_for_timeout(4000)
        
        page.evaluate("window.scrollBy(0, 1000)")
        page.wait_for_timeout(2000)

        links = page.evaluate('''() => {
            const anchors = Array.from(document.querySelectorAll('a[href^="/p/"]'));
            return anchors.map(a => a.href.split('/p/')[1].split('/')[0]);
        }''')
        
        browser.close()
        return list(set(links))

if __name__ == "__main__":
    links = get_shortcodes()
    if links:
        print(f"Found {len(links)} shortcodes: {links}")
        shortcodes_str = ",".join(links)
        print("Extracting data via extract_ig.py...")
        subprocess.run(["python", "scripts/extract_ig.py", shortcodes_str])
    else:
        print("No links found. Instagram might be showing a hard login wall.")
