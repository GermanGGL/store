// WhatsApp configuration - Change this number to your WhatsApp number
const WHATSAPP_NUMBER = '+5212221311486'; // Replace with your actual WhatsApp number

// Sample product data
const products = [
    {
        id: 1,
        name: "Cojín de Lujo Terciopelo",
        price: 45.99,
        description: "Tela suave de terciopelo con elegantes acentos dorados",
        category: "decorative",
        image: "./images/cojin1.jpeg"
    },
    {
        id: 2,
        name: "Exterior Resistente al Clima",
        price: 32.99,
        description: "Cojín duradero perfecto para patios y jardines",
        category: "outdoor",
        image: "./images/cojin2.jpeg"
    },
    {
        id: 3,
        name: "Cojín Bohemio Acogedor",
        price: 28.99,
        description: "Cojín estilo bohemio con borlas y patrones",
        category: "throw",
        image: "./images/cojin3.jpeg"
    }/* ,
    {
        id: 4,
        name: "Modern Geometric Print",
        price: 38.99,
        description: "Contemporary design with geometric patterns",
        category: "decorative",
        image: "https://picsum.photos/seed/geometric-cushion/300/250.jpg"
    },
    {
        id: 5,
        name: "Patio Lounge Cushion",
        price: 52.99,
        description: "Extra thick cushion for outdoor seating",
        category: "outdoor",
        image: "https://picsum.photos/seed/lounge-cushion/300/250.jpg"
    },
    {
        id: 6,
        name: "Soft Fleece Throw",
        price: 24.99,
        description: "Ultra-soft fleece material for ultimate comfort",
        category: "throw",
        image: "https://picsum.photos/seed/fleece-cushion/300/250.jpg"
    },
    {
        id: 7,
        name: "Silk Elegance Cushion",
        price: 65.99,
        description: "Premium silk fabric with embroidery",
        category: "decorative",
        image: "https://picsum.photos/seed/silk-cushion/300/250.jpg"
    },
    {
        id: 8,
        name: "Garden Bench Cushion",
        price: 42.99,
        description: "Water-resistant cushion for garden benches",
        category: "outdoor",
        image: "https://picsum.photos/seed/bench-cushion/300/250.jpg"
    },
    {
        id: 9,
        name: "Nordic Style Throw",
        price: 31.99,
        description: "Minimalist Scandinavian design",
        category: "throw",
        image: "https://picsum.photos/seed/nordic-cushion/300/250.jpg"
    } */
];

// Shopping cart
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutWhatsappBtn = document.getElementById('checkout-whatsapp');
const filterButtons = document.querySelectorAll('.filter-btn');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const whatsappBtn = document.getElementById('whatsapp-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    setupEventListeners();
    updateCartCount();
    renderCart();
});

// Render products
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Agregar al Carrito
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
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
}

// Render cart items
function renderCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-description">${item.description}</p>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})">🗑️</button>
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
        background: #8B4513;
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