document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load CSV
        const response = await fetch('./data/products.csv');
        if (!response.ok) throw new Error('CSV load failed');
        const csvData = await response.text();
        
        // Parse and verify
        const heroSlides = parseCSV(csvData);
        console.log('Parsed slides:', heroSlides);
        
        // Render
        renderHeroSlides(heroSlides);
        
    } catch (error) {
        console.error('Error:', error);
        renderHeroSlides([{
            bgFrom: "red-500",
            bgTo: "red-700",
            badge: "תקלה",
            title: "בעיה בטעינת הנתונים",
            subtitle: "אנא נסו שוב מאוחר יותר",
            buttonText: "רענן עמוד",
            link: "#",
            image: "https://via.placeholder.com/500x300"
        }]);
    }
});

function parseCSV(csv) {
    return csv.split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .slice(1) // Skip header
        .map(line => {
            const [bgFrom, bgTo, badge, title, subtitle, buttonText, link, image] = line.split(',');
            return { bgFrom, bgTo, badge, title, subtitle, buttonText, link, image };
        });
}

function renderHeroSlides(slides) {
    const slider = document.getElementById('heroSlider');
    if (!slider) {
        console.error('Error: #heroSlider element not found!');
        return;
    }

    // Clear previous content
    slider.innerHTML = '';
    
    // Add slides
    slides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `hero-slide ${index === 0 ? 'active' : 'inactive'} absolute inset-0 bg-gradient-to-r from-${slide.bgFrom} to-${slide.bgTo} flex items-center`;
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

    // Add dots if multiple slides
    if (slides.length > 1) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20';
        dotsContainer.innerHTML = slides.map((_, i) => `
            <button class="slide-dot w-3 h-3 rounded-full bg-white ${i === 0 ? 'opacity-100' : 'opacity-50'}" data-slide="${i}"></button>
        `).join('');
        slider.appendChild(dotsContainer);
    }

    initSlider(slides.length);
}

function initSlider(slideCount) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slide-dot');
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            const isActive = i === index;
            slide.classList.toggle('active', isActive);
            slide.classList.toggle('inactive', !isActive);
        });
        
        dots.forEach((dot, i) => {
            dot?.classList.toggle('opacity-100', i === index);
            dot?.classList.toggle('opacity-50', i !== index);
        });
    }

    // Dot click handlers
    document.querySelectorAll('.slide-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.getAttribute('data-slide'));
            showSlide(currentIndex);
        });
    });

    // Auto-advance
    if (slideCount > 1) {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slideCount;
            showSlide(currentIndex);
        }, 5000);
    }
}
