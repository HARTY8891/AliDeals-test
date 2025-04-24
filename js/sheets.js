// sheets.js - Complete Working Solution

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 1. Load the CSV file
        console.log('Loading CSV data...');
        const response = await fetch('products.csv?v=' + Date.now());
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('CSV loaded successfully:', csvText);
        
        // 2. Parse the CSV data
        const heroSlides = parseCSV(csvText);
        console.log('Parsed slides data:', heroSlides);
        
        // 3. Render the slides
        renderHeroSlides(heroSlides);
        
    } catch (error) {
        console.error('Error loading or parsing data:', error);
        // Fallback to sample data
        renderHeroSlides([{
            bgFrom: "primary",
            bgTo: "secondary",
            badge: "הצעת השבוע!",
            title: "מציאות מדהימות על גאדג'טים",
            subtitle: "עד 70% הנחה על המוצרים החמים ביותר",
            buttonText: "גלה עכשיו",
            link: "#",
            image: "https://via.placeholder.com/500x300"
        }]);
    }
});

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
        console.warn('CSV file is empty or has no data rows');
        return [];
    }
    
    const headers = lines[0].split(',').map(header => header.trim());
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
        console.error('Error: #heroSlider element not found in DOM');
        return;
    }
    
    if (!slides || slides.length === 0) {
        console.warn('No slides data to render');
        slider.innerHTML = '<div class="text-center py-10">No slides available</div>';
        return;
    }
    
    // Clear existing content
    slider.innerHTML = '';
    
    // Render slides HTML
    slides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `hero-slide ${index === 0 ? 'active' : 'inactive'} absolute inset-0 bg-gradient-to-r from-${slide.bgFrom} to-${slide.bgTo} flex items-center`;
        slideDiv.style.background = `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))`;
        
        slideDiv.innerHTML = `
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
                    <img src="${slide.image}" alt="${slide.title}" class="rounded-lg shadow-xl max-h-64" onerror="this.src='https://via.placeholder.com/500x300'">
                </div>
            </div>
        `;
        
        slider.appendChild(slideDiv);
    });
    
    // Add navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20';
    
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `slide-dot w-3 h-3 rounded-full bg-white ${i === 0 ? 'opacity-100' : 'opacity-50'}`;
        dot.setAttribute('data-slide', i);
        dotsContainer.appendChild(dot);
    });
    
    slider.appendChild(dotsContainer);
    
    // Initialize slider functionality
    initSlider(slides.length);
}

function initSlider(totalSlides) {
    const heroSlides = document.querySelectorAll('.hero-slide');
    const slideDots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;

    function showSlide(index) {
        // Validate index range
        index = Math.max(0, Math.min(index, totalSlides - 1));
        
        heroSlides.forEach((slide, i) => {
            const isActive = i === index;
            slide.classList.toggle('active', isActive);
            slide.classList.toggle('inactive', !isActive);
            
            if (slideDots[i]) {
                slideDots[i].classList.toggle('opacity-100', isActive);
                slideDots[i].classList.toggle('opacity-50', !isActive);
            }
        });
        
        currentSlide = index;
    }

    // Add click handlers for dots
    slideDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            if (!isNaN(slideIndex)) {
                showSlide(slideIndex);
            }
        });
    });

    // Auto-advance slides
    const slideInterval = setInterval(() => {
        showSlide((currentSlide + 1) % totalSlides);
    }, 5000);

    // Cleanup on unmount
    return () => clearInterval(slideInterval);
}
