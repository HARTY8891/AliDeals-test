document.addEventListener('DOMContentLoaded', function() {
    // Your Sheet ID
    const SHEET_ID = '1AvI_L7t_qAGCFi8iCkZTjNPgwOQU-b85kkHPIJDNKlE';
    
    // List of all sheet tabs you're using
    const SHEET_TABS = [
        'heroSlides', 
        'categories', 
        'flashDeals', 
        'trendingProducts',
        'dealOfTheDay',
        'blogPosts'
    ];
    
    // CORS proxy (remove in production)
    const PROXY_URL = 'https://api.allorigins.win/raw?url=';
    
    // Fetch data for all tabs
    Promise.all(
        SHEET_TABS.map(tab => {
            const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tab)}`;
            return fetch(PROXY_URL + encodeURIComponent(url))
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.text();
                })
                .then(text => {
                    if (text.startsWith('<')) throw new Error('Received HTML instead of JSON');
                    
                    try {
                        const json = JSON.parse(text.substring(47).slice(0, -2));
                        return {
                            tabName: tab,
                            data: json.table.rows.map(row => {
                                const item = {};
                                json.table.cols.forEach((col, index) => {
                                    if (col.label) {
                                        item[col.label] = row.c[index]?.v;
                                    }
                                });
                                return item;
                            })
                        };
                    } catch (e) {
                        console.error(`Error parsing ${tab}:`, e);
                        return { tabName: tab, data: [] };
                    }
                })
                .catch(error => {
                    console.error(`Error loading ${tab}:`, error);
                    return { tabName: tab, data: [] };
                });
        })
    )
    .then(results => {
        const allData = {};
        results.forEach(({tabName, data}) => {
            allData[tabName] = data;
        });
        renderAllData(allData);
    })
    .catch(error => {
        console.error('Failed to load data:', error);
        loadSampleData();
    });
});

// Sample data fallback
function loadSampleData() {
    console.warn("Loading sample data...");
    const sampleData = {
        heroSlides: [{
            bgFrom: "primary",
            bgTo: "secondary",
            badge: "דוגמא",
            title: "אתר במצב בדיקה",
            subtitle: "הנתונים ייטענו כשהחיבור יצליח",
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
