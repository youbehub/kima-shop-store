let currentProduct = null;
let selectedVariant = null;

async function loadProduct() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
      window.location.href = 'shop.html';
      return;
    }

    currentProduct = await apiCall(`/products/${id}`);

    // Remplir les détails
    document.getElementById('title').textContent = currentProduct.title;
    document.getElementById('category').textContent = currentProduct.category_name || 'Catégorie';
    document.getElementById('price').textContent = formatPrice(currentProduct.price);
    document.getElementById('description').textContent = currentProduct.description;

    // Galerie d'images
    const images = currentProduct.images || [];
    const mainImg = images[0]?.url || '/assets/images/placeholder.svg';
    document.getElementById('mainImage').src = mainImg;
    document.getElementById('mainImage').onerror = function() { this.src = '/assets/images/placeholder.svg'; };

    // Thumbnails
    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = images.map((img, idx) => `
      <div class="thumbnail ${idx === 0 ? 'active' : ''}" onclick="changeImage('${img.url}', this)">
        <img src="${img.url}" alt="" onerror="this.src='/assets/images/placeholder.svg'">
      </div>
    `).join('');

    // Variantes
    if (currentProduct.variants?.length > 0) {
      const sizes = [...new Set(currentProduct.variants.filter(v => v.size).map(v => v.size))];
      const colors = [...new Set(currentProduct.variants.filter(v => v.color).map(v => v.color))];

      if (sizes.length > 0) {
        document.getElementById('sizes-group').style.display = 'block';
        document.getElementById('sizes').innerHTML = sizes.map(size => `
          <button class="variant-btn" onclick="selectVariant('size', '${size}')">
            ${size}
          </button>
        `).join('');
      }

      if (colors.length > 0) {
        document.getElementById('colors-group').style.display = 'block';
        document.getElementById('colors').innerHTML = colors.map(color => `
          <button class="variant-btn" onclick="selectVariant('color', '${color}')">
            ${color}
          </button>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Erreur:', error);
    showToast('Erreur lors du chargement du produit', 'error');
  }
}

function changeImage(src, element) {
  document.getElementById('mainImage').src = src;
  document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  element.classList.add('active');
}

let selectedSize = null;
let selectedColor = null;

function selectVariant(type, value) {
  if (type === 'size') {
    selectedSize = value;
    document.querySelectorAll('[onclick*="\'size\'"]').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
  } else if (type === 'color') {
    selectedColor = value;
    document.querySelectorAll('[onclick*="\'color\'"]').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
  }
}

function addProductToCart() {
  if (!currentProduct) return;

  const variant = currentProduct.variants?.find(v => 
    (!selectedSize || v.size === selectedSize) &&
    (!selectedColor || v.color === selectedColor)
  );

  const quantity = parseInt(document.getElementById('quantity').value) || 1;

  cart.add(currentProduct, variant, quantity);
}

document.addEventListener('DOMContentLoaded', loadProduct);
