const fs = require('fs');
const path = require('path');

// Load products data
const loadProducts = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

module.exports = (app) => {
  // API endpoint to get all products with filtering and search
  app.get('/api/products', (req, res) => {
    try {
      let products = loadProducts();
      const { search, category, minPrice, maxPrice, inStock, sortBy, sortOrder } = req.query;

      // Search functionality
      if (search) {
        const searchTerm = search.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Category filter
      if (category && category !== 'all') {
        products = products.filter(product => product.category === category);
      }

      // Price range filter
      if (minPrice) {
        products = products.filter(product => product.price >= parseInt(minPrice));
      }
      if (maxPrice) {
        products = products.filter(product => product.price <= parseInt(maxPrice));
      }

      // Stock filter
      if (inStock === 'true') {
        products = products.filter(product => product.inStock);
      }

      // Sorting
      if (sortBy) {
        products.sort((a, b) => {
          let aValue = a[sortBy];
          let bValue = b[sortBy];
          
          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
          
          if (sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      res.json({
        success: true,
        products,
        total: products.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products'
      });
    }
  });

  // Product catalog page route
  app.get('/products', async (req, res) => {
    let user = {
      name: req.session.name == undefined ? null : req.session.name,
      USER_ID: req.session.userId,
    };
    res.render('products', { user });
  });
};
