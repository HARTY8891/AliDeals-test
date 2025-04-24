// sheets.js - Complete Working Solution with CSV integration

async function loadCSVData() {
    try {
        console.log('Loading CSV data...');
        const response = await fetch('./data/products.csv?v=' + Date.now());
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('CSV loaded successfully');
        
        // Parse and render the CSV data
        const productsData = parseCSV(csvText);
        renderAllSections(productsData);
        
    } catch (error) {
        console.error('Error loading or parsing data:', error);
        // Fallback to sample data
        renderHeroSlides([{
            bgFrom: "from-primary",
            bgTo: "to-secondary",
            badge: "דוגמא",
            title: "האתר פועל אך ללא חיבור לנתונים",
            subtitle: "המידע יופיע כשהחיבור יצליח",
            buttonText: "לחץ כאן",
            link: "#",
            image: "https://via.placeholder.com/500x300"
        }]);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
        console.warn('CSV file is empty or has no data rows');
        return [];
    }
    
    const headers = lines[0].split(',').map(header => header.trim());
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
        // Improved CSV parsing that handles quoted values
        const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        const product = {};
        
        headers.forEach((header, index) => {
            product[header] = values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';
        });
        
        products.push(product);
    }
    
    return products;
}

function renderAllSections(products) {
    // Render hero slider
    renderHeroSlides(products.filter(p => p.section === 'hero'));
    
    // Render categories
    renderCategories(products.filter(p => p.section === 'categories'));
    
    // Render flash deals
    renderFlashDeals(products.filter(p => p.section === 'flashDeals'));
    
    // Render trending products
    renderTrendingProducts(products.filter(p => p.section === 'trending'));
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
    
    // Render slides HTML
    slider.innerHTML = slides.map((slide, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : 'inactive'} absolute inset-0 ${slide.bgFrom || 'from-primary'} ${slide.bgTo || 'to-secondary'} flex items-center">
            <div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
                <div class="md:w-1/2 text-white text-right md:pr-10 mb-8 md:mb-0">
                    <span class="bg-white ${slide.bgFrom ? 'text-' + slide.bgFrom.split('-')[1] : 'text-primary'} px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block">${slide.badge || 'מבצע'}</span>
                    <h1 class="text-3xl md:text-5xl font-bold mb-4">${slide.title || 'כותרת דוגמא'}</h1>
                    <p class="text-xl mb-6">${slide.subtitle || 'תיאור דוגמא'}</p>
                    <a href="${slide.link || '#'}" class="bg-white ${slide.bgFrom ? 'text-' + slide.bgFrom.split('-')[1] : 'text-primary'} px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition inline-flex items-center">
                        ${slide.buttonText || 'לפרטים'} <i class="fas fa-arrow-left ml-2"></i>
                    </a>
                </div>
                <div class="md:w-1/2 flex justify-center">
                    <img src="${slide.image || 'https://via.placeholder.com/500x300'}" alt="${slide.title || 'מוצר'}" class="rounded-lg shadow-xl max-h-64" onerror="this.src='https://via.placeholder.com/500x300'">
                </div>
            </div>
        </div>
    `).join('');
    
    // Add navigation dots if more than one slide
    if (slides.length > 1) {
        slider.innerHTML += `
            <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
                ${slides.map((_, i) => `
                    <button class="slide-dot w-3 h-3 rounded-full bg-white ${i === 0 ? 'opacity-100' : 'opacity-50'}" data-slide="${i}"></button>
                `).join('')}
            </div>
        `;
        
        // Initialize slider functionality
        initSlider(slides.length);
    }
}

function renderCategories(categories) {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    if (!categories || categories.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center py-10">No categories available</p>';
        return;
    }
    
    container.innerHTML = categories.map(cat => `
        <a href="${cat.link || '#'}" class="category-card bg-white rounded-lg shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition">
            <div class="w-16 h-16 rounded-full ${cat.color || 'bg-primary'} bg-opacity-10 flex items-center justify-center mb-3">
                <i class="${cat.icon || 'fas fa-box'} ${cat.color || 'text-primary'} text-xl"></i>
            </div>
            <h3 class="font-bold mb-1">${cat.name || 'קטגוריה'}</h3>
            <p class="text-sm text-gray-500">${cat.count || '0'} מוצרים</p>
        </a>
    `).join('');
}

function renderFlashDeals(deals) {
    const container = document.getElementById('flashDealsGrid');
    if (!container) return;
    
    if (!deals || deals.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center py-10">No flash deals available</p>';
        return;
    }
    
    container.innerHTML = deals.map(deal => `
        <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
            <div class="relative">
                <img src="${deal.image || 'https://via.placeholder.com/300x300'}" alt="${deal.name || 'מוצר'}" class="w-full h-48 object-cover" onerror="this.src='https://via.placeholder.com/300x300'">
                ${deal.discount ? `<span class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">${deal.discount}% OFF</span>` : ''}
            </div>
            <div class="p-4">
                <h3 class="font-bold mb-2">${deal.name || 'מוצר ללא שם'}</h3>
                <div class="flex items-center mb-2">
                    <span class="text-primary font-bold">$${deal.price || '0.00'}</span>
                    ${deal.originalPrice ? `<span class="text-gray-400 text-sm line-through mr-2">$${deal.originalPrice}</span>` : ''}
                </div>
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <span>${deal.orders || '0'} הזמנות</span>
                    <span>${deal.rating || '0'} <i class="fas fa-star text-yellow-400"></i></span>
                </div>
                <a href="${deal.link || '#'}" class="mt-4 block text-center bg-primary text-white py-2 rounded-lg hover:bg-red-600 transition">הוסף לסל</a>
            </div>
        </div>
    `).join('');
}

function renderTrendingProducts(products) {
    const container = document.getElementById('trendingProductsGrid');
    if (!container) return;
    
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center py-10">No trending products available</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
            <div class="relative">
                <img src="${product.image || 'https://via.placeholder.com/300x300'}" alt="${product.name || 'מוצר'}" class="w-full h-48 object-cover" onerror="this.src='https://via.placeholder.com/300x300'">
                ${product.isTrending ? `<span class="absolute top-2 right-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">טרנד</span>` : ''}
            </div>
            <div class="p-4">
                <h3 class="font-bold mb-2">${product.name || 'מוצר ללא שם'}</h3>
                <div class="flex items-center mb-2">
                    <span class="text-primary font-bold">$${product.price || '0.00'}</span>
                    ${product.originalPrice ? `<span class="text-gray-400 text-sm line-through mr-2">$${product.originalPrice}</span>` : ''}
                </div>
                <a href="${product.link || '#'}" class="mt-4 block text-center bg-secondary text-white py-2 rounded-lg hover:bg-blue-600 transition">הוסף לסל</a>
            </div>
        </div>
    `).join('');
}

function initSlider(totalSlides) {
    if (totalSlides <= 1) return;
    
    const heroSlides = document.querySelectorAll('.hero-slide');
    const slideDots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;

    function showSlide(index) {
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

    slideDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            if (!isNaN(slideIndex)) {
                showSlide(slideIndex);
            }
        });
    });

    const slideInterval = setInterval(() => {
        showSlide((currentSlide + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(slideInterval);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', loadCSVData);
