// Google Sheets Integration
document.addEventListener('DOMContentLoaded', function() {
    // Replace with your actual Sheet ID
    const SHEET_ID = '1TLYmSgwL6-9atwKMuYHPqI_fjYUyLFI87QWJiKh540ZZQr1Uei79Yz_D3Cx39DRZypwMHn_KA2Seokj';
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

    // For development only - remove in production
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    
    fetch(PROXY_URL + SHEET_URL)
        .then(res => res.text())
        .then(text => {
            try {
                // Clean Google's JSON response
                const json = JSON.parse(text.substring(47).slice(0, -2));
                console.log("Success! Data loaded:", json);
                
                // Process the data
                const data = processSheetData(json);
                renderAllData(data);
            } catch (e) {
                console.error("Error parsing JSON:", e);
                loadSampleData();
            }
        })
        .catch(err => {
            console.error('Network error loading data:', err);
            loadSampleData();
        });
});

function processSheetData(json) {
    const data = {};
    
    // Assuming first row contains column headers
    const headers = json.table.rows[0].c.map(cell => cell?.v);
    
    // Process each row (skipping header row)
    for (let i = 1; i < json.table.rows.length; i++) {
        const row = json.table.rows[i];
        const sheetName = row.c[0]?.v; // First column determines sheet name
        
        if (!sheetName) continue;
        
        if (!data[sheetName]) {
            data[sheetName] = [];
        }
        
        const rowData = {};
        headers.forEach((header, j) => {
            if (header && j > 0) { // Skip first column (sheet name)
                rowData[header] = row.c[j]?.v;
            }
        });
        
        data[sheetName].push(rowData);
    }
    
    return data;
}

function loadSampleData() {
    console.warn("⚠️ Loading sample data instead of live data");
    
    const sampleData = {
        heroSlides: [
            {
                bgFrom: "primary",
                bgTo: "secondary",
                badge: "דוגמא",
                title: "האתר פועל אך ללא חיבור לנתונים",
                subtitle: "המידע האמיתי יטען כשהחיבור יצליח",
                buttonText: "לחץ כאן",
                link: "#",
                image: "https://via.placeholder.com/500x300"
            }
        ],
        categories: [
            {
                name: "גאדג'טים",
                icon: "fas fa-mobile-alt",
                color: "primary",
                count: "0 מוצרים",
                link: "#"
            },
            {
                name: "אופנה",
                icon: "fas fa-tshirt",
                color: "secondary",
                count: "0 מוצרים",
                link: "#"
            }
        ],
        flashDeals: [
            {
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
            }
        ],
        dealOfTheDay: [
            {
                name: "מוצר השבוע דוגמא",
                price: "199.90",
                originalPrice: "499.90",
                discount: 60,
                rating: 4.8,
                reviews: 2500,
                image: "https://via.placeholder.com/300x300",
                link: "#",
                features: ["ניקוי אוטומטי", "מיפוי חכם", "עבודה עם אפליקציה"]
            }
        ]
    };
    
    renderAllData(sampleData);
}

function renderAllData(data) {
    if (data.heroSlides) renderHeroSlides(data.heroSlides);
    if (data.categories) renderCategories(data.categories);
    if (data.flashDeals) renderFlashDeals(data.flashDeals);
    if (data.trendingProducts) renderTrendingProducts(data.trendingProducts);
    if (data.dealOfTheDay) renderDealOfTheDay(data.dealOfTheDay[0]);
    if (data.blogPosts) renderBlogPosts(data.blogPosts);
}

function renderHeroSlides(slides) {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    
    let slideHTML = '';
    let dotsHTML = '';
    
    slides.forEach((slide, index) => {
        const activeClass = index === 0 ? 'active' : 'inactive';
        slideHTML += `
            <div class="hero-slide ${activeClass} absolute inset-0 bg-gradient-to-r from-${slide.bgFrom} to-${slide.bgTo} flex items-center">
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
        `;
        
        dotsHTML += `
            <button class="slide-dot w-3 h-3 rounded-full bg-white ${index === 0 ? 'opacity-100' : 'opacity-50'}" data-slide="${index}"></button>
        `;
    });
    
    slider.innerHTML = slideHTML + `
        <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
            ${dotsHTML}
        </div>
    `;
    
    initSlider();
}

function initSlider() {
    const heroSlides = document.querySelectorAll('.hero-slide');
    const slideDots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;

    function showSlide(index) {
        heroSlides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.remove('inactive');
                slide.classList.add('active');
                if (slideDots[i]) {
                    slideDots[i].classList.remove('opacity-50');
                    slideDots[i].classList.add('opacity-100');
                }
            } else {
                slide.classList.remove('active');
                slide.classList.add('inactive');
                if (slideDots[i]) {
                    slideDots[i].classList.remove('opacity-100');
                    slideDots[i].classList.add('opacity-50');
                }
            }
        });
    }

    slideDots.forEach(dot => {
        dot.addEventListener('click', function() {
            currentSlide = parseInt(this.getAttribute('data-slide'));
            showSlide(currentSlide);
        });
    });

    // Auto-advance slides
    setInterval(() => {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        showSlide(currentSlide);
    }, 5000);
}

// ... (keep all other render functions exactly as you had them)
