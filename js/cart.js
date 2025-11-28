// Shopping Cart Module
const Cart = {
    items: [],
    
    init() {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('jewelryCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
        this.updateUI();
    },
    
    addItem(product) {
        // Check if item already exists
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateUI();
        this.showNotification(`${product.name} added to cart!`);
    },
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateUI();
    },
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateUI();
            }
        }
    },
    
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },
    
    clear() {
        this.items = [];
        this.saveCart();
        this.updateUI();
    },
    
    saveCart() {
        localStorage.setItem('jewelryCart', JSON.stringify(this.items));
    },
    
    updateUI() {
        // Update cart count in header
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = this.getItemCount();
        }
        
        // Update cart modal contents
        this.renderCartItems();
        
        // Update totals
        const cartTotalEl = document.getElementById('cart-total-amount');
        const checkoutTotalEl = document.getElementById('checkout-total');
        const total = this.formatPrice(this.getTotal());
        
        if (cartTotalEl) {
            cartTotalEl.textContent = total;
        }
        if (checkoutTotalEl) {
            checkoutTotalEl.textContent = total;
        }
        
        // Enable/disable checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.items.length === 0;
        }
    },
    
    renderCartItems() {
        const cartItemsEl = document.getElementById('cart-items');
        if (!cartItemsEl) return;
        
        if (this.items.length === 0) {
            cartItemsEl.innerHTML = '<div class="cart-empty"><p>Your cart is empty</p></div>';
            return;
        }
        
        cartItemsEl.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${this.escapeHtml(item.name)}" onerror="this.src='images/placeholder.svg'">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${this.escapeHtml(item.name)}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price)} × ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" onclick="Cart.removeItem(${item.id})" aria-label="Remove item">&times;</button>
            </div>
        `).join('');
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
    },
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #8b7355;
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        // Add animation styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
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
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});
