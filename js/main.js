// Main application functionality - merged with sheets.js functionality

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Language toggle functionality
document.getElementById('languageToggle').addEventListener('click', function() {
    document.documentElement.lang = document.documentElement.lang === 'he' ? 'en' : 'he';
    document.documentElement.dir = document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl';
    
    if (document.documentElement.lang === 'en') {
        this.querySelector('span').textContent = 'English';
        document.title = 'AliExpress Deals - Amazing Deals from AliExpress';
    } else {
        this.querySelector('span').textContent = 'עברית';
        document.title = 'AliExpress Deals - מציאות מדהימות מאליאקספרס';
    }
});

// Back to top button
const backToTopButton = document.getElementById('backToTop');
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('opacity-0', 'invisible');
        backToTopButton.classList.add('opacity-100', 'visible');
    } else {
        backToTopButton.classList.remove('opacity-100', 'visible');
        backToTopButton.classList.add('opacity-0', 'invisible');
    }
});
backToTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = mobileMenu.querySelector('button');
mobileMenuButton.addEventListener('click', function() {
    mobileMenu.classList.remove('opacity-0', 'invisible');
    mobileMenu.classList.add('opacity-100', 'visible');
});
mobileMenuClose.addEventListener('click', function() {
    mobileMenu.classList.remove('opacity-100', 'visible');
    mobileMenu.classList.add('opacity-0', 'invisible');
});
