// sheets.js - Optimized for your CSV structure
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 1. Load and parse the CSV data
        const response = await fetch('./data/products.csv?v=' + Date.now());
        if (!response.ok) throw new Error('Failed to load CSV file');
        
        const csvData = await response.text();
        const heroSlides = parseCSV(csvData);
        
        // 2. Render the slides
        renderHeroSlides(heroSlides);
        
    } catch (error) {
        console.error('Error:', error);
        // Fallback to sample data
        renderHeroSlides([{
            bgFrom: "primary",
            bgTo: "secondary",
            badge: "דוגמא",
            title: "האתר פועל אך ללא חיבור לנתונים",
            subtitle: "המידע יופיע כשהחיבור יצליח",
            buttonText: "לחץ כאן",
            link: "#",
            image: "https://via.placeholder.com/500x300"
        }]);
    }
});

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const slides = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const slide = {};
        
        headers.forEach((header, index) => {
            slide[header.trim()] = values[index] ? values[index].trim() : '';
        });
        
        slides.push(slide);
    }
    
    return slides;
}

function renderHeroSlides(slides) {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    
    slider.innerHTML = slides.map((slide, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : 'inactive'} absolute inset-0 bg-gradient-to-r from-${slide.bgFrom} to-${slide.bgTo} flex items-center">
            <div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
                <div class="md:w-1/2 text-white text-right md:pr-10 mb-8 md:mb-0">
                    <span class="bg-white text-${slide.bgFrom} px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block">${slide.badge}</span>
                    <h1 class="text-3xl md:text-5xl font-bold mb-4">${slide.title}</h1>
                    <p class="text-xl mb-6">${slide.subtitle}</p>
                    <a href="${slide.link}" class="bg-white text-${slide.bgFrom} px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition inline-flex items-center">
                        ${slide.buttonText} <i class="fas fa-arrow-left ml-2"></i>
                    </a>
                </div>
                <div class="md:w-1/2 flex justify-center">
                    <img src="${slide.image}" alt="${slide.title}" class="rounded-lg shadow-xl max-h-64">
                </div>
            </div>
        </div>
    `).join('');
    
    // Add navigation dots
    slider.innerHTML += `
        <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
            ${slides.map((_, i) => `
                <button class="slide-dot w-3 h-3 rounded-full bg-white ${i === 0 ? 'opacity-100' : 'opacity-50'}" data-slide="${i}"></button>
            `).join('')}
        </div>
    `;
    
    initSlider();
}

function initSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slide-dot');
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            slide.classList.toggle('inactive', i !== index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('opacity-100', i === index);
            dot.classList.toggle('opacity-50', i !== index);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.getAttribute('data-slide'));
            showSlide(currentIndex);
        });
    });

    // Auto-advance slides
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }, 5000);
    console.log("Raw CSV data:", csvData);
    console.log("Parsed slides:", heroSlides);
}
