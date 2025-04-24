// Google Sheets Integration - Complete Solution
document.addEventListener('DOMContentLoaded', function() {
    // Your Sheet ID (from the URL)
    const SHEET_ID = '1AvI_L7t_qAGCFi8iCkZTjNPgwOQU-b85kkHPIJDNKlE';
    
    // Correct JSON endpoint
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
    
    // CORS proxy (temporary for development)
    const PROXY_URL = 'https://api.allorigins.win/raw?url=';
    
    fetch(PROXY_URL + encodeURIComponent(SHEET_URL))
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.text();
        })
        .then(text => {
            // Check if we got HTML instead of JSON
            if (text.startsWith('<!DOCTYPE html>')) {
                throw new Error('Got HTML instead of JSON. Check sharing settings.');
            }
            
            try {
                // Clean Google's JSON response
                const json = JSON.parse(text.substring(47).slice(0, -2));
                console.log("Data loaded successfully:", json);
                
                // Process the data
                const data = processSheetData(json);
                renderAllData(data);
            } catch (e) {
                console.error("Error parsing data:", e);
                loadSampleData();
            }
        })
        .catch(err => {
            console.error('Error loading data:', err);
            loadSampleData();
        });
});

function processSheetData(json) {
    const data = {};
    
    // Process each sheet in the response
    if (json.table && json.table.rows) {
        json.table.rows.forEach(row => {
            if (row.c && row.c[0] && row.c[0].v) {
                const sheetName = row.c[0].v;
                const rowData = {};
                
                // Process columns
                json.table.cols.forEach((col, index) => {
                    if (col.label && index > 0) { // Skip first column
                        rowData[col.label] = row.c[index]?.v;
                    }
                });
                
                if (!data[sheetName]) data[sheetName] = [];
                data[sheetName].push(rowData);
            }
        });
    }
    
    return data;
}

function loadSampleData() {
    console.warn("⚠️ Loading sample data instead");
    
    const sampleData = {
        heroSlides: [{
            bgFrom: "primary",
            bgTo: "secondary",
            badge: "דוגמא",
            title: "האתר פועל אך ללא חיבור לנתונים",
            subtitle: "המידע האמיתי יטען כשהחיבור יצליח",
            buttonText: "לחץ כאן",
            link: "#",
            image: "https://via.placeholder.com/500x300"
        }],
        categories: [{
            name: "גאדג'טים",
            icon: "fas fa-mobile-alt",
            color: "primary",
            count: "0 מוצרים",
            link: "#"
        }],
        flashDeals: [{
            name: "שעון חכם דוגמא",
            price: "99.90",
            originalPrice: "299.90",
            discount: 67,
            rating: 4.5,
            reviews: 1200,
            orders: 500,
            image: "https://via.placeholder.com/300x300",
            link: "#",
            isTrending: false
        }],
        trendingProducts: [{
            name: "אוזניות אלחוטיות דוגמא",
            price: "129.90",
            originalPrice: "399.90",
            discount: 68,
            rating: 4.7,
            reviews: 850,
            orders: 300,
            image: "https://via.placeholder.com/300x300",
            link: "#",
            isTrending: true
        }],
        dealOfTheDay: [{
            name: "מוצר השבוע דוגמא",
            price: "199.90",
            originalPrice: "499.90",
            discount: 60,
            rating: 4.8,
            reviews: 2500,
            image: "https://via.placeholder.com/300x300",
            link: "#",
            features: ["ניקוי אוטומטי", "מיפוי חכם", "עבודה עם אפליקציה"]
        }],
        blogPosts: [{
            title: "טיפים לקנייה מאליאקספרס",
            category: "טיפים",
            categoryColor: "secondary",
            excerpt: "כיצד לחסוך כסף בקניות באינטרנט",
            date: "3 ימים לפני",
            image: "https://via.placeholder.com/600x400",
            link: "#"
        }]
    };
    
    renderAllData(sampleData);
}

function renderAllData(data) {
    if (data.heroSlides) {
        const slider = document.getElementById('heroSlider');
        if (slider) {
            slider.innerHTML = data.heroSlides.map((slide, index) => `
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
            `).join('') + `
            <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
                ${data.heroSlides.map((_, i) => `
                    <button class="slide-dot w-3 h-3 rounded-full bg-white ${i === 0 ? 'opacity-100' : 'opacity-50'}" data-slide="${i}"></button>
                `).join('')}
            </div>`;
        }
    }

    if (data.categories) {
        const grid = document.getElementById('categoriesGrid');
        const footer = document.getElementById('footerCategories');
        if (grid) {
            grid.innerHTML = data.categories.map(cat => `
                <a href="${cat.link}" class="category-card bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition">
                    <div class="bg-${cat.color} bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="${cat.icon} text-${cat.color} text-2xl"></i>
                    </div>
                    <h3 class="font-medium">${cat.name}</h3>
                    <p class="text-sm text-gray-500">${cat.count}</p>
                </a>
            `).join('');
        }
        if (footer) {
            footer.innerHTML = data.categories.map(cat => `
                <li><a href="${cat.link}" class="hover:text-accent transition">${cat.name}</a></li>
            `).join('');
        }
    }

    // Add similar render functions for flashDeals, trendingProducts, etc.
    // ...
}

// Initialize slider functionality
function initSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slide-dot');
    let current = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            slide.classList.toggle('inactive', i !== index);
            if (dots[i]) {
                dots[i].classList.toggle('opacity-100', i === index);
                dots[i].classList.toggle('opacity-50', i !== index);
            }
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            current = parseInt(dot.getAttribute('data-slide'));
            showSlide(current);
        });
    });

    setInterval(() => {
        current = (current + 1) % slides.length;
        showSlide(current);
    }, 5000);
}

// Initialize when DOM is ready
setTimeout(initSlider, 100);
