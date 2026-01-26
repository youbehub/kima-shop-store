function renderCart() {
  const container = document.getElementById('cart-items');
  
  if (cart.items.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 2rem; grid-column: 1/-1;">Votre panier est vide</p>';
    updateTotals();
    return;
  }

  container.innerHTML = cart.items.map(item => `
    <div style="background: white; padding: 1.5rem; margin-bottom: 1rem; border-radius: 10px; display: grid; grid-template-columns: 100px 1fr auto; gap: 1.5rem; align-items: center;">
      <img src="${item.product.image_url || '/assets/images/placeholder.jpg'}" alt="${item.product.title}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px;">
      
      <div>
        <h3 style="margin-bottom: 0.5rem;">${item.product.title}</h3>
        <p style="color: #999; font-size: 0.9rem;">SKU: ${item.variant?.sku || 'N/A'}</p>
        ${item.variant ? `<p style="color: #999; font-size: 0.9rem;">${item.variant.size ? 'Taille: ' + item.variant.size : ''} ${item.variant.color ? 'Couleur: ' + item.variant.color : ''}</p>` : ''}
      </div>

      <div style="display: flex; gap: 1rem; align-items: center;">
        <div style="display: flex; align-items: center; border: 2px solid #ddd; border-radius: 8px; padding: 0.25rem;">
          <button onclick="updateQuantity('${item.key}', ${item.quantity - 1})" style="background: none; border: none; padding: 0.5rem; cursor: pointer;">-</button>
          <input type="number" value="${item.quantity}" onchange="updateQuantity('${item.key}', this.value)" style="width: 50px; text-align: center; border: none;">
          <button onclick="updateQuantity('${item.key}', ${item.quantity + 1})" style="background: none; border: none; padding: 0.5rem; cursor: pointer;">+</button>
        </div>
        
        <div style="text-align: right; min-width: 100px;">
          <p style="font-weight: bold; margin-bottom: 0.5rem;">${formatPrice(item.product.price * item.quantity)}</p>
          <button onclick="removeFromCart('${item.key}')" style="background: none; border: none; color: #e74c3c; cursor: pointer; text-decoration: underline;">Supprimer</button>
        </div>
      </div>
    </div>
  `).join('');

  updateTotals();
}

function updateQuantity(key, quantity) {
  quantity = parseInt(quantity);
  if (quantity <= 0) {
    removeFromCart(key);
  } else {
    cart.update(key, quantity);
    renderCart();
  }
}

function removeFromCart(key) {
  cart.remove(key);
  renderCart();
  showToast('Article supprimé du panier');
}

function updateTotals() {
  const subtotal = cart.getTotal();
  const shipping = cart.items.length > 0 ? 9.99 : 0;
  const total = subtotal + shipping;

  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('shipping').textContent = formatPrice(shipping);
  document.getElementById('total').textContent = formatPrice(total);
}

document.addEventListener('DOMContentLoaded', renderCart);
