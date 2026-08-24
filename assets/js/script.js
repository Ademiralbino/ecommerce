// Base de Dados dos Produtos (Com URLs de fotos públicas do Unsplash)
const PRODUCTS = [
  {
    id: '1',
    name: 'Fone Bluetooth Pro',
    price: 150.00,
    category: 'eletronicos',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    alt: 'Fone de Ouvido Bluetooth Sem Fio Preto',
    description: 'Fone de ouvido sem fio de alta fidelidade com cancelamento de ruído ativo e autonomia de até 20 horas.',
    specs: ['Bluetooth 5.2', 'Até 20h de bateria', 'Carregamento rápido USB-C', 'Microfone Integrado HD']
  },
  {
    id: '2',
    name: 'Mochila Urbana Tech',
    price: 120.00,
    category: 'acessorios',
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    alt: 'Mochila Impermeável Urbana para Notebook',
    description: 'Mochila resistente à água com compartimento acolchoado para notebook de até 15.6 polegadas e entrada USB.',
    specs: ['Material Impermeável', 'Capacidade: 25 Litros', 'Entrada para Carregador', 'Bolsos Antifurto']
  },
  {
    id: '3',
    name: 'Tênis Esportivo Runner',
    price: 200.00,
    category: 'calcados',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    alt: 'Tênis Esportivo Corrida Confortável Azul',
    description: 'Tênis leve e respirável projetado para máximo amortecimento e conforto em caminhadas e corridas.',
    specs: ['Solado Ultra EVA', 'Tecido Mesh Respirável', 'Palmilha Ergonômica', 'Peso ultra leve (220g)']
  }
];

// Estado Global da Aplicação
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let shippingCost = parseFloat(sessionStorage.getItem('shippingCost')) || 0;
let userAddress = sessionStorage.getItem('userAddress') || '';
let appliedCoupon = localStorage.getItem('appliedCoupon') || null;
let currentCategory = 'todos';
let activeModalProduct = null;

const PHONE_NUMBER = "5511999999999"; // Substitua pelo seu número do WhatsApp

// Referências aos Elementos do DOM
let productGrid, noProductsMsg, searchInput, sortSelect;
let cartBtn, closeCartBtn, cartDrawer, cartOverlay, cartItemsContainer, cartCount;
let subtotalVal, shippingVal, discountVal, totalVal;
let cepInput, calcShippingBtn, shippingInfo;
let couponInput, applyCouponBtn, removeCouponBtn, couponInfo;
let checkoutBtn, toastContainer, menuToggle, navMenu;
let productModalOverlay, closeModalBtn, modalImg, modalCategory, modalTitle, modalPrice, modalDesc, modalSpecsList, modalAddToCartBtn;

// Evento de Carregamento Seguro
document.addEventListener('DOMContentLoaded', () => {
  try {
    initDOMElements();
    registerEvents();
    renderProducts();
    renderCart();
    checkSavedCoupon();
    startCountdown(15 * 60); // Inicia cronômetro em 15 minutos (00:15:00)

    if (shippingCost > 0 && userAddress && shippingInfo) {
      shippingInfo.textContent = `${userAddress} | Frete: R$ ${shippingCost.toFixed(2)}`;
      shippingInfo.style.color = 'green';
    }
  } catch (error) {
    console.error("Erro na inicialização da aplicação:", error);
  }
});

function initDOMElements() {
  productGrid = document.getElementById('product-grid');
  noProductsMsg = document.getElementById('no-products-msg');
  searchInput = document.getElementById('search-input');
  sortSelect = document.getElementById('sort-select');

  cartBtn = document.getElementById('cart-btn');
  closeCartBtn = document.getElementById('close-cart');
  cartDrawer = document.getElementById('cart-drawer');
  cartOverlay = document.getElementById('cart-overlay');
  cartItemsContainer = document.getElementById('cart-items');
  cartCount = document.getElementById('cart-count');

  subtotalVal = document.getElementById('subtotal-val');
  shippingVal = document.getElementById('shipping-val');
  discountVal = document.getElementById('discount-val');
  totalVal = document.getElementById('total-val');

  cepInput = document.getElementById('cep-input');
  calcShippingBtn = document.getElementById('calc-shipping-btn');
  shippingInfo = document.getElementById('shipping-info');

  couponInput = document.getElementById('coupon-input');
  applyCouponBtn = document.getElementById('apply-coupon-btn');
  removeCouponBtn = document.getElementById('remove-coupon-btn');
  couponInfo = document.getElementById('coupon-info');

  checkoutBtn = document.getElementById('checkout-btn');
  toastContainer = document.getElementById('toast-container');
  menuToggle = document.getElementById('menu-toggle');
  navMenu = document.getElementById('nav-menu');

  productModalOverlay = document.getElementById('product-modal-overlay');
  closeModalBtn = document.getElementById('close-modal-btn');
  modalImg = document.getElementById('modal-img');
  modalCategory = document.getElementById('modal-category');
  modalTitle = document.getElementById('modal-title');
  modalPrice = document.getElementById('modal-price');
  modalDesc = document.getElementById('modal-desc');
  modalSpecsList = document.getElementById('modal-specs-list');
  modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
}

function registerEvents() {
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
  }

  if (searchInput) searchInput.addEventListener('input', renderProducts);
  if (sortSelect) sortSelect.addEventListener('change', renderProducts);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentCategory = btn.getAttribute('data-category');
      renderProducts();
    });
  });

  if (cartBtn) cartBtn.addEventListener('click', () => toggleCart(true));
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
  if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (productModalOverlay) {
    productModalOverlay.addEventListener('click', (e) => {
      if (e.target === productModalOverlay) closeModal();
    });
  }

  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', () => {
      if (activeModalProduct) {
        addToCart(activeModalProduct.id);
        closeModal();
      }
    });
  }

  if (cepInput) {
    cepInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 5) {
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
      }
      e.target.value = value;
    });
  }

  if (calcShippingBtn) calcShippingBtn.addEventListener('click', calculateShipping);
  if (applyCouponBtn) applyCouponBtn.addEventListener('click', applyCoupon);
  if (removeCouponBtn) removeCouponBtn.addEventListener('click', removeCoupon);
  if (checkoutBtn) checkoutBtn.addEventListener('click', checkoutWhatsApp);
}

// Renderização dos Produtos na Tela
function renderProducts() {
  if (!productGrid) return;

  let filtered = PRODUCTS.filter(p => {
    const matchCategory = (currentCategory === 'todos' || p.category === currentCategory);
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const matchSearch = p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm);
    return matchCategory && matchSearch;
  });

  const sortOption = sortSelect ? sortSelect.value : 'default';
  if (sortOption === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'name-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  productGrid.innerHTML = '';

  if (filtered.length === 0) {
    if (noProductsMsg) noProductsMsg.style.display = 'block';
  } else {
    if (noProductsMsg) noProductsMsg.style.display = 'none';
    filtered.forEach(p => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.alt}" class="product-img" onclick="openModal('${p.id}')">
        <h3 onclick="openModal('${p.id}')">${p.name}</h3>
        <p class="price">R$ ${p.price.toFixed(2)}</p>
        <button class="btn-details" onclick="openModal('${p.id}')">Ver mais detalhes</button>
        <button class="add-to-cart-btn" onclick="addToCart('${p.id}')">Adicionar ao Carrinho</button>
      `;
      productGrid.appendChild(card);
    });
  }
}

// Modal de Detalhes do Produto
function openModal(id) {
  const p = PRODUCTS.find(prod => prod.id === id);
  if (!p || !productModalOverlay) return;

  activeModalProduct = p;
  modalImg.src = p.img;
  modalImg.alt = p.alt;
  modalCategory.textContent = p.category;
  modalTitle.textContent = p.name;
  modalPrice.textContent = `R$ ${p.price.toFixed(2)}`;
  modalDesc.textContent = p.description;

  modalSpecsList.innerHTML = '';
  p.specs.forEach(spec => {
    const li = document.createElement('li');
    li.textContent = spec;
    modalSpecsList.appendChild(li);
  });

  productModalOverlay.classList.add('active');
  productModalOverlay.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  if (productModalOverlay) {
    productModalOverlay.classList.remove('active');
    productModalOverlay.setAttribute('aria-hidden', 'true');
  }
}

// Alternar Exibição do Carrinho (Drawer)
function toggleCart(open) {
  if (!cartDrawer || !cartOverlay) return;
  if (open) {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    cartDrawer.setAttribute('aria-hidden', 'false');
  } else {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    cartDrawer.setAttribute('aria-hidden', 'true');
  }
}

// Toast Notification
function showToast(message) {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// Consulta ViaCEP
async function calculateShipping() {
  const rawCep = cepInput.value.replace(/\D/g, '');
  if (rawCep.length !== 8) {
    shippingInfo.textContent = 'Informe um CEP válido com 8 dígitos.';
    shippingInfo.style.color = 'red';
    return;
  }

  shippingInfo.textContent = 'Consultando ViaCEP...';
  shippingInfo.style.color = '#3498db';

  try {
    const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
    const data = await response.json();

    if (data.erro) {
      shippingInfo.textContent = 'CEP não encontrado.';
      shippingInfo.style.color = 'red';
      return;
    }

    if (data.uf === 'SP') shippingCost = 12.00;
    else if (['RJ', 'MG', 'ES', 'PR', 'SC', 'RS'].includes(data.uf)) shippingCost = 18.00;
    else shippingCost = 25.00;

    userAddress = `${data.localidade}/${data.uf} (${data.bairro})`;
    sessionStorage.setItem('shippingCost', shippingCost);
    sessionStorage.setItem('userAddress', userAddress);

    shippingInfo.textContent = `${userAddress} | Frete: R$ ${shippingCost.toFixed(2)}`;
    shippingInfo.style.color = 'green';
    updateTotals();
  } catch (error) {
    shippingInfo.textContent = 'Erro ao consultar CEP. Tente novamente.';
    shippingInfo.style.color = 'red';
  }
}

// Gerenciamento de Cupons
function checkSavedCoupon() {
  if (appliedCoupon === 'PRIMEIRA10' && couponInput && couponInfo) {
    couponInput.value = 'PRIMEIRA10';
    couponInfo.textContent = 'Cupom de 10% aplicado!';
    couponInfo.style.color = 'green';
    if (applyCouponBtn) applyCouponBtn.style.display = 'none';
    if (removeCouponBtn) removeCouponBtn.style.display = 'block';
  }
}

function applyCoupon() {
  const code = couponInput.value.trim().toUpperCase();
  if (code === 'PRIMEIRA10') {
    appliedCoupon = 'PRIMEIRA10';
    localStorage.setItem('appliedCoupon', appliedCoupon);
    couponInfo.textContent = 'Cupom de 10% aplicado com sucesso!';
    couponInfo.style.color = 'green';
    if (applyCouponBtn) applyCouponBtn.style.display = 'none';
    if (removeCouponBtn) removeCouponBtn.style.display = 'block';
  } else {
    couponInfo.textContent = 'Cupom inválido.';
    couponInfo.style.color = 'red';
  }
  updateTotals();
}

function removeCoupon() {
  appliedCoupon = null;
  localStorage.removeItem('appliedCoupon');
  couponInput.value = '';
  couponInfo.textContent = 'Cupom removido.';
  couponInfo.style.color = '#777';
  if (applyCouponBtn) applyCouponBtn.style.display = 'block';
  if (removeCouponBtn) removeCouponBtn.style.display = 'none';
  updateTotals();
}

// Manipulação do Carrinho
function addToCart(id) {
  const p = PRODUCTS.find(item => item.id === id);
  if (!p) return;

  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: p.id, name: p.name, price: p.price, quantity: 1 });
  }

  saveCart();
  renderCart();
  showToast(`"${p.name}" foi adicionado ao carrinho!`);
}

function updateQuantity(id, amount) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += amount;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
  if (!cartItemsContainer) return;
  cartItemsContainer.innerHTML = '';
  let count = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
  } else {
    cart.forEach(item => {
      count += item.quantity;
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <div>
          <h4>${item.name}</h4>
          <p>R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <div class="cart-item-controls">
          <button onclick="updateQuantity('${item.id}', -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
    });
  }

  if (cartCount) cartCount.textContent = count;
  updateTotals();
}

function updateTotals() {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountRate = appliedCoupon === 'PRIMEIRA10' ? 0.10 : 0;
  const discountValAmount = subtotal * discountRate;
  const total = subtotal - discountValAmount + shippingCost;

  if (subtotalVal) subtotalVal.textContent = `R$ ${subtotal.toFixed(2)}`;
  if (shippingVal) shippingVal.textContent = `R$ ${shippingCost.toFixed(2)}`;
  if (discountVal) discountVal.textContent = `- R$ ${discountValAmount.toFixed(2)}`;
  if (totalVal) totalVal.textContent = `R$ ${total.toFixed(2)}`;
}

// Envio para WhatsApp
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert('Adicione ao menos um produto ao carrinho.');
    return;
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountRate = appliedCoupon === 'PRIMEIRA10' ? 0.10 : 0;
  const discountValAmount = subtotal * discountRate;
  const total = subtotal - discountValAmount + shippingCost;

  let text = `*Novo Pedido - MinhaLoja*\n\n`;
  text += `*Itens:*\n`;

  cart.forEach(item => {
    text += `- ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
  });

  text += `\n*Resumo:*\n`;
  if (userAddress) text += `Endereço: ${userAddress}\n`;
  text += `Subtotal: R$ ${subtotal.toFixed(2)}\n`;
  text += `Frete: R$ ${shippingCost.toFixed(2)}\n`;
  if (appliedCoupon) text += `Cupom: ${appliedCoupon} (-R$ ${discountValAmount.toFixed(2)})\n`;
  text += `*Total: R$ ${total.toFixed(2)}*\n`;

  const encodedText = encodeURIComponent(text);
  window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodedText}`, '_blank');
}

// Cronômetro Regressivo
function startCountdown(durationInSeconds) {
  let timer = durationInSeconds;
  const timerDisplay = document.getElementById('timer');
  if (!timerDisplay) return;

  function updateDisplay() {
    const hours = String(Math.floor(timer / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((timer % 3600) / 60)).padStart(2, '0');
    const seconds = String(timer % 60).padStart(2, '0');

    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;

    if (timer <= 0) {
      clearInterval(interval);
      timerDisplay.textContent = "Oferta Encerrada!";
    }
    timer--;
  }

  updateDisplay();
  const interval = setInterval(updateDisplay, 1000);
}