// Charger les produits en vedette à la page d'accueil
async function loadFeaturedProducts() {
  try {
    const data = await apiCall('/products/featured');
    const container = document.getElementById('featured-products');
    
    if (data.length === 0) {
      container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Aucun produit en vedette</p>';
      return;
    }

    container.innerHTML = data.map(product => createProductCard(product)).join('');
  } catch (error) {
    console.error('Erreur:', error);
    showToast('Erreur lors du chargement des produits', 'error');
  }
}

document.addEventListener('DOMContentLoaded', loadFeaturedProducts);
