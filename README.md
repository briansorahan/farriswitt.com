# Farris Witt Jewelry

A beautiful GitHub Pages site featuring a handcrafted jewelry gallery with Stripe Connect integration for online payments.

## Features

- **Responsive Jewelry Gallery**: Browse through a curated collection of handcrafted jewelry including necklaces, earrings, bracelets, and rings
- **Category Filtering**: Easily filter jewelry by category (All, Necklaces, Earrings, Bracelets, Rings)
- **Quick View**: View product details in an elegant modal popup
- **Shopping Cart**: Add items to cart with real-time updates
- **Stripe Connect Integration**: Secure payment processing via Stripe
- **Mobile-Friendly**: Fully responsive design that works on all devices

## Live Site

Visit the live site at: [https://briansorahan.github.io/farriswitt.com](https://briansorahan.github.io/farriswitt.com)

## Setting Up Stripe Connect

To enable payments on your site, you'll need to set up Stripe Connect:

1. Create a Stripe account at [https://stripe.com](https://stripe.com)
2. Get your publishable key from the Stripe Dashboard
3. Update the `publishableKey` in `js/stripe-integration.js` with your key
4. For production, you'll need a backend server to:
   - Create Payment Intents
   - Handle webhooks for payment confirmation
   - Process orders securely

### Stripe Connect for Marketplace

If you're operating as a marketplace (collecting payments on behalf of sellers):

1. Set up Stripe Connect in your Stripe Dashboard
2. Create connected accounts for each seller
3. Update the payment flow to include the connected account ID
4. Implement proper fee splitting as needed

## Local Development

This is a static HTML/CSS/JavaScript site. To test the site locally, you'll need to run an HTTP server.

### Using Python (Recommended)

If you have Python installed, you can start a local server with:

**Python 3:**
```bash
cd /path/to/farriswitt.com
python3 -m http.server 8000
```

**Python 2:**
```bash
cd /path/to/farriswitt.com
python -m SimpleHTTPServer 8000
```

Then open your browser and navigate to: `http://localhost:8000`

### Using Node.js

If you have Node.js installed, you can use `http-server`:

```bash
# Install http-server globally (one-time setup)
npm install -g http-server

# Run the server
cd /path/to/farriswitt.com
http-server -p 8000
```

Then open your browser and navigate to: `http://localhost:8000`

### Using PHP

If you have PHP installed:

```bash
cd /path/to/farriswitt.com
php -S localhost:8000
```

Then open your browser and navigate to: `http://localhost:8000`

### Opening Directly in Browser

For simple testing, you can also open `index.html` directly in your web browser. However, some features (like Stripe integration) may require an HTTP server to work properly due to browser security restrictions.

## Project Structure

```
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── jewelry-data.js     # Product data
│   ├── cart.js             # Shopping cart functionality
│   ├── stripe-integration.js # Stripe payment integration
│   └── app.js              # Main application logic
├── images/
│   └── jewelry/            # Product images
├── _config.yml             # GitHub Pages config
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment workflow
```

## Customization

### Adding New Products

Edit `js/jewelry-data.js` to add new jewelry items:

```javascript
{
    id: 13,
    name: "Your New Item",
    category: "necklaces", // necklaces, earrings, bracelets, or rings
    price: 199.00,
    image: "images/jewelry/your-image.jpg",
    description: "Description of your jewelry item."
}
```

### Updating Styles

All styles are in `css/styles.css`. Key CSS variables can be modified in the `:root` selector:

```css
:root {
    --primary-color: #8b7355;    /* Main brand color */
    --secondary-color: #d4af37;  /* Accent color (gold) */
    --text-color: #333;          /* Main text color */
    --bg-color: #faf8f5;         /* Background color */
}
```

## License

© 2024 Farris Witt Jewelry. All rights reserved.
