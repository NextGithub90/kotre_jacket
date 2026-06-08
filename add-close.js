const fs = require('fs');

['index.html', 'about.html'].forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Add close button if not exists
    if (!content.includes('id="mobile-close-btn"')) {
        content = content.replace(
            /(<!-- Mobile Menu Overlay -->\s*<div id="mobile-menu" [^>]+>)/g,
            '$1\n        <button id="mobile-close-btn" class="absolute top-8 right-8 text-white hover:text-primary transition-colors cursor-pointer z-[90]"><i data-lucide="x" class="w-10 h-10"></i></button>'
        );
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
