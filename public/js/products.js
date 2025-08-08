// Product Catalog JavaScript
class ProductCatalog {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.cart = [];
    this.categories = [];
    this.init();
  }

  async init() {
    await this.loadCategories();
    await this.loadProducts();
    this.setupEventListeners();
    this.loadCart();
    this.updateCartUI();
  }

  async loadCategories() {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        this.categories = data.categories;
        this.populateCategoryFilter();
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    this.categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      categoryFilter.appendChild(option);
    });
  }

  async loadProducts() {
    try {
      document.getElementById('loadingSpinner').style.display = 'block';
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        this.products = data.products;
        this.filteredProducts = [...this.products];
        this.renderProducts();
      }
    } catch (error) {
      console.error('Error loading products:', error);
      this.showNoResults();
    } finally {
      document.getElementById('loadingSpinner').style.display = 'none';
    }
  }

  setupEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', 
      this.debounce(() => this.filterProducts(), 300));

    // Filter controls
    document.getElementById('categoryFilter').addEventListener('change', () => this.filterProducts());
    document.getElementById('sortFilter').addEventListener('change', () => this.filterProducts());
    document.getElementById('minPrice').addEventListener('input', 
      this.debounce(() => this.filterProducts(), 500));
    document.getElementById('maxPrice').addEventListener('input', 
      this.debounce(() => this.filterProducts(), 500));
    document.getElementById('inStockOnly').addEventListener('change', () => this.filterProducts());

    // Cart functionality
    document.getElementById('cartToggle').addEventListener('click', () => this.toggleCart());
    document.getElementById('closeCart').addEventListener('click', () => this.toggleCart());
    
    // Close cart when clicking outside
    document.getElementById('cartModal').addEventListener('click', (e) => {
      if (e.target.id === 'cartModal') {
        this.toggleCart();
      }
    });
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  async filterProducts() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortFilter').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const inStockOnly = document.getElementById('inStockOnly').checked;

    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category !== 'all') params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (inStockOnly) params.append('inStock', 'true');

    // Parse sort parameters
    const [sortField, sortOrder] = sortBy.split('-');
    params.append('sortBy', sortField);
    params.append('sortOrder', sortOrder);

    try {
      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        this.filteredProducts = data.products;
        this.renderProducts();
      }
    } catch (error) {
      console.error('Error filtering products:', error);
    }
  }

  renderProducts() {
    const container = document.getElementById('productsContainer');
    const noResults = document.getElementById('noResults');

    if (this.filteredProducts.length === 0) {
      container.innerHTML = '';
      noResults.classList.remove('hidden');
      return;
    }

    noResults.classList.add('hidden');
    container.innerHTML = this.filteredProducts.map(product => this.createProductCard(product)).join('');
  }

  createProductCard(product) {
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    return `
      <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div class="relative">
          <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-48 object-cover">
          ${discount > 0 ? `<span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">${discount}% OFF</span>` : ''}
          ${!product.inStock ? '<span class="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-sm">Out of Stock</span>' : ''}
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-2 line-clamp-2">${product.name}</h3>
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
          
          <div class="flex items-center mb-2">
            <div class="flex text-yellow-400">
              ${this.renderStars(product.rating)}
            </div>
            <span class="text-sm text-gray-500 ml-2">(${product.reviews})</span>
          </div>

          <div class="flex items-center justify-between mb-3">
            <div>
              <span class="text-2xl font-bold text-green-600">₹${product.price.toLocaleString()}</span>
              ${product.originalPrice ? `<span class="text-sm text-gray-500 line-through ml-2">₹${product.originalPrice.toLocaleString()}</span>` : ''}
            </div>
          </div>

          <div class="flex gap-2">
            <button onclick="productCatalog.viewProduct(${product.id})" 
                    class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
              View Details
            </button>
            <button onclick="productCatalog.addToCart(${product.id})" 
                    ${!product.inStock ? 'disabled' : ''}
                    class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
              <i class="fas fa-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
  }

  async viewProduct(productId) {
    // For now, just show an alert. In a real app, this would open a modal or navigate to a detail page
    const product = this.products.find(p => p.id === productId);
    if (product) {
      alert(`Product: ${product.name}\nPrice: ₹${product.price}\nDescription: ${product.description}`);
    }
  }

  async addToCart(productId) {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      const data = await response.json();
      
      if (data.success) {
        this.loadCart();
        this.updateCartUI();
        this.showNotification('Product added to cart!', 'success');
      } else {
        this.showNotification(data.error || 'Failed to add product to cart', 'error');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showNotification('Failed to add product to cart', 'error');
    }
  }

  async loadCart() {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      
      if (data.success) {
        this.cart = data.cart;
        this.cartTotal = data.total;
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  updateCartUI() {
    const cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
    
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (this.cart.length === 0) {
      cartItems.innerHTML = '<p class="text-gray-500 text-center py-4">Your cart is empty</p>';
    } else {
      cartItems.innerHTML = this.cart.map(item => `
        <div class="flex items-center justify-between py-2 border-b">
          <div class="flex-1">
            <h4 class="font-medium">${item.name}</h4>
            <p class="text-sm text-gray-500">₹${item.price} x ${item.quantity}</p>
          </div>
          <button onclick="productCatalog.removeFromCart(${item.id})" 
                  class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `).join('');
    }
    
    cartTotal.textContent = this.cartTotal ? this.cartTotal.toLocaleString() : '0';
  }

  async removeFromCart(productId) {
    try {
      const response = await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        this.loadCart();
        this.updateCartUI();
        this.showNotification('Product removed from cart', 'success');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  }

  toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('hidden');
  }

  showNotification(message, type = 'info') {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  showNoResults() {
    document.getElementById('productsContainer').innerHTML = '';
    document.getElementById('noResults').classList.remove('hidden');
  }
}

// Initialize the product catalog when the page loads
let productCatalog;
document.addEventListener('DOMContentLoaded', () => {
  productCatalog = new ProductCatalog();
});
