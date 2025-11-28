// Stripe Integration Module
// 
// SETUP INSTRUCTIONS:
// 1. Create a Stripe account at https://stripe.com
// 2. Get your publishable key from Dashboard > Developers > API keys
// 3. Replace 'pk_test_your_publishable_key_here' below with your actual key
// 4. For production, implement a server-side component to handle PaymentIntents
//
// Note: The publishable key can be public, but never expose your secret key

const StripeIntegration = {
    // Replace with your Stripe publishable key (starts with pk_test_ or pk_live_)
    publishableKey: 'pk_test_your_publishable_key_here',
    stripe: null,
    card: null,
    
    init() {
        // Check if Stripe is available
        if (typeof Stripe === 'undefined') {
            console.warn('Stripe.js not loaded. Payment functionality will be limited.');
            return;
        }
        
        // Initialize Stripe with your publishable key
        try {
            this.stripe = Stripe(this.publishableKey);
            this.createCardElement();
        } catch (error) {
            console.error('Error initializing Stripe:', error);
        }
    },
    
    createCardElement() {
        if (!this.stripe) return;
        
        const elements = this.stripe.elements();
        
        // Custom styling for the card element
        const style = {
            base: {
                color: '#333',
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#666'
                }
            },
            invalid: {
                color: '#e74c3c',
                iconColor: '#e74c3c'
            }
        };
        
        // Create card element
        this.card = elements.create('card', { style: style });
        
        // Mount card element when checkout modal is opened
        const cardElement = document.getElementById('card-element');
        if (cardElement && !cardElement.hasChildNodes()) {
            this.card.mount('#card-element');
            
            // Handle card errors
            this.card.on('change', (event) => {
                const displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });
        }
    },
    
    mountCardElement() {
        if (!this.card) {
            this.createCardElement();
        } else {
            const cardElement = document.getElementById('card-element');
            if (cardElement && !cardElement.hasChildNodes()) {
                this.card.mount('#card-element');
            }
        }
    },
    
    async processPayment(customerInfo, cartItems, total) {
        if (!this.stripe || !this.card) {
            // Simulate payment for demo purposes
            return this.simulatePayment(customerInfo, cartItems, total);
        }
        
        const submitButton = document.getElementById('submit-payment');
        const buttonText = document.getElementById('button-text');
        const spinner = document.getElementById('spinner');
        
        // Disable button and show spinner
        submitButton.disabled = true;
        buttonText.classList.add('hidden');
        spinner.classList.remove('hidden');
        
        try {
            // In a real implementation, you would:
            // 1. Send cart data to your server
            // 2. Create a PaymentIntent on your server using Stripe's API
            // 3. Return the client_secret to the frontend
            // 4. Use the client_secret to confirm the payment
            
            // For this demo, we'll simulate the payment process
            // In production, replace this with actual Stripe payment flow:
            
            /*
            // Create payment method
            const { error, paymentMethod } = await this.stripe.createPaymentMethod({
                type: 'card',
                card: this.card,
                billing_details: {
                    name: customerInfo.name,
                    email: customerInfo.email
                }
            });
            
            if (error) {
                throw new Error(error.message);
            }
            
            // Send to your server to complete payment
            const response = await fetch('/api/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    amount: Math.round(total * 100), // Convert to cents
                    customerEmail: customerInfo.email,
                    items: cartItems
                })
            });
            
            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            // Payment successful
            return { success: true, transactionId: result.transactionId };
            */
            
            // Simulate payment for demo
            return await this.simulatePayment(customerInfo, cartItems, total);
            
        } catch (error) {
            const displayError = document.getElementById('card-errors');
            displayError.textContent = error.message;
            return { success: false, error: error.message };
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            buttonText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    },
    
    // Simulate payment for demo purposes
    async simulatePayment(customerInfo, cartItems, total) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                // Simulate successful payment with a unique transaction ID
                // Use crypto.randomUUID() if available, fallback to timestamp-based ID
                const transactionId = 'txn_' + (
                    typeof crypto !== 'undefined' && crypto.randomUUID 
                        ? crypto.randomUUID() 
                        : Date.now() + '_' + Math.random().toString(36).substring(2, 11)
                );
                
                console.log('Demo Payment Processed:', {
                    transactionId,
                    customer: customerInfo,
                    items: cartItems,
                    total: total
                });
                
                resolve({
                    success: true,
                    transactionId: transactionId
                });
            }, 2000);
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    StripeIntegration.init();
});
