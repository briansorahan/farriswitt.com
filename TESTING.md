# Testing Google Pay and Apple Pay Locally

## Quick Setup Guide

### Prerequisites
- A valid Stripe test publishable key (starts with `pk_test_`)
- HTTPS connection (required for digital wallets)
- Appropriate browser/device for each wallet type

### Step 1: Configure Your Stripe Test Key

1. Sign up at [https://stripe.com](https://stripe.com) if you haven't already
2. Go to Dashboard → Developers → API keys
3. Copy your **Publishable key** (test mode)
4. Edit `js/stripe-integration.js` and replace:
   ```javascript
   publishableKey: 'pk_test_your_publishable_key_here',
   ```
   With your actual key:
   ```javascript
   publishableKey: 'pk_test_51ABC...XYZ',
   ```

### Step 2: Run Local HTTPS Server

Digital wallets require HTTPS. Here are several methods:

#### Option A: Using Python + ngrok (Recommended)

**Terminal 1 - Start Python server:**
```bash
cd /path/to/farriswitt.com
python3 -m http.server 8000
```

**Terminal 2 - Create HTTPS tunnel:**
```bash
# Install ngrok: https://ngrok.com/download
ngrok http 8000
```

This gives you an HTTPS URL like: `https://abc123.ngrok.io`

#### Option B: Using Local SSL Certificate

**macOS/Linux:**
```bash
# Install mkcert
brew install mkcert  # macOS
# OR
sudo apt install mkcert  # Linux

# Create local CA
mkcert -install

# Generate certificates
cd /path/to/farriswitt.com
mkcert localhost 127.0.0.1 ::1

# Start HTTPS server with Python
python3 -m http.server 8000 --bind localhost
```

Then use a tool like [local-ssl-proxy](https://www.npmjs.com/package/local-ssl-proxy):
```bash
npm install -g local-ssl-proxy
local-ssl-proxy --source 8443 --target 8000 --cert localhost+2.pem --key localhost+2-key.pem
```

Access at: `https://localhost:8443`

#### Option C: Using Node.js with HTTPS

Create `server.js`:
```javascript
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
app.use(express.static('.'));

// For development, you can use self-signed certs
const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};

https.createServer(options, app).listen(8443, () => {
  console.log('Server running at https://localhost:8443');
});
```

```bash
npm install express
node server.js
```

### Step 3: Testing Google Pay

**Requirements:**
- Chrome, Edge, or Chromium-based browser
- Saved payment method in Google account
- HTTPS connection

**Steps:**
1. Open Chrome/Edge browser
2. Navigate to your HTTPS URL
3. Make sure you're signed into Google
4. Add items to cart and go to checkout
5. You should see a black "Google Pay" button
6. Click it to test the flow

**To Add Test Cards to Google Pay:**
- Use Stripe test cards: https://stripe.com/docs/testing
- Example: `4242 4242 4242 4242` (Visa)
- Add via Google Pay settings or during checkout

### Step 4: Testing Apple Pay

**Requirements:**
- Safari browser on macOS (10.14.1+) or iOS (12.1+)
- Apple device with Touch ID or Face ID
- HTTPS connection
- Saved card in Apple Wallet

**Steps for macOS:**
1. Open Safari browser
2. Navigate to your HTTPS URL
3. Add items to cart and go to checkout
4. You should see a black "Apple Pay" button
5. Click it to test with Touch ID/password

**Steps for iOS:**
1. Open Safari on iPhone/iPad
2. Navigate to your HTTPS URL
3. Add items to cart and go to checkout
4. You should see "Apple Pay" button
5. Tap to test with Face ID/Touch ID

**Adding Test Cards to Apple Wallet:**
- On iPhone: Settings → Wallet & Apple Pay → Add Card
- Use Stripe test cards in Safari during testing
- Apple Pay test mode works automatically with Stripe test keys

### Step 5: Verify It's Working

When the checkout modal opens:

**✅ Digital Wallet Available:**
- You'll see the Google Pay or Apple Pay button at the top
- Below it: "Or pay with card" separator
- Traditional card input form below that

**❌ Digital Wallet Not Available:**
- No wallet button appears
- No separator line
- Only the traditional card form shows

**Console Logs:**
Open browser DevTools (F12) → Console tab:
- Should see: "Digital wallet available: {applePay: true}" or similar
- Any errors will appear here

### Troubleshooting

**"Button doesn't appear":**
- Verify you're using HTTPS (not HTTP)
- Check browser console for errors
- Ensure Stripe key is valid and starts with `pk_test_`
- For Apple Pay: Only works in Safari
- For Google Pay: Only works in Chrome/Edge/Chromium

**"Invalid Stripe key":**
- Make sure you copied the full key
- Verify it starts with `pk_test_` (test mode)
- Check for extra spaces or quotes

**"Payment fails":**
- This is expected! The current implementation uses simulated payments
- You'll still see the payment flow and UI
- For real payments, you need a backend server (see README.md)

**Self-signed certificate warnings:**
- In development, it's safe to proceed past these warnings
- Click "Advanced" → "Proceed to localhost"

### Testing Different Scenarios

1. **With Digital Wallet**: Use Chrome/Safari with saved cards
2. **Without Digital Wallet**: Use Firefox or private browsing without saved cards
3. **Mobile**: Test on iPhone with Safari or Android with Chrome
4. **Different Cards**: Try various Stripe test cards

### Stripe Test Cards

These work with both digital wallets and card input:

| Card Number | Brand | Result |
|-------------|-------|--------|
| 4242 4242 4242 4242 | Visa | Success |
| 5555 5555 5555 4444 | Mastercard | Success |
| 3782 822463 10005 | Amex | Success |
| 4000 0000 0000 0002 | Visa | Declined |

- Use any future expiration date
- Use any 3-digit CVC (4 digits for Amex)
- Use any valid US ZIP code

## Next Steps

After local testing works:
1. Push changes to GitHub
2. GitHub Pages will deploy automatically with HTTPS
3. For custom domains, verify domain in Stripe Dashboard for Apple Pay
4. Implement backend server for production payment processing

## Resources

- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Payment Request Button API](https://stripe.com/docs/stripe-js/elements/payment-request-button)
- [Apple Pay Web Setup](https://stripe.com/docs/apple-pay)
- [Google Pay Web Setup](https://stripe.com/docs/google-pay)
- [ngrok Documentation](https://ngrok.com/docs)
