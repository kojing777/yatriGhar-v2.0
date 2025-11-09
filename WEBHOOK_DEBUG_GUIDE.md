# Stripe Webhook Debugging Guide

## Issues Found and Fixed

### 1. ✅ Frontend Not Refreshing After Payment
**Problem:** After returning from Stripe checkout, the frontend wasn't refreshing booking data.

**Fix:**
- Updated `Loader.jsx` to reload the page after 5 seconds
- Added window focus listener in `MyBookings.jsx` to refresh when user returns
- Added URL parameter check for payment success

### 2. ✅ Webhook Raw Body Handling
**Problem:** Raw body handling might not work correctly in all scenarios.

**Fix:**
- Improved raw body handling in `stripeWebhook.js`
- Added better logging to see what type of body is received
- Added middleware logging in `server.js` to track webhook requests

### 3. ✅ Missing Booking Refresh Logic
**Problem:** Bookings weren't being refreshed after payment completion.

**Fix:**
- Added automatic refresh on window focus
- Added URL parameter detection for payment success
- Reduced loader wait time from 9s to 5s

## Critical Checks Needed

### 1. Webhook Endpoint Accessibility
**ISSUE:** If your backend is running on `localhost` or a local IP, Stripe CANNOT reach it!

**Solution:**
- Use a tunneling service like **ngrok** or **localtunnel**
- Or deploy your backend to a publicly accessible server (Heroku, Railway, etc.)

**To test with ngrok:**
```bash
# Install ngrok
npm install -g ngrok

# Start your backend server
cd Backend
npm start

# In another terminal, start ngrok
ngrok http 4444

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Add this to Stripe Dashboard → Webhooks → Add endpoint
# URL: https://abc123.ngrok.io/api/stripe/webhook
```

### 2. Webhook Secret Configuration
**Check:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. Click "Reveal" next to "Signing secret"
4. Copy the secret (starts with `whsec_`)
5. Make sure it's in your `.env` file as `STRIPE_WEBHOOK_SECRET`

### 3. Webhook Events Configuration
**In Stripe Dashboard, make sure these events are selected:**
- `checkout.session.completed`
- `payment_intent.succeeded`

### 4. Database Connection
**Verify:**
- MongoDB is connected and accessible
- The booking with ID `69109200e8befdb423827955` exists in your database
- Check server logs for database connection errors

### 5. Environment Variables
**Required in `.env` file:**
```env
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
MONGODB_URI=mongodb://...
FRONTEND_URL=http://localhost:5173 (or your production URL)
```

## Testing Steps

### Step 1: Check Webhook Endpoint is Accessible
```bash
# Test the webhook endpoint
curl http://localhost:4444/api/stripe/webhook/test

# Should return:
# {
#   "status": "ok",
#   "message": "Webhook endpoint is accessible",
#   "hasSecret": true,
#   "hasKey": true
# }
```

### Step 2: Check Server Logs
When a webhook is received, you should see:
```
🔔 Webhook received at: 2025-01-XX...
📦 Received webhook event: payment_intent.succeeded (ID: evt_...)
✅ payment_intent.succeeded - PaymentIntent ID: pi_...
   - Metadata: { bookingId: '69109200e8befdb423827955' }
   - Processing booking update for bookingId: 69109200e8befdb423827955
   - Found existing booking: 69109200e8befdb423827955
✅ Booking 69109200e8befdb423827955 successfully marked as paid
```

### Step 3: Verify Booking Exists
```javascript
// In MongoDB shell or Compass
db.bookings.findOne({ _id: ObjectId("69109200e8befdb423827955") })
```

### Step 4: Test Payment Flow
1. Create a booking
2. Click "Pay Now"
3. Complete payment in Stripe checkout
4. Wait 5 seconds on loader page
5. Check if booking shows as "Paid" in My Bookings

## Common Issues and Solutions

### Issue: "Webhook signature verification failed"
**Cause:** Wrong webhook secret or webhook not from Stripe
**Solution:** 
- Verify `STRIPE_WEBHOOK_SECRET` matches the one in Stripe Dashboard
- Make sure you're using the correct secret for test/live mode

### Issue: "Booking not found in database"
**Cause:** Booking ID doesn't exist or was deleted
**Solution:**
- Check if booking exists in database
- Verify booking ID format matches (should be MongoDB ObjectId)

### Issue: "Webhook not received"
**Cause:** Backend not publicly accessible
**Solution:**
- Use ngrok or deploy backend
- Verify webhook URL in Stripe Dashboard is correct
- Check firewall/network settings

### Issue: "Frontend not showing paid status"
**Cause:** Frontend not refreshing after payment
**Solution:**
- Check browser console for errors
- Verify bookings are being fetched after payment
- Check if `isPaid` field is being updated in database

## Manual Webhook Test

You can manually trigger a webhook test from Stripe Dashboard:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. Click "Send test webhook"
4. Select `payment_intent.succeeded`
5. Check your server logs to see if it's received

## Next Steps

1. **Deploy backend** to a publicly accessible server OR use ngrok
2. **Configure webhook URL** in Stripe Dashboard
3. **Test payment flow** end-to-end
4. **Monitor server logs** for webhook events
5. **Verify bookings** are being updated in database

## Debugging Commands

```bash
# Check if server is running
curl http://localhost:4444/

# Test webhook endpoint
curl http://localhost:4444/api/stripe/webhook/test

# Check environment variables (in Backend directory)
node -e "require('dotenv').config(); console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'SET' : 'NOT SET'); console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? 'SET' : 'NOT SET');"
```

## Contact Points

- Check Stripe Dashboard → Webhooks → Your endpoint → Recent events
- Check server logs for webhook receipt
- Check database for booking updates
- Check browser console for frontend errors

