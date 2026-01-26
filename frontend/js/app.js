// Configuration API
const API_URL = 'http://localhost:3000/api';

// ===== GESTION DU PANIER =====
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
  }

  add(product, variant, quantity = 1) {
    const key = `${product.id}-${variant?.id || 'none'}`;
    const existingItem = this.items.find(item => item.key === key);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        key,
        product,
        variant,
        quantity
      });
    }

    this.save();
    this.updateUI();
    this.showToast(`${product.title} ajouté au panier!`, 'success');
  }

  remove(key) {
    this.items = this.items.filter(item => item.key !== key);
    this.save();
    this.updateUI();
  }

  update(key, quantity) {
    const item = this.items.find(item => item.key === key);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.save();
      this.updateUI();
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  updateUI() {
    const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  clear() {
    this.items = [];
    this.save();
    this.updateUI();
  }
}

const cart = new Cart();

// ===== GESTION DE L'AUTHENTIFICATION =====
class Auth {
  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  isAdmin() {
    const user = this.getUser();
    return user?.role === 'admin';
  }
}

const auth = new Auth();

// ===== REQUÊTES API =====
async function apiCall(endpoint, options = {}) {
  const token = auth.getToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur serveur');
  }

  return response.json();
}

// ===== UTILITAIRES =====
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Mettre à jour le panier au chargement
document.addEventListener('DOMContentLoaded', () => {
  cart.updateUI();

  // Afficher le lien admin si utilisateur admin
  if (auth.isAdmin()) {
    const adminLink = document.getElementById('admin-link');
    if (adminLink) adminLink.style.display = 'block';
  }
});

// ===== FONCTIONS DE GESTION DU DOM =====
function createProductCard(product) {
  const image = product.images?.[0]?.url || '/assets/images/placeholder.jpg';
  
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${image}" alt="${product.title}" onerror="this.src='/assets/images/placeholder.jpg'">
        ${product.featured ? '<span class="product-badge">Coup de cœur</span>' : ''}
      </div>
      <div class="product-info">
        <p class="product-category">${product.category_name || 'Autres'}</p>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <div class="product-actions">
          <button class="btn-small btn-view" onclick="window.location.href='pages/product.html?id=${product.id}'">
            Détails
          </button>
          <button class="btn-small btn-add" onclick="quickAddToCart(${product.id}, '${product.title}', ${product.price})">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  `;
}

function quickAddToCart(productId, title, price) {
  cart.add({ id: productId, title, price }, null, 1);
}

// Export pour utilisation dans d'autres fichiers
window.cart = cart;
window.auth = auth;
window.apiCall = apiCall;
window.showToast = showToast;
window.formatPrice = formatPrice;
window.createProductCard = createProductCard;
window.quickAddToCart = quickAddToCart;
