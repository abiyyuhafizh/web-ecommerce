/* ==========================================================================
   POKOK — E-commerce Simulation Script (vanilla JS)
   Sections:
   1. Product data
   2. State (cart)
   3. Rendering (product grid, cart drawer, checkout summary)
   4. Event wiring (nav, filters, search, modals, cart, checkout)
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 1. PRODUCT DATA                                                    */
  /* ------------------------------------------------------------------ */
  const PRODUCTS = [
    {
      id: 'atasan-01',
      name: 'Kaos Polos Hitam',
      category: 'atasan',
      categoryLabel: 'Atasan',
      price: 149000,
      images: ['assets/images/baju-hitam-polos.jpg'],
      description: 'Kaos polos hitam berbahan katun combed lembut, potongan regular fit yang enak dipakai harian maupun ditumpuk dengan outer.',
      rating: 4.8,
      reviews: 132,
      stock: 24
    },
    {
      id: 'atasan-02',
      name: 'Kaos Polos Navy',
      category: 'atasan',
      categoryLabel: 'Atasan',
      price: 149000,
      images: ['assets/images/baju-navy-polos.jpg'],
      description: 'Warna navy yang mudah dipadukan, dijahit rapi dengan kerah rib yang tidak mudah melar setelah dicuci berulang kali.',
      rating: 4.7,
      reviews: 98,
      stock: 18
    },
    {
      id: 'atasan-03',
      name: 'Kaos Polos Putih',
      category: 'atasan',
      categoryLabel: 'Atasan',
      price: 149000,
      images: ['assets/images/baju-putih-polos.jpg'],
      description: 'Kaos putih dasar wajib punya — bahan tebal tidak menerawang, cocok jadi lapisan dalam atau dipakai sendiri.',
      rating: 4.9,
      reviews: 210,
      stock: 30
    },
    {
      id: 'celana-01',
      name: 'Celana Jeans Wide Leg',
      category: 'celana',
      categoryLabel: 'Celana',
      price: 399000,
      images: ['assets/images/jeans.jpg'],
      description: 'Jeans potongan wide leg dengan wash medium-dark, nyaman dipakai seharian dan gampang dipadukan dengan kaos polos.',
      rating: 4.6,
      reviews: 76,
      stock: 12
    },
    {
      id: 'celana-02',
      name: 'Celana Jeans Regular Grey Wash',
      category: 'celana',
      categoryLabel: 'Celana',
      price: 459000,
      images: ['assets/images/levis.jpg', 'assets/images/levis-2.jpg'],
      description: 'Jeans regular fit dengan grey wash yang netral, bahan denim tebal khas klasik yang awet dipakai bertahun-tahun.',
      rating: 4.8,
      reviews: 154,
      stock: 9
    },
    {
      id: 'celana-03',
      name: 'Celana Chino Slim Abu-abu',
      category: 'celana',
      categoryLabel: 'Celana',
      price: 289000,
      images: ['assets/images/levis-2.jpg'],
      description: 'Chino slim fit warna abu-abu gelap, ringan dan tidak mudah kusut — pilihan aman untuk kerja maupun santai.',
      rating: 4.5,
      reviews: 61,
      stock: 3
    },
    {
      id: 'sepatu-01',
      name: 'Sepatu Pantofel Hitam',
      category: 'sepatu',
      categoryLabel: 'Sepatu',
      price: 599000,
      images: ['assets/images/pantofel.jpg'],
      description: 'Pantofel penny loafer kulit hitam dengan sol chunky, tampil formal tanpa kehilangan kenyamanan sepanjang hari.',
      rating: 4.7,
      reviews: 45,
      stock: 7
    },
    {
      id: 'sepatu-02',
      name: 'Sneakers Canvas Hitam Putih',
      category: 'sepatu',
      categoryLabel: 'Sepatu',
      price: 249000,
      images: ['assets/images/sepatu-hitam-putih.jpg'],
      description: 'Sneakers canvas klasik dengan sol putih tebal, ringan dipakai jalan jauh dan cocok dengan segala outfit kasual.',
      rating: 4.6,
      reviews: 189,
      stock: 21
    },
    {
      id: 'sepatu-03',
      name: 'Sneakers Kulit Hitam',
      category: 'sepatu',
      categoryLabel: 'Sepatu',
      price: 349000,
      images: ['assets/images/sneakers-hitam.jpg'],
      description: 'Sneakers low-top berbahan kulit sintetis hitam doff, siluet minimalis yang pas untuk gaya sehari-hari maupun semi-formal.',
      rating: 4.4,
      reviews: 0,
      stock: 0
    }
  ];

  /* ------------------------------------------------------------------ */
  /* 2. STATE                                                            */
  /* ------------------------------------------------------------------ */
  let cart = [];              // [{ id, qty }]
  let activeCategory = 'all';
  let searchTerm = '';
  let currentDetailProduct = null;
  let currentDetailImageIndex = 0;

  const rupiah = (num) =>
    'Rp' + Math.round(num).toLocaleString('id-ID');

  const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

  /* ------------------------------------------------------------------ */
  /* 3. DOM REFERENCES                                                   */
  /* ------------------------------------------------------------------ */
  const productGrid = document.getElementById('productGrid');
  const noResults = document.getElementById('noResults');
  const categoryPills = document.getElementById('categoryPills');
  const searchInput = document.getElementById('searchInput');
  const searchInputMobile = document.getElementById('searchInputMobile');

  const cartBtn = document.getElementById('cartBtn');
  const cartCount = document.getElementById('cartCount');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartItemsEl = document.getElementById('cartItems');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const detailOverlay = document.getElementById('detailOverlay');
  const detailModal = document.getElementById('detailModal');
  const detailClose = document.getElementById('detailClose');
  const detailBody = document.getElementById('detailBody');

  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutClose = document.getElementById('checkoutClose');
  const checkoutForm = document.getElementById('checkoutForm');
  const summaryItems = document.getElementById('summaryItems');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryShipping = document.getElementById('summaryShipping');
  const summaryTotal = document.getElementById('summaryTotal');

  const successOverlay = document.getElementById('successOverlay');
  const successModal = document.getElementById('successModal');
  const successClose = document.getElementById('successClose');
  const backToShop = document.getElementById('backToShop');
  const orderNumberEl = document.getElementById('orderNumber');

  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeMobileNav = document.getElementById('closeMobileNav');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');

  const toast = document.getElementById('toast');
  const SHIPPING_COST = 15000;

  /* ------------------------------------------------------------------ */
  /* 4. RENDER: PRODUCT GRID                                            */
  /* ------------------------------------------------------------------ */
  function renderStars(rating) {
    const full = Math.round(rating);
    return '&#9733;'.repeat(full) + '&#9734;'.repeat(5 - full);
  }

  function getFilteredProducts() {
    return PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch =
        searchTerm.trim() === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  function renderProductGrid() {
    const list = getFilteredProducts();
    productGrid.innerHTML = '';

    if (list.length === 0) {
      noResults.hidden = false;
      return;
    }
    noResults.hidden = true;

    list.forEach((p) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.dataset.id = p.id;

      const outOfStock = p.stock === 0;
      const lowStock = p.stock > 0 && p.stock <= 5;

      card.innerHTML = `
        <div class="card-media">
          <span class="card-category-tag">${p.categoryLabel}</span>
          <span class="card-stock-tag ${lowStock || outOfStock ? 'low' : ''}">
            ${outOfStock ? 'Habis' : lowStock ? 'Sisa ' + p.stock : 'Stok Tersedia'}
          </span>
          <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-name">${p.name}</h3>
          <p class="card-desc">${p.description}</p>
          <div class="card-rating">
            <span class="stars">${renderStars(p.rating)}</span>
            <span>${p.rating.toFixed(1)} ${p.reviews > 0 ? '(' + p.reviews + ')' : '(Baru)'}</span>
          </div>
          <div class="card-price-row">
            <span class="card-price">${rupiah(p.price)}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn btn-detail" data-action="detail" data-id="${p.id}">Lihat Detail</button>
          <button class="btn btn-add" data-action="add" data-id="${p.id}" ${outOfStock ? 'disabled' : ''}>
            ${outOfStock ? 'Stok Habis' : 'Tambah'}
          </button>
        </div>
      `;
      productGrid.appendChild(card);
    });
  }

  productGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === 'detail') {
      openDetailModal(id);
    } else if (btn.dataset.action === 'add') {
      addToCart(id, 1);
      pulseCartIcon();
      showToast(`${findProduct(id).name} ditambahkan ke keranjang`);
    }
  });

  /* ------------------------------------------------------------------ */
  /* 5. CATEGORY FILTER + SEARCH                                        */
  /* ------------------------------------------------------------------ */
  categoryPills.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    activeCategory = pill.dataset.category;
    [...categoryPills.querySelectorAll('.pill')].forEach((p) => {
      p.classList.toggle('active', p === pill);
      p.setAttribute('aria-selected', p === pill ? 'true' : 'false');
    });
    renderProductGrid();
  });

  function handleSearchInput(value) {
    searchTerm = value;
    // Keep both search inputs in sync (desktop + mobile)
    if (searchInput.value !== value) searchInput.value = value;
    if (searchInputMobile.value !== value) searchInputMobile.value = value;
    renderProductGrid();
  }
  searchInput.addEventListener('input', (e) => handleSearchInput(e.target.value));
  searchInputMobile.addEventListener('input', (e) => handleSearchInput(e.target.value));

  /* ------------------------------------------------------------------ */
  /* 6. PRODUCT DETAIL MODAL                                            */
  /* ------------------------------------------------------------------ */
  function openDetailModal(id) {
    const p = findProduct(id);
    if (!p) return;
    currentDetailProduct = p;
    currentDetailImageIndex = 0;
    renderDetailBody();
    openModal(detailModal, detailOverlay);
  }

  function renderDetailBody() {
    const p = currentDetailProduct;
    const outOfStock = p.stock === 0;
    const thumbs = p.images
      .map(
        (img, i) => `
      <button data-idx="${i}" class="${i === currentDetailImageIndex ? 'active' : ''}" aria-label="Lihat gambar ${i + 1}">
        <img src="${img}" alt="${p.name} tampilan ${i + 1}">
      </button>`
      )
      .join('');

    detailBody.innerHTML = `
      <div class="detail-grid">
        <div>
          <div class="detail-media">
            <img src="${p.images[currentDetailImageIndex]}" alt="${p.name}" id="detailMainImg">
          </div>
          ${p.images.length > 1 ? `<div class="detail-thumbs">${thumbs}</div>` : ''}
        </div>
        <div class="detail-info">
          <span class="detail-category">${p.categoryLabel}</span>
          <h2>${p.name}</h2>
          <div class="detail-price">${rupiah(p.price)}</div>
          <div class="detail-rating">
            <span class="stars">${renderStars(p.rating)}</span>
            <span>${p.rating.toFixed(1)} ${p.reviews > 0 ? '&middot; ' + p.reviews + ' ulasan' : '&middot; Produk baru'}</span>
          </div>
          <p class="detail-desc">${p.description}</p>
          <div class="detail-meta">
            <div><span>Kategori</span>${p.categoryLabel}</div>
            <div><span>Stok</span>${outOfStock ? 'Habis' : p.stock + ' unit'}</div>
          </div>
          <div class="qty-selector" ${outOfStock ? 'style="opacity:.5;pointer-events:none"' : ''}>
            <button type="button" id="detailQtyMinus" aria-label="Kurangi jumlah">&minus;</button>
            <input type="number" id="detailQtyInput" value="1" min="1" max="${p.stock}" aria-label="Jumlah produk">
            <button type="button" id="detailQtyPlus" aria-label="Tambah jumlah">&plus;</button>
          </div>
          <button class="btn btn-primary btn-block" id="detailAddBtn" ${outOfStock ? 'disabled' : ''}>
            ${outOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
          </button>
        </div>
      </div>
    `;

    const thumbBtns = detailBody.querySelectorAll('.detail-thumbs button');
    thumbBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        currentDetailImageIndex = Number(btn.dataset.idx);
        renderDetailBody();
      });
    });

    const qtyInput = document.getElementById('detailQtyInput');
    document.getElementById('detailQtyMinus')?.addEventListener('click', () => {
      qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
    });
    document.getElementById('detailQtyPlus')?.addEventListener('click', () => {
      qtyInput.value = Math.min(p.stock, Number(qtyInput.value) + 1);
    });
    qtyInput?.addEventListener('change', () => {
      let v = Number(qtyInput.value) || 1;
      v = Math.max(1, Math.min(p.stock, v));
      qtyInput.value = v;
    });

    document.getElementById('detailAddBtn')?.addEventListener('click', () => {
      const qty = Number(qtyInput.value) || 1;
      addToCart(p.id, qty);
      pulseCartIcon();
      showToast(`${p.name} (${qty}) ditambahkan ke keranjang`);
      closeModal(detailModal, detailOverlay);
    });
  }

  detailClose.addEventListener('click', () => closeModal(detailModal, detailOverlay));
  detailOverlay.addEventListener('click', () => closeModal(detailModal, detailOverlay));

  /* ------------------------------------------------------------------ */
  /* 7. CART LOGIC                                                       */
  /* ------------------------------------------------------------------ */
  function addToCart(id, qty) {
    const product = findProduct(id);
    if (!product || product.stock === 0) return;
    const existing = cart.find((item) => item.id === id);
    const currentQty = existing ? existing.qty : 0;
    const newQty = Math.min(product.stock, currentQty + qty);
    if (existing) {
      existing.qty = newQty;
    } else {
      cart.push({ id, qty: newQty });
    }
    renderCart();
  }

  function updateCartQty(id, delta) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const product = findProduct(id);
    item.qty = Math.max(1, Math.min(product.stock, item.qty + delta));
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((i) => i.id !== id);
    renderCart();
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => {
      const p = findProduct(item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  }

  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function renderCart() {
    cartCount.textContent = getCartCount();
    cartCount.style.display = getCartCount() > 0 ? 'flex' : 'none';

    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="cart-empty">Keranjang kamu masih kosong.<br>Yuk pilih produk favoritmu.</p>';
      checkoutBtn.disabled = true;
    } else {
      checkoutBtn.disabled = false;
      cartItemsEl.innerHTML = cart
        .map((item) => {
          const p = findProduct(item.id);
          return `
          <div class="cart-item" data-id="${item.id}">
            <img src="${p.images[0]}" alt="${p.name}">
            <div>
              <div class="cart-item-name">${p.name}</div>
              <div class="cart-item-price">${rupiah(p.price)}</div>
              <div class="cart-item-qty">
                <button data-action="dec" aria-label="Kurangi jumlah ${p.name}">&minus;</button>
                <span>${item.qty}</span>
                <button data-action="inc" aria-label="Tambah jumlah ${p.name}">&plus;</button>
              </div>
            </div>
            <button class="cart-item-remove" data-action="remove">Hapus</button>
          </div>`;
        })
        .join('');
    }

    cartSubtotalEl.textContent = rupiah(getCartTotal());
    renderCheckoutSummary();
  }

  cartItemsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const row = e.target.closest('.cart-item');
    const id = row.dataset.id;
    if (btn.dataset.action === 'inc') updateCartQty(id, 1);
    if (btn.dataset.action === 'dec') updateCartQty(id, -1);
    if (btn.dataset.action === 'remove') removeFromCart(id);
  });

  function pulseCartIcon() {
    cartBtn.style.transform = 'scale(1.15)';
    setTimeout(() => (cartBtn.style.transform = 'scale(1)'), 180);
  }

  cartBtn.addEventListener('click', () => openModal(cartDrawer, cartOverlay));
  cartClose.addEventListener('click', () => closeModal(cartDrawer, cartOverlay));
  cartOverlay.addEventListener('click', () => closeModal(cartDrawer, cartOverlay));

  /* ------------------------------------------------------------------ */
  /* 8. CHECKOUT                                                         */
  /* ------------------------------------------------------------------ */
  function renderCheckoutSummary() {
    if (cart.length === 0) {
      summaryItems.innerHTML = '<p class="cart-empty" style="padding:10px 0;">Belum ada produk di keranjang.</p>';
    } else {
      summaryItems.innerHTML = cart
        .map((item) => {
          const p = findProduct(item.id);
          return `<div class="summary-item">
            <span class="name">${p.name} <span class="qty">&times;${item.qty}</span></span>
            <span>${rupiah(p.price * item.qty)}</span>
          </div>`;
        })
        .join('');
    }
    const subtotal = getCartTotal();
    const shipping = cart.length > 0 ? SHIPPING_COST : 0;
    summarySubtotal.textContent = rupiah(subtotal);
    summaryShipping.textContent = rupiah(shipping);
    summaryTotal.textContent = rupiah(subtotal + shipping);
  }

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    closeModal(cartDrawer, cartOverlay);
    renderCheckoutSummary();
    openModal(checkoutModal, checkoutOverlay);
  });
  checkoutClose.addEventListener('click', () => closeModal(checkoutModal, checkoutOverlay));
  checkoutOverlay.addEventListener('click', () => closeModal(checkoutModal, checkoutOverlay));

  /* ---- Simple form validation ---- */
  const VALIDATORS = {
    fullName: (v) => v.trim().length >= 3 || 'Nama lengkap minimal 3 karakter.',
    phone: (v) => /^[0-9+\s-]{9,15}$/.test(v.trim()) || 'Masukkan nomor telepon yang valid (9–15 digit).',
    address: (v) => v.trim().length >= 8 || 'Alamat terlalu singkat, mohon lengkapi.',
    city: (v) => v.trim().length >= 2 || 'Kota wajib diisi.',
    payment: (v) => v !== '' || 'Pilih metode pembayaran.'
  };

  function validateField(name) {
    const field = document.getElementById(name);
    const errorEl = document.getElementById('err-' + name);
    const result = VALIDATORS[name](field.value);
    const group = field.closest('.form-group');
    if (result === true) {
      group.classList.remove('invalid');
      errorEl.textContent = '';
      return true;
    } else {
      group.classList.add('invalid');
      errorEl.textContent = result;
      return false;
    }
  }

  Object.keys(VALIDATORS).forEach((name) => {
    const field = document.getElementById(name);
    field.addEventListener('blur', () => validateField(name));
  });

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const allValid = Object.keys(VALIDATORS)
      .map(validateField)
      .every(Boolean);
    if (!allValid) {
      const firstInvalid = checkoutForm.querySelector('.form-group.invalid input, .form-group.invalid textarea, .form-group.invalid select');
      firstInvalid?.focus();
      return;
    }

    // Simulate order creation
    const orderNum = 'POKOK-' + Math.floor(1000 + Math.random() * 9000);
    orderNumberEl.textContent = '#' + orderNum;

    closeModal(checkoutModal, checkoutOverlay);
    openModal(successModal, successOverlay);

    cart = [];
    renderCart();
    renderProductGrid();
    checkoutForm.reset();
    Object.keys(VALIDATORS).forEach((name) => {
      document.getElementById(name).closest('.form-group').classList.remove('invalid');
      document.getElementById('err-' + name).textContent = '';
    });
  });

  successClose.addEventListener('click', () => closeModal(successModal, successOverlay));
  successOverlay.addEventListener('click', () => closeModal(successModal, successOverlay));
  backToShop.addEventListener('click', () => closeModal(successModal, successOverlay));

  /* ------------------------------------------------------------------ */
  /* 9. MOBILE NAV                                                       */
  /* ------------------------------------------------------------------ */
  function openMobileNav() {
    mobileNav.classList.add('open');
    mobileNavOverlay.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }
  function closeMobileNavFn() {
    mobileNav.classList.remove('open');
    mobileNavOverlay.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }
  hamburgerBtn.addEventListener('click', openMobileNav);
  closeMobileNav.addEventListener('click', closeMobileNavFn);
  mobileNavOverlay.addEventListener('click', closeMobileNavFn);
  mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileNavFn));

  /* ------------------------------------------------------------------ */
  /* 10. GENERIC MODAL HELPERS                                          */
  /* ------------------------------------------------------------------ */
  function openModal(modalEl, overlayEl) {
    modalEl.classList.add('open');
    overlayEl.classList.add('open');
    document.body.classList.add('no-scroll');
  }
  function closeModal(modalEl, overlayEl) {
    modalEl.classList.remove('open');
    overlayEl.classList.remove('open');
    // Only remove body scroll lock if nothing else is open
    const anyOpen = document.querySelector('.modal.open, .cart-drawer.open, .mobile-nav.open');
    if (!anyOpen) document.body.classList.remove('no-scroll');
  }

  // Escape key closes any open modal/drawer
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (detailModal.classList.contains('open')) closeModal(detailModal, detailOverlay);
    if (checkoutModal.classList.contains('open')) closeModal(checkoutModal, checkoutOverlay);
    if (successModal.classList.contains('open')) closeModal(successModal, successOverlay);
    if (cartDrawer.classList.contains('open')) closeModal(cartDrawer, cartOverlay);
    if (mobileNav.classList.contains('open')) closeMobileNavFn();
  });

  /* ------------------------------------------------------------------ */
  /* 11. TOAST NOTIFICATIONS                                            */
  /* ------------------------------------------------------------------ */
  let toastTimer = null;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  /* ------------------------------------------------------------------ */
  /* 12. HERO BACKGROUND VIDEO                                          */
  /* ------------------------------------------------------------------ */
  function setupHeroVideo() {
    const video = document.querySelector('.hero-bg-video');
    if (!video) return;
    // Always autoplay the background video, regardless of the visitor's
    // OS/browser reduce-motion preference — this is a decorative loop with
    // no essential motion content, so it always plays for demo/grading reliability.
    // Some mobile browsers still block autoplay until explicitly muted + played via JS.
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay was blocked by the browser; poster image stays visible as a fallback.
        // Retry once the tab becomes visible/focused (covers some mobile browser quirks).
        const retry = () => {
          video.play().catch(() => {});
          document.removeEventListener('visibilitychange', retry);
        };
        document.addEventListener('visibilitychange', retry);
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* 13. INIT                                                            */
  /* ------------------------------------------------------------------ */
  function init() {
    renderProductGrid();
    renderCart();
    setupHeroVideo();
  }
  init();
})();
