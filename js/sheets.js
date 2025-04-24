// sheets.js - Final Corrected Version
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 1. Load the CSV file
        const response = await fetch('./data/products.csv');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const csvData = await response.text();
        console.log('CSV loaded successfully');
        
        // 2. Parse CSV data
        const heroSlides = parseCSV(csvData);
        console.log('Parsed slides:', heroSlides);
        
        // 3. Render slides
        renderHeroSlides(heroSlides);
        
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to sample data
        renderHeroSlides([{
            bgFrom: "primary",
            bgTo: "secondary",
            badge: "דוגמא",
            title: "האתר פועל אך ללא חיבור לנתונים",
            subtitle: "המידע יופיע כשהחיבור יצליח",
            buttonText: "לחץ כאן",
            link: "#",
            image: "https://placehold.co/500x300"
        }]);
    }
});

function parseCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const slides = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const slide = {};
        
        headers.forEach((header, index) => {
            slide[header] = values[index] ? values[index].trim() : '';
        });
        
        slides.push(slide);
    }
    
    return slides;
}

function renderHeroSlides(slides) {
    const slider = document.getElementById('heroSlider');
    if (!slider) {
        console.error('Hero slider element not found');
        return;
    }
    
    if (!slides || slides.length === 0) {
        console.warn('No slides to render');
        return;
    }
    
    // Clear previous content
    slider.innerHTML = '';
    
    // Create slides HTML
    slides.forEach((slide, index) => {
        const slideEl = document.createElement('div');
        slideEl.className = `hero-slide ${index === 0 ? 'active' : 'inactive'} absolute inset-0 bg-gradient-to-r from-${slide.bgFrom} to-${slide.bgTo} flex items-center`;
        slideEl.innerHTML = `
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
                    <img src="${slide.image}" alt="${slide.title}" class="rounded-lg shadow-xl max-h-64" onerror="this.src='https://placehold.co/500x300'">
                </div>
            </div>
        `;
        slider.appendChild(slideEl);
    });
    
    // Add navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20';
    dotsContainer.innerHTML = slides.map((_, i) => `
        <button class="slide-dot w-3 h-3 rounded-full bg-white ${i === 0 ? 'opacity-100' : 'opacity-50'}" data-slide="${i}"></button>
    `).join('');
    slider.appendChild(dotsContainer);
    
    // Initialize slider functionality
    initSlider();
}

function initSlider() {
    const heroSlides = document.querySelectorAll('.hero-slide');
    const slideDots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;

    function showSlide(index) {
        heroSlides.forEach((slide, i) => {
            const isActive = i === index;
            slide.classList.toggle('active', isActive);
            slide.classList.toggle('inactive', !isActive);
            
            if (slideDots[i]) {
                slideDots[i].classList.toggle('opacity-100', isActive);
                slideDots[i].classList.toggle('opacity-50', !isActive);
            }
        });
    }

    // Add click handlers for dots
    slideDots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentSlide = parseInt(dot.getAttribute('data-slide'));
            showSlide(currentSlide);
        });
    });

    // Auto-advance slides
    const slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        showSlide(currentSlide);
    }, 5000);

    // Cleanup on unmount
    return () => clearInterval(slideInterval);
}
