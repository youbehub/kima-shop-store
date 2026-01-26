// Vérifier l'accès admin
document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAdmin()) {
    window.location.href = 'auth.html';
    return;
  }

  // Charger les données
  loadOrders();
  loadProducts();
  loadCategories();
});

function switchSection(section) {
  document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.admin-link').forEach(el => el.classList.remove('active'));
  
  document.getElementById(section).classList.add('active');
  event.target.classList.add('active');
}

function adminLogout() {
  auth.logout();
}

// ===== COMMANDES =====
async function loadOrders() {
  try {
    const orders = await apiCall('/admin/orders');
    const tbody = document.getElementById('orders-tbody');

    tbody.innerHTML = orders.map(order => `
      <tr>
        <td>${order.order_number}</td>
        <td>${order.customer_name}</td>
        <td>${formatPrice(order.total)}</td>
        <td><span class="status-${order.status}">${order.status}</span></td>
        <td>
          <select onchange="updateOrderStatus(${order.id}, this.value)">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>En attente</option>
            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmée</option>
            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Expédiée</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Livrée</option>
            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Annulée</option>
          </select>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Erreur:', error);
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    await apiCall(`/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    showToast('Statut mis à jour', 'success');
    loadOrders();
  } catch (error) {
    showToast('Erreur: ' + error.message, 'error');
  }
}

// ===== PRODUITS =====
async function loadProducts() {
  try {
    const data = await apiCall('/products');
    const tbody = document.getElementById('products-tbody');

    tbody.innerHTML = data.products.map(product => {
      const image = product.images?.[0]?.image_url || '/assets/images/placeholder.jpg';
      return `
      <tr>
        <td><img src="${image}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;"></td>
        <td>${product.title}</td>
        <td>${product.category_name || 'N/A'}</td>
        <td>${formatPrice(product.price)}</td>
        <td>
          <button onclick="editProduct(${product.id})" style="background:none; border:none; color:#C8A24A; cursor:pointer; margin-right:0.5rem;">
            ✎ Modifier
          </button>
          <button onclick="deleteProduct(${product.id})" style="background:none; border:none; color:#e74c3c; cursor:pointer;">
            🗑️ Supprimer
          </button>
        </td>
      </tr>
    `}).join('');
  } catch (error) {
    console.error('Erreur:', error);
  }
}

function showAddProductForm() {
  document.getElementById('form-title').textContent = 'Ajouter un Produit';
  document.getElementById('add-product-form').style.display = 'flex';
  document.querySelector('#add-product-form form').reset();
  document.querySelector('#add-product-form form').dataset.productId = '';
}

function closeAddProductForm() {
  document.getElementById('add-product-form').style.display = 'none';
}

function editProduct(productId) {
  showToast('Fonctionnalité en cours de développement', 'info');
}

async function submitAddProduct(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.getToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création du produit');
    }

    showToast('Produit créé avec succès!', 'success');
    closeAddProductForm();
    form.reset();
    loadProducts();
  } catch (error) {
    showToast('Erreur: ' + error.message, 'error');
  }
}

async function deleteProduct(productId) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return;

  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${auth.getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }

    showToast('Produit supprimé avec succès!', 'success');
    loadProducts();
  } catch (error) {
    showToast('Erreur: ' + error.message, 'error');
  }
}

// ===== CATÉGORIES =====
async function loadCategories() {
  try {
    const categories = await apiCall('/categories');
    
    // Remplir la table
    const tbody = document.getElementById('categories-tbody');
    tbody.innerHTML = categories.map(cat => `
      <tr>
        <td>${cat.name}</td>
        <td>${cat.slug}</td>
        <td>
          <button onclick="deleteCategory(${cat.id})" style="background: none; border: none; color: #e74c3c; cursor: pointer;">
            Supprimer
          </button>
        </td>
      </tr>
    `).join('');

    // Remplir le select pour ajouter un produit
    const select = document.getElementById('product-category-select');
    select.innerHTML = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
  } catch (error) {
    console.error('Erreur:', error);
  }
}

function showAddCategoryForm() {
  document.getElementById('add-category-form').classList.add('active');
}

function closeAddCategoryForm() {
  document.getElementById('add-category-form').classList.remove('active');
}

async function submitAddCategory(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  try {
    await apiCall('/admin/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get('name'),
        slug: formData.get('slug')
      })
    });

    showToast('Catégorie ajoutée', 'success');
    closeAddCategoryForm();
    event.target.reset();
    loadCategories();
  } catch (error) {
    showToast('Erreur: ' + error.message, 'error');
  }
}

async function deleteCategory(categoryId) {
  if (!confirm('Êtes-vous sûr?')) return;

  try {
    await apiCall(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
    showToast('Catégorie supprimée', 'success');
    loadCategories();
  } catch (error) {
    showToast('Erreur: ' + error.message, 'error');
  }
}
