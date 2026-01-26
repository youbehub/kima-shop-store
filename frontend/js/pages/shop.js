let categories = [];

async function loadProducts() {
  try {
    const params = new URLSearchParams(window.location.search);
    const query = {
      search: document.getElementById('search-filter')?.value || params.get('search'),
      category_id: document.getElementById('category-filter')?.value,
      min_price: document.getElementById('price-min')?.value,
      max_price: document.getElementById('price-max')?.value,
      sort: document.getElementById('sort-filter')?.value,
      page: 1,
      limit: 12
    };

    const queryString = new URLSearchParams();
    Object.keys(query).forEach(key => {
      if (query[key]) queryString.append(key, query[key]);
    });

    const data = await apiCall(`/products?${queryString}`);
    const container = document.getElementById('products-container');

    if (data.products.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Aucun produit trouvé</p>';
      return;
    }

    container.innerHTML = data.products.map(product => createProductCard(product)).join('');
  } catch (error) {
    console.error('Erreur:', error);
    showToast('Erreur lors du chargement', 'error');
  }
}

async function loadCategories() {
  try {
    categories = await apiCall('/categories');
    const select = document.getElementById('category-filter');
    
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur:', error);
  }
}

function applyFilters() {
  loadProducts();
}

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadProducts();

  // Filtres en temps réel
  document.getElementById('search-filter')?.addEventListener('input', loadProducts);
});
