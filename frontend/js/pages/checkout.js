function displayOrderSummary() {
  const summary = document.getElementById('order-summary');
  const shipping = 9.99;
  const subtotal = cart.getTotal();
  const total = subtotal + shipping;

  summary.innerHTML = cart.items.map(item => `
    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #ddd;">
      <span>${item.product.title} x${item.quantity}</span>
      <span>${formatPrice(item.product.price * item.quantity)}</span>
    </div>
  `).join('');

  summary.innerHTML += `
    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; font-weight: 600;">
      <span>Sous-total</span>
      <span>${formatPrice(subtotal)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; font-weight: 600;">
      <span>Livraison</span>
      <span>${formatPrice(shipping)}</span>
    </div>
  `;

  document.getElementById('order-total').textContent = formatPrice(total);
}

async function submitCheckout(event) {
  event.preventDefault();

  if (cart.items.length === 0) {
    showToast('Votre panier est vide', 'error');
    return;
  }

  const formData = new FormData(event.target);
  const shipping = 9.99;
  const subtotal = cart.getTotal();

  const orderData = {
    customer_name: formData.get('customer_name'),
    customer_email: formData.get('customer_email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    city: formData.get('city'),
    postal_code: formData.get('postal_code'),
    country: formData.get('country'),
    subtotal: subtotal,
    shipping_cost: shipping,
    tax: 0,
    items: cart.items.map(item => ({
      product_id: item.product.id,
      variant_id: item.variant?.id,
      quantity: item.quantity,
      unit_price: item.product.price
    }))
  };

  try {
    const response = await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });

    cart.clear();
    showToast('Commande créée avec succès!', 'success');
    
    setTimeout(() => {
      window.location.href = `order-confirmation.html?order=${response.order.order_number}`;
    }, 1500);
  } catch (error) {
    showToast('Erreur lors de la création de la commande: ' + error.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', displayOrderSummary);
