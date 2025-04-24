// Google Sheets Integration
document.addEventListener('DOMContentLoaded', function() {
   const SHEET_ID = '1TLYmSgwL6-9atwKMuYHPqI_fjYUyLFI87QWJiKh540ZZQr1Uei79Yz_D3Cx39DRZypwMHn_KA2Seokj';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    // Remove Google's wrapper text
    const json = JSON.parse(text.substring(47).slice(0, -2));
    console.log("Data loaded:", json);
    renderAllData(json);
  })
  .catch(err => {
    console.error("Error loading Sheets:", err);
    loadSampleData(); // Fallback to hardcoded data
  });
    
    // Fetch data from Google Sheets
    fetch(SHEET_URL)
        .then(res => res.text())
        .then(text => {
            const json = JSON.parse(text.substr(47).slice(0, -2));
            const data = processSheetData(json);
            renderAllData(data);
        })
        .catch(err => console.error('Error loading data:', err));
});

function processSheetData(json) {
    const data = {};
    const sheets = json.table.rows;
    
    // Process each sheet
    sheets.forEach(sheet => {
        const sheetName = sheet.c[0].v;
        const sheetData = JSON.parse(sheet.c[1].v);
        data[sheetName] = sheetData;
    });
    
    return data;
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
            <button class="slide-dot w-3 h-3 rounded-full bg-white ${index === 0 ? 'opacity-100' : 'opacity-50'} focus:outline-none" data-slide="${index}"></button>
        `;
    });
    
    slider.innerHTML = slideHTML + `
        <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
            ${dotsHTML}
        </div>
    `;
    
    // Initialize slider functionality
    initSlider();
}

function renderCategories(categories) {
    const grid = document.getElementById('categoriesGrid');
    const footerCategories = document.getElementById('footerCategories');
    let gridHTML = '';
    let footerHTML = '';
    
    categories.forEach(category => {
        gridHTML += `
            <a href="${category.link}" class="category-card bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition">
                <div class="bg-${category.color} bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i class="${category.icon} text-${category.color} text-2xl"></i>
                </div>
                <h3 class="font-medium">${category.name}</h3>
                <p class="text-sm text-gray-500">${category.count} מוצרים</p>
            </a>
        `;
        
        footerHTML += `<li><a href="${category.link}" class="hover:text-accent transition">${category.name}</a></li>`;
    });
    
    grid.innerHTML = gridHTML;
    footerCategories.innerHTML = footerHTML;
}

function renderFlashDeals(products) {
    const grid = document.getElementById('flashDealsGrid');
    grid.innerHTML = products.map(product => createProductCard(product, true)).join('');
}

function renderTrendingProducts(products) {
    const grid = document.getElementById('trendingProductsGrid');
    grid.innerHTML = products.map(product => createProductCard(product)).join('');
}

function renderDealOfTheDay(product) {
    const container = document.getElementById('dealOfTheDay');
    container.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl overflow-hidden">
            <div class="flex flex-col md:flex-row">
                <div class="md:w-1/2 p-4">
                    <div class="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                    </div>
                </div>
                <div class="md:w-1/2 p-4 text-right">
                    <h3 class="text-xl font-bold mb-2">${product.name}</h3>
                    <div class="flex items-center justify-end mb-2">
                        <i class="fas fa-star text-yellow-400 mr-1"></i>
                        <span>${product.rating}</span>
                        <span class="text-gray-500 mr-1">(${product.reviews})</span>
                    </div>
                    <div class="mb-4">
                        <span class="text-2xl font-bold text-primary">₪${product.price}</span>
                        <span class="text-gray-500 line-through block">₪${product.originalPrice}</span>
                        <span class="text-sm bg-primary text-white px-2 py-1 rounded-full">${product.discount}% הנחה</span>
                    </div>
                    <ul class="text-sm mb-4 space-y-1">
                        ${product.features.map(feature => `
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-green-500 ml-2"></i>
                                <span>${feature}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <a href="${product.link}" class="block bg-primary text-white py-2 px-4 rounded-full text-center hover:bg-red-600 transition">הוסף לסל</a>
                </div>
            </div>
        </div>
    `;
}

function renderBlogPosts(posts) {
    const grid = document.getElementById('blogPostsGrid');
    grid.innerHTML = posts.map(post => `
        <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
            <div class="h-48 bg-gray-200 overflow-hidden">
                <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover">
            </div>
            <div class="p-4">
                <span class="text-sm text-${post.categoryColor} font-medium">${post.category}</span>
                <h3 class="text-xl font-bold my-2">${post.title}</h3>
                <p class="text-gray-600 mb-4">${post.excerpt}</p>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">${post.date}</span>
                    <a href="${post.link}" class="text-primary font-medium hover:underline">קרא עוד</a>
                </div>
            </div>
        </div>
    `).join('');
}

function createProductCard(product, isFlashDeal = false) {
    const badgeClass = product.isTrending ? 'trending-badge' : '';
    const badgeText = product.isTrending ? 'טרנד' : `${product.discount}% הנחה`;
    
    return `
        <div class="product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 relative">
            ${isFlashDeal ? `<div class="deal-badge ${badgeClass}">${badgeText}</div>` : ''}
            <div class="p-4">
                <div class="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                </div>
                <h3 class="font-medium text-right mb-2">${product.name}</h3>
                <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center">
                        <i class="fas fa-star text-yellow-400 mr-1"></i>
                        <span class="text-sm">${product.rating}</span>
                        <span class="text-sm text-gray-500 mr-1">(${product.reviews})</span>
                    </div>
                    <span class="text-sm text-gray-500">+${product.orders} הזמנות</span>
                </div>
                <div class="flex justify-between items-center">
                    <div>
                        <span class="text-lg font-bold text-primary">₪${product.price}</span>
                        <span class="text-sm text-gray-500 line-through block">₪${product.originalPrice}</span>
                    </div>
                    <a href="${product.link}" class="bg-primary text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition">קנה עכשיו</a>
                </div>
            </div>
        </div>
    `;
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
                slideDots[i].classList.remove('opacity-50');
                slideDots[i].classList.add('opacity-100');
            } else {
                slide.classList.remove('active');
                slide.classList.add('inactive');
                slideDots[i].classList.remove('opacity-100');
                slideDots[i].classList.add('opacity-50');
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
