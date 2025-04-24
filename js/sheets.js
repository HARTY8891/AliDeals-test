// Google Sheets Integration - No API Key Version
document.addEventListener('DOMContentLoaded', function() {
    // Your Sheet ID (from the URL)
    const SHEET_ID = '1TLYmSgwL6-9atwKMuYHPqI_fjYUyLFI87QWJiKh540ZZQr1Uei79Yz_D3Cx39DRZypwMHn_KA2Seokj';
    
    // Correct JSON endpoint (no API key needed)
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
    
    // Temporary CORS proxy (remove in production)
    const PROXY_URL = 'https://corsproxy.io/?';
    
    // Only one fetch call needed
    fetch(PROXY_URL + encodeURIComponent(SHEET_URL))
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.text();
        })
        .then(text => {
            // First check if we got HTML instead of JSON
            if (text.startsWith('<!DOCTYPE html>')) {
                throw new Error('Got HTML instead of JSON. Check sharing settings.');
            }
            
            try {
                // Clean Google's JSON response
                const json = JSON.parse(text.substring(47).slice(0, -2));
                console.log("Data loaded successfully!");
                
                // Process the data
                const data = processSheetData(json);
                renderAllData(data);
            } catch (e) {
                console.error("Error parsing data:", e);
                loadSampleData(); // Fallback to sample data
            }
        })
        .catch(err => {
            console.error('Error loading data:', err);
            loadSampleData(); // Fallback to sample data
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
        }]
    };
    
    renderAllData(sampleData);
}

// ... (keep all your existing render functions exactly as they were)

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
