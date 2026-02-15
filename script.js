// WhatsApp configuration - Change this number to your WhatsApp number
const WHATSAPP_NUMBER = '+5212217655080'; // Replace with your actual WhatsApp number

let products = productsData;

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartCount = document.getElementById('cart-count');
const cartText = document.getElementById('cart-text');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartSection = document.getElementById('cart');
const filterButtons = document.querySelectorAll('.filter-btn');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const whatsappBtn = document.getElementById('whatsapp-btn');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutWhatsappBtn = document.getElementById('checkout-whatsapp');

// Shopping cart
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    setupEventListeners();
    updateCartCount();
    renderCart();
    cartText.style.display = 'none';
});

// Render products
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const images = product.images || [product.image];
        const imageSlides = images.map((img, index) => 
            `<img src="${img}" alt="${product.name}" class="product-image-slide${index === 0 ? ' active' : ''}" data-index="${index}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async" width="400" height="300">`
        ).join('');
        
        const indicators = images.length > 1 ? images.map((_, index) => 
            `<span class="carousel-indicator" data-index="${index}"></span>`
        ).join('') : '';
        
        productCard.innerHTML = `
            <div class="product-image-carousel" data-product-id="${product.id}">
                <div class="carousel-slides">${imageSlides}</div>
                ${images.length > 1 ? `
                    <button class="carousel-nav carousel-prev">❮</button>
                    <button class="carousel-nav carousel-next">❯</button>
                    <div class="carousel-indicators">${indicators}</div>
                ` : ''}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price-row">
                    <div class="product-price">${product.price != null ? '$' + product.price.toFixed(2) : 'Consultar precio'}</div>
                    ${product.pack ? `<div class="product-pack">${product.pack}</div>` : ''}
                </div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Agregar al Carrito
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
        
        // Initialize carousel for this product
        if (images.length > 1) {
            initCarousel(productCard, images.length);
        }
    });
}

// Initialize carousel with auto-play and swipe
function initCarousel(card, totalSlides) {
    const carousel = card.querySelector('.product-image-carousel');
    const slides = carousel.querySelectorAll('.product-image-slide');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    let currentIndex = 0;
    let autoPlayInterval;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        slides[index].classList.add('active');
        if (indicators[index]) indicators[index].classList.add('active');
        currentIndex = index;
    }
    
    function nextSlide() {
        const next = (currentIndex + 1) % totalSlides;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Navigation buttons
    if (nextBtn) nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });
    
    // Indicator clicks
    indicators.forEach((ind, index) => {
        ind.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Initialize
    showSlide(0);
    startAutoPlay();
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterProducts(filter);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // WhatsApp button click handler
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            openWhatsApp();
        });
    }

    // Floating contact button
    const floatingContacts = document.querySelectorAll('.floating-contact');
    floatingContacts.forEach(floatingContact => {
        floatingContact.addEventListener('click', () => {
            openWhatsApp();
        });
    });

    // Clear cart button
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            updateCartCount();
            renderCart();
            showNotification('Carrito vaciado');
        });
    }

    // Checkout WhatsApp button
    if (checkoutWhatsappBtn) {
        checkoutWhatsappBtn.addEventListener('click', () => {
            openWhatsApp();
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Filter products
function filterProducts(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(product => product.category === category);
        renderProducts(filtered);
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        if (product.price == null) {
            showNotification('Precio no disponible');
            return;
        }
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCartCount();
        renderCart();
        showNotification(`${product.name} agregado al carrito!`);
    }
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartText.style.display = 'inline';
    } else {
        cartText.style.display = 'none';
    }
}

// Render cart items
function renderCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartTotal.textContent = '0.00';
        cartSection.classList.add('collapsed');
        return;
    }
    
    cartSection.classList.remove('collapsed');
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.images ? item.images[0] : item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-description">${item.description}</p>
                    <p class="cart-item-price">${item.price != null ? '$' + item.price.toFixed(2) : 'Consultar'}</p>
                </div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})"><img src="images/basura.ico" alt="Eliminar" width="24" height="24"></button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    updateCartTotal();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            renderCart();
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
    showNotification('Producto eliminado del carrito');
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Open WhatsApp with pre-filled message
function openWhatsApp() {
    let message = "¡Hola! Estoy interesado en tus cojines. Tengo algunas preguntas sobre tus productos.";
    
    // If cart has items, include cart details
    if (cart.length > 0) {
        const cartItems = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message = `¡Hola! Me gustaría ordenar los siguientes artículos:\n${cartItems}\n\nTotal: $${totalPrice.toFixed(2)}\n\n¿Podrías ayudarme con el proceso de compra?`;
    }
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #8721a8;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Scroll reveal animation
window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.product-card, .feature, .contact-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Add initial styles for scroll reveal
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .product-card, .feature, .contact-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
    </style>
`);
