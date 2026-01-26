function logout() {
  auth.logout();
}

async function loadAccount() {
  const user = auth.getUser();

  if (!auth.isAuthenticated() || !user) {
    document.getElementById('unauthenticated').style.display = 'block';
    document.getElementById('authenticated').style.display = 'none';
    return;
  }

  document.getElementById('unauthenticated').style.display = 'none';
  document.getElementById('authenticated').style.display = 'block';

  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-email').textContent = user.email;

  loadOrders();
}

async function loadOrders() {
  try {
    const orders = await apiCall('/orders/my-orders');

    const ordersList = document.getElementById('orders-list');

    if (orders.length === 0) {
      ordersList.innerHTML = '<p style="color: #999;">Vous n\'avez pas encore de commandes.</p>';
      return;
    }

    ordersList.innerHTML = orders.map(order => `
      <div style="background: white; padding: 1.5rem; margin-bottom: 1rem; border-radius: 10px; border-left: 4px solid #C8A24A;">
        <div style="display: grid; grid-template-columns: 1fr auto; gap: 2rem; margin-bottom: 1rem;">
          <div>
            <p style="margin-bottom: 0.5rem;"><strong>Commande ${order.order_number}</strong></p>
            <p style="color: #999; font-size: 0.9rem;">${new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin-bottom: 0.5rem;"><strong>${formatPrice(order.total)}</strong></p>
            <p style="color: #999; font-size: 0.9rem;">
              <span style="display: inline-block; padding: 0.25rem 0.75rem; background: #f0f0f0; border-radius: 20px;">
                ${order.status}
              </span>
            </p>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Erreur:', error);
    showToast('Erreur lors du chargement des commandes', 'error');
  }
}

document.addEventListener('DOMContentLoaded', loadAccount);
