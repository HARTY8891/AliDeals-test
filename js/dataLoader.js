// dataLoader.js - Handles local file loading
export async function loadLocalData() {
  try {
    // Load CSV file (alternative: use SheetJS for Excel)
    const response = await fetch('./data/products.csv');
    const csvData = await response.text();
    
    // Parse CSV into sections
    return parseCSVSections(csvData);
  } catch (error) {
    console.error('Error loading local data:', error);
    return loadSampleData();
  }
}

function parseCSVSections(csv) {
  const sections = {};
  const lines = csv.split('\n');
  let currentSection = null;
  
  lines.forEach(line => {
    // Detect section headers (format: [heroSlides], [categories], etc.)
    const sectionMatch = line.match(/^\[(.*?)\]/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      sections[currentSection] = [];
      return;
    }
    
    // Skip empty lines and comments
    if (!currentSection || !line.trim() || line.startsWith('#')) return;
    
    // Parse CSV line
    const values = line.split(',');
    const headers = getHeadersForSection(currentSection);
    
    if (values.length === headers.length) {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = values[index].trim();
      });
      sections[currentSection].push(item);
    }
  });
  
  return sections;
}

function getHeadersForSection(section) {
  // Define expected columns for each section
  const headers = {
    heroSlides: ['bgFrom', 'bgTo', 'badge', 'title', 'subtitle', 'buttonText', 'link', 'image'],
    categories: ['name', 'icon', 'color', 'count', 'link'],
    flashDeals: ['name', 'price', 'originalPrice', 'discount', 'rating', 'reviews', 'orders', 'image', 'link', 'isTrending']
    // Add other sections...
  };
  
  return headers[section] || [];
}