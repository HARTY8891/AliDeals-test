// sheets.js - Complete local CSV data solution

// Main data loader
async function loadLocalData() {
  try {
    // 1. Load the CSV file
    const response = await fetch('./data/products.csv');
    if (!response.ok) throw new Error('Failed to load CSV file');
    
    const csvData = await response.text();
    
    // 2. Parse into sections
    const sections = {};
    const lines = csvData.split('\n');
    let currentSection = null;
    let headers = [];
    
    for (const line of lines) {
      // Skip empty lines and comments
      if (!line.trim() || line.startsWith('#')) continue;
      
      // Check for section headers like [heroSlides]
      const sectionMatch = line.match(/^\[(.*?)\]/);
      if (sectionMatch) {
        currentSection = sectionMatch[1];
        sections[currentSection] = [];
        headers = getHeadersForSection(currentSection);
        continue;
      }
      
      // Only process if we're in a known section
      if (!currentSection || !headers.length) continue;
      
      // Parse CSV line (handling quoted values)
      const values = parseCSVLine(line);
      if (values.length !== headers.length) continue;
      
      // Create item object
      const item = {};
      headers.forEach((header, index) => {
        item[header] = values[index].trim();
      });
      
      sections[currentSection].push(item);
    }
    
    return sections;
    
  } catch (error) {
    console.error('Error loading local data:', error);
    return loadSampleData();
  }
}

// Helper to parse CSV lines with quoted values
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current); // Add last value
  return values;
}

// Define expected columns for each section
function getHeadersForSection(section) {
  const headersMap = {
    heroSlides: ['bgFrom', 'bgTo', 'badge', 'title', 'subtitle', 'buttonText', 'link', 'image'],
    categories: ['name', 'icon', 'color', 'count', 'link'],
    flashDeals: ['name', 'price', 'originalPrice', 'discount', 'rating', 'reviews', 'orders', 'image', 'link', 'isTrending'],
    trendingProducts: ['name', 'price', 'originalPrice', 'discount', 'rating', 'reviews', 'orders', 'image', 'link', 'isTrending'],
    dealOfTheDay: ['name', 'price', 'originalPrice', 'discount', 'rating', 'reviews', 'image', 'link', 'features'],
    blogPosts: ['title', 'category', 'categoryColor', 'excerpt', 'date', 'image', 'link']
  };
  
  return headersMap[section] || [];
}

// Fallback sample data
function loadSampleData() {
  console.warn("⚠️ Loading sample data instead");
  
  return {
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
    }]
    // Add other sections as needed...
  };
}

// Render functions (keep your existing ones)
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
  if (!slider || !slides.length) return;
  
  slider.innerHTML = slides.map((slide, index) => `
    <div class="hero-slide ${index === 0 ? 'active' : 'inactive'}">
      <div class="container">
        <div class="text-content">
          <span class="badge">${slide.badge}</span>
          <h1>${slide.title}</h1>
          <p>${slide.subtitle}</p>
          <a href="${slide.link}" class="btn">${slide.buttonText}</a>
        </div>
        <img src="${slide.image}" alt="${slide.title}">
      </div>
    </div>
  `).join('');
  
  // Add navigation dots if needed
  slider.innerHTML += `
    <div class="slider-dots">
      ${slides.map((_, i) => `
        <button class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>
      `).join('')}
    </div>
  `;
  
  initSlider();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadLocalData();
  renderAllData(data);
});
