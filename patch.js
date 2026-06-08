const fs = require('fs');

function patchFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Add main.js if not present
    if (!content.includes('src="./js/main.js"')) {
        content = content.replace(/<!-- Scripts -->\s*<script>/g, '<!-- Scripts -->\n    <script src="./js/main.js"></script>\n    <script>');
    }

    // Remove navbar logic from about.html
    if (file === 'about.html') {
        content = content.replace(/\/\/ Navbar Scroll Logic[\s\S]*?(?=\/\/ About Animations)/g, '\n        ');
    }

    fs.writeFileSync(file, content);
    console.log(`Patched ${file}`);
}

['about.html', 'detail_product.html', 'cart.html'].forEach(patchFile);
