const fs = require('fs');
const glob = require('glob');

const files = ['index.html', 'about.html', 'detail_product.html', 'cart.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Add darkMode config
    content = content.replace(/tailwind\.config\s*=\s*\{/g, "tailwind.config = {\n            darkMode: 'class',");

    // 2. Add Theme Toggle Button in Navbar (Before search icon)
    if (!content.includes('id="theme-toggle"')) {
        content = content.replace(
            /(<!-- Icons -->\s*<div class="flex items-center space-x-6">)/g,
            `$1\n                <button id="theme-toggle" class="hover:text-primary transition-colors duration-200 cursor-pointer"><i data-lucide="moon" class="w-5 h-5 theme-icon"></i></button>`
        );
    }

    // 3. Global CSS changes (Avoid duplicate dark: classes)
    const replaceClass = (search, replacement) => {
        // Regex to search for search string inside class="..."
        // A simple string replace loop on entire content but ensuring we don't multiply dark mode tags
        const searchRegex = new RegExp(`(?<=class="[^"]*\\b)${search}(\\b)(?![^"]*dark:)`, 'g');
        content = content.replace(searchRegex, replacement);
    };

    // Simplified regex that works:
    // Only replace where dark: isn't already there
    // To be safer, just replace the strings directly if they don't have dark: counterpart
    content = content.replace(/bg-white([^/a-z0-9\-]*(?!\s*dark:bg-))/g, 'bg-white dark:bg-gray-900$1');
    content = content.replace(/bg-secondary(?!\s*dark:bg-)/g, 'bg-secondary dark:bg-black');
    content = content.replace(/text-dark(?!\s*dark:text-)/g, 'text-dark dark:text-gray-100');
    content = content.replace(/text-gray-500(?!\s*dark:text-)/g, 'text-gray-500 dark:text-gray-400');
    content = content.replace(/border-gray-50(?!\s*dark:border-)/g, 'border-gray-50 dark:border-gray-800');
    content = content.replace(/border-gray-100(?!\s*dark:border-)/g, 'border-gray-100 dark:border-gray-800');
    content = content.replace(/border-gray-200(?!\s*dark:border-)/g, 'border-gray-200 dark:border-gray-700');
    content = content.replace(/bg-gray-100(?!\s*dark:bg-)/g, 'bg-gray-100 dark:bg-gray-800');

    // NavBar scroll logic in files where it's embedded or the default class list:
    content = content.replace(/bg-white\/95/g, 'bg-white/95 dark:bg-gray-900/95');

    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
});
