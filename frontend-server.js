const express = require('express');
const path = require('path');

const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mock data for both routes
const allLocations = [
  { city: 'Delhi' },
  { city: 'Mumbai' },
  { city: 'Bangalore' },
  { city: 'Chennai' },
  { city: 'Kolkata' },
  { city: 'Pune' },
  { city: 'Hyderabad' }
];

const allProperties = [
  {
    IMAGE_URL: '/uploads/1747213564121-andriyko-podilnyk-RCfi7vgJjUY-unsplash.jpg',
    ID: 1,
    NAME: 'Luxury Apartment',
    CITY: 'Delhi',
    STATE: 'Delhi',
    PRICEPERMONTH: 35000,
    RATING: 4.5
  },
  {
    IMAGE_URL: '/uploads/1747213698765-hrvoje_photography-ktF1Rr8EBFY-unsplash.jpg',
    ID: 2,
    NAME: 'Cozy Studio',
    CITY: 'Mumbai',
    STATE: 'Maharashtra',
    PRICEPERMONTH: 22000,
    RATING: 4.2
  },
  {
    IMAGE_URL: '/uploads/1755030391194-Boats1.avif',
    ID: 3,
    NAME: 'Lake View Villa',
    CITY: 'Bangalore',
    STATE: 'Karnataka',
    PRICEPERMONTH: 45000,
    RATING: 4.8
  }
];

// Home route - show all data
app.get('/', (req, res) => {
  const cityKeyword = '';
  const selectedCity = '';
  const locations = allLocations;
  const properties = allProperties;

  res.render('index', { user: null, locations, properties, cityKeyword, selectedCity });
});

// Search route for header search functionality
app.get('/search', (req, res) => {
  const query = req.query.query ? req.query.query.toLowerCase() : '';
  
  // Filter properties by search query (search in name, city, state)
  let properties = allProperties;
  if (query) {
    properties = allProperties.filter(p => 
      p.NAME.toLowerCase().includes(query) ||
      p.CITY.toLowerCase().includes(query) ||
      p.STATE.toLowerCase().includes(query)
    );
  }

  res.render('index', { 
    user: null, 
    locations: allLocations, 
    properties, 
    cityKeyword: '', 
    selectedCity: '',
    searchQuery: query 
  });
});

// Filter route for form submissions
app.get('/filter', (req, res) => {
  // Get filters from query
  const cityKeyword = req.query.cityKeyword ? req.query.cityKeyword.toLowerCase() : '';
  const selectedCity = req.query.city || '';
  const minPrice = req.query.minPrice ? parseInt(req.query.minPrice) : null;
  const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice) : null;
  const sortBy = req.query.sort || '';

  // Filter locations for dropdown by keyword
  let locations = allLocations;
  if (cityKeyword) {
    locations = allLocations.filter(loc => loc.city.toLowerCase().includes(cityKeyword));
  }

  // Filter properties by selected city, keyword, and price range
  let properties = allProperties;
  
  if (selectedCity) {
    properties = properties.filter(p => p.CITY.toLowerCase() === selectedCity.toLowerCase());
  }
  
  if (minPrice !== null) {
    properties = properties.filter(p => p.PRICEPERMONTH >= minPrice);
  }
  
  if (maxPrice !== null) {
    properties = properties.filter(p => p.PRICEPERMONTH <= maxPrice);
  }

  // Sort properties by price
  if (sortBy === 'ASC') {
    properties.sort((a, b) => a.PRICEPERMONTH - b.PRICEPERMONTH);
  } else if (sortBy === 'DESC') {
    properties.sort((a, b) => b.PRICEPERMONTH - a.PRICEPERMONTH);
  }

  res.render('index', { user: null, locations, properties, cityKeyword, selectedCity });
});

// Search route for header search functionality
app.get('/search', (req, res) => {
  const query = req.query.query ? req.query.query.toLowerCase() : '';
  
  // Filter properties by search query (search in name, city, state)
  let properties = allProperties;
  if (query) {
    properties = allProperties.filter(p => 
      p.NAME.toLowerCase().includes(query) ||
      p.CITY.toLowerCase().includes(query) ||
      p.STATE.toLowerCase().includes(query)
    );
  }

  res.render('index', { 
    user: null, 
    locations: allLocations, 
    properties, 
    cityKeyword: '', 
    selectedCity: '',
    searchQuery: query 
  });
});

const PORT = process.env.FRONTEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
});
