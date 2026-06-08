const fs = require('fs');
const path = require('path');

// Dynamically handle imports
async function run() {
    let sharp;
    try {
        sharp = require('sharp');
    } catch (e) {
        console.error("Failed to load sharp. Skipping image conversion.");
        return;
    }

    const directoryPath = path.join(__dirname, 'assets/images');

    // 1. Convert Images
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
        if (file.endsWith('.png') || file.endsWith('.jpg')) {
            const inputPath = path.join(directoryPath, file);
            const webpPath = path.join(directoryPath, file.replace(/\.(png|jpg)$/, '.webp'));

            try {
                await sharp(inputPath).webp({ quality: 80 }).toFile(webpPath);
                console.log(`Converted ${file} to WebP`);
            } catch (err) {
                console.error(`Error converting ${file}:`, err);
            }
        }
    }

    // 2. Patch HTML files
    ['index.html', 'about.html', 'detail_product.html', 'cart.html'].forEach(htmlFile => {
        if (!fs.existsSync(htmlFile)) return;
        let content = fs.readFileSync(htmlFile, 'utf8');

        // Swap file names
        content = content.replace(/\.png/g, '.webp');
        content = content.replace(/\.jpg/g, '.webp');

        // Add native performance flags to all image tags
        content = content.replace(/<img([^>]*)>/gi, (match, p1) => {
            // Guard: don't double inject
            if (p1.includes('decoding="async"')) return match;

            // Exclude hero/slider images from lazy loading for LCP reasons
            if (p1.includes('slide-bg') || p1.includes('gs-hero-img') || p1.includes('w-full h-full object-cover')) {
                // Pre-paint heavy LCP elements instantly
                return `<img${p1} decoding="async" fetchpriority="high">`;
            }

            // Standard lazy load configuration
            let additions = ` decoding="async"`;
            if (!p1.includes('loading="lazy"')) additions += ` loading="lazy"`;

            return `<img${p1}${additions}>`;
        });

        // Ensure google fonts have preconnect instructions in the head
        if (!content.includes('rel="preconnect"')) {
            content = content.replace(/<head>/i, '<head>\n    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
        }

        fs.writeFileSync(htmlFile, content);
        console.log(`HTML performance patched: ${htmlFile}`);
    });
}

run();
