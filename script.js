// ============================================
// State
// ============================================
let pizzaState = {
  sizeName: 'Medium 12"',
  sizePrice: 14.00,
  crustName: 'Classic Neapolitan',
  crustPrice: 0.00,
  toppings: [],
  totalPrice: 14.00
};

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateLiveSummary();
  checkOpenStatus();
});

function setupEventListeners() {
  // Option Buttons (Size & Crust)
  document.querySelectorAll('.opt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      const type = target.dataset.type;

      // Toggle active style + aria-pressed within same group
      document.querySelectorAll(`[data-type="${type}"]`).forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      target.classList.add('active');
      target.setAttribute('aria-pressed', 'true');

      // Update state
      if (type === 'size') {
        pizzaState.sizeName = target.dataset.name;
        pizzaState.sizePrice = parseFloat(target.dataset.price);
      } else if (type === 'crust') {
        pizzaState.crustName = target.dataset.name;
        pizzaState.crustPrice = parseFloat(target.dataset.price);
      }

      updateLiveSummary();
    });
  });

  // Topping Checkboxes
  document.querySelectorAll('.topping-checkbox input').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      pizzaState.toppings = Array.from(document.querySelectorAll('.topping-checkbox input:checked'))
        .map(cb => cb.value);
      updateLiveSummary();
    });
  });

  // Cart Drawer Toggles
  const cartBtn = document.getElementById('cartBtn');
  const closeCart = document.getElementById('closeCart');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');

  cartBtn.addEventListener('click', () => showCart());
  closeCart.addEventListener('click', () => hideCart());
  cartOverlay.addEventListener('click', () => hideCart());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer.classList.contains('open')) {
      hideCart();
    }
  });

  function showCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('active');
    cartDrawer.setAttribute('aria-hidden', 'false');
    cartBtn.setAttribute('aria-expanded', 'true');
    closeCart.focus();
  }

  function hideCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('active');
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartBtn.setAttribute('aria-expanded', 'false');
    cartBtn.focus();
  }

  // Add to Cart
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    const cartItem = { ...pizzaState, id: Date.now() + Math.random() };
    cart.push(cartItem);
    updateCartUI();
    showCart();
  });

  // Checkout (demo only — no real order is placed)
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
      alert("Your cart is empty — build a pizza first!");
      return;
    }
    alert('Demo order placed! (No real order was submitted.)');
    cart = [];
    updateCartUI();
    hideCart();
  });
}

function updateLiveSummary() {
  const toppingsPrice = pizzaState.toppings.length * 1.50;
  pizzaState.totalPrice = pizzaState.sizePrice + pizzaState.crustPrice + toppingsPrice;

  document.getElementById('summarySize').innerText = pizzaState.sizeName;
  document.getElementById('summaryCrust').innerText = pizzaState.crustName;
  document.getElementById('summaryToppings').innerText = pizzaState.toppings.length > 0
    ? pizzaState.toppings.join(', ')
    : 'None';
  document.getElementById('totalPrice').innerText = pizzaState.totalPrice.toFixed(2);
}

function updateCartUI() {
  document.getElementById('cartCount').innerText = cart.length;
  const cartItemsContainer = document.getElementById('cartItems');

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
    document.getElementById('cartSubtotal').innerText = '0.00';
    return;
  }

  let subtotal = 0;
  cartItemsContainer.innerHTML = cart.map((item) => {
    subtotal += item.totalPrice;
    return `
      <div class="cart-line-item">
        <div class="item-info">
          <strong>${escapeHtml(item.sizeName)} Custom Pizza</strong>
          <small>${escapeHtml(item.crustName)} ${item.toppings.length ? '| ' + escapeHtml(item.toppings.join(', ')) : ''}</small>
          <button class="remove-item-btn" data-id="${item.id}">Remove</button>
        </div>
        <div class="item-price">$${item.totalPrice.toFixed(2)}</div>
      </div>
    `;
  }).join('');

  document.getElementById('cartSubtotal').innerText = subtotal.toFixed(2);

  // Wire up remove buttons
  cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseFloat(e.currentTarget.dataset.id);
      cart = cart.filter(item => item.id !== id);
      updateCartUI();
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function checkOpenStatus() {
  const currentHour = new Date().getHours();
  const statusBadge = document.getElementById('openStatus');

  // Open between 11 AM and 10 PM
  if (currentHour >= 11 && currentHour < 22) {
    statusBadge.innerText = "Open Now";
    statusBadge.style.background = "var(--basil)";
  } else {
    statusBadge.innerText = "Closed — opening at 11 AM";
    statusBadge.style.background = "var(--ember-dark)";
  }
}
