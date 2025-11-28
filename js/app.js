// Main Application JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    App.init();
});

const App = {
    currentFilter: 'all',
    selectedProduct: null,
    
    init() {
        this.renderGallery();
        this.bindEvents();
    },
    
    renderGallery(filter = 'all') {
        const galleryEl = document.getElementById('jewelry-gallery');
        if (!galleryEl) return;
        
        let items = jewelryData;
        
        if (filter !== 'all') {
            items = jewelryData.filter(item => item.category === filter);
        }
        
        galleryEl.innerHTML = items.map(item => `
            <article class="jewelry-card" data-category="${item.category}" data-id="${item.id}">
                <div class="jewelry-card-image">
                    <img src="${item.image}" alt="${this.escapeHtml(item.name)}" loading="lazy" onerror="this.src='images/placeholder.jpg'">
                    <div class="jewelry-card-overlay">
                        <button class="quick-view-btn" onclick="App.showProductModal(${item.id})">Quick View</button>
                    </div>
                </div>
                <div class="jewelry-card-content">
                    <span class="category">${this.escapeHtml(item.category)}</span>
                    <h3>${this.escapeHtml(item.name)}</h3>
                    <p class="price">${this.formatPrice(item.price)}</p>
                    <button class="add-to-cart-btn" onclick="App.addToCart(${item.id})">Add to Cart</button>
                </div>
            </article>
        `).join('');
    },
    
    bindEvents() {
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
        
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderGallery(this.currentFilter);
            });
        });
        
        // Cart modal
        const cartLink = document.querySelector('.cart-link');
        const cartModal = document.getElementById('cart-modal');
        
        if (cartLink && cartModal) {
            cartLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('cart-modal');
            });
        }
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.closeModal('cart-modal');
                this.openModal('checkout-modal');
                StripeIntegration.mountCardElement();
            });
        }
        
        // Checkout form
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processCheckout();
            });
        }
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    this.closeModal(modal.id);
                });
            }
        });
    },
    
    addToCart(productId) {
        const product = jewelryData.find(item => item.id === productId);
        if (product) {
            Cart.addItem(product);
        }
    },
    
    showProductModal(productId) {
        const product = jewelryData.find(item => item.id === productId);
        if (!product) return;
        
        this.selectedProduct = product;
        
        // Update modal content
        document.getElementById('modal-product-image').src = product.image;
        document.getElementById('modal-product-image').alt = product.name;
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-price').textContent = this.formatPrice(product.price);
        document.getElementById('modal-product-description').textContent = product.description;
        
        // Set up add to cart button
        const addToCartBtn = document.getElementById('modal-add-to-cart');
        addToCartBtn.onclick = () => {
            this.addToCart(product.id);
            this.closeModal('product-modal');
        };
        
        this.openModal('product-modal');
    },
    
    async processCheckout() {
        const email = document.getElementById('customer-email').value;
        const name = document.getElementById('customer-name').value;
        
        if (!email || !name) {
            const errorEl = document.getElementById('card-errors');
            errorEl.textContent = 'Please fill in all required fields.';
            return;
        }
        
        const customerInfo = { email, name };
        const result = await StripeIntegration.processPayment(
            customerInfo,
            Cart.items,
            Cart.getTotal()
        );
        
        if (result.success) {
            // Show success message
            document.getElementById('checkout-form-container').classList.add('hidden');
            document.getElementById('checkout-success').classList.remove('hidden');
            
            // Clear cart
            Cart.clear();
            
            // Reset form
            document.getElementById('checkout-form').reset();
        }
    },
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset checkout modal state
            if (modalId === 'checkout-modal') {
                document.getElementById('checkout-form-container').classList.remove('hidden');
                document.getElementById('checkout-success').classList.add('hidden');
            }
        }
    },
    
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Global function for closing checkout modal (called from success message)
function closeCheckoutModal() {
    App.closeModal('checkout-modal');
}
