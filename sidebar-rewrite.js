const fs = require('fs');

const sidebarHTML = `
    <!-- Mobile Sidebar Backdrop -->
    <div id="mobile-backdrop" class="fixed inset-0 bg-black/60 z-[70] opacity-0 pointer-events-none transition-opacity duration-300 backdrop-blur-sm"></div>

    <!-- Mobile Sidebar -->
    <div id="mobile-sidebar" class="fixed top-0 right-0 h-full w-[300px] bg-white dark:bg-gray-900 z-[80] transform translate-x-full transition-transform duration-500 ease-out shadow-2xl flex flex-col">
        <div class="px-8 py-6 w-full flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
            <h2 class="text-xl font-bold tracking-widest text-dark dark:text-white uppercase">Menu</h2>
            <button id="mobile-close-btn" class="text-gray-400 hover:text-primary transition-colors cursor-pointer p-2 -mr-2"><i data-lucide="x" class="w-6 h-6"></i></button>
        </div>
        <div class="flex flex-col p-8 space-y-6 text-sm font-bold tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400">
            <a href="index.html" class="hover:text-dark dark:hover:text-white mobile-link transition-colors">Home</a>
            <a href="index.html#shop" class="hover:text-dark dark:hover:text-white mobile-link transition-colors">Shop</a>
            <a href="about.html" class="hover:text-dark dark:hover:text-white mobile-link transition-colors">About</a>
            <a href="#" class="hover:text-dark dark:hover:text-white mobile-link transition-colors">Contact Us</a>
        </div>
        <div class="mt-auto p-8 border-t border-gray-100 dark:border-gray-800 flex justify-center space-x-6 text-gray-400">
            <i data-lucide="instagram" class="w-5 h-5 cursor-pointer hover:text-primary"></i>
            <i data-lucide="facebook" class="w-5 h-5 cursor-pointer hover:text-primary"></i>
        </div>
    </div>
`;

['index.html', 'about.html'].forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace old mobile menu overlay block dynamically via regex 
    // Uses lookahead pattern to replace until next major header hook
    content = content.replace(/<!-- Mobile Menu Overlay -->[\s\S]*?(?=<!-- Cinematic Full-Bleed Hero -->|<!-- Hero Banner \(The Vision\) -->)/, sidebarHTML);

    fs.writeFileSync(file, content);
    console.log(`Mobile sidebar applied to ${file}`);
});
