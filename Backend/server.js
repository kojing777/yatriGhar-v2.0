import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
import { stripeWebhook } from './controllers/stripeWebhook.js';
import { sendEmail } from './configs/brevoMailer.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/ClerkWebHooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoute.js';
import bookingRouter from './routes/bookingRoute.js';
 
// connect to MongoDB
connectDB();

// connect to Cloudinary
connectCloudinary();

const app = express();

// Configure CORS - but webhook route needs special handling
app.use(cors({
    origin: true, // Allow all origins for webhooks
    credentials: true
}));

// Stripe webhook route - MUST be before express.json() middleware
// Stripe webhooks require raw body for signature verification
// Important: Use express.raw() to get the raw body as a Buffer
app.post('/api/stripe/webhook', 
    express.raw({ type: 'application/json' }), 
    (req, res, next) => {
        // Log webhook receipt for debugging
        console.log('🔔 Webhook received at:', new Date().toISOString());
        console.log('   - Method:', req.method);
        console.log('   - URL:', req.url);
        console.log('   - Headers:', {
            'content-type': req.headers['content-type'],
            'stripe-signature': req.headers['stripe-signature'] ? 'present' : 'missing'
        });
        console.log('   - Body type:', Buffer.isBuffer(req.body) ? 'Buffer' : typeof req.body);
        console.log('   - Body length:', req.body ? req.body.length : 0);
        next();
    },
    stripeWebhook
);

// Clerk webhooks route - MUST be before express.json() middleware
app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

// Parse JSON bodies for all other routes
app.use(express.json());

// Clerk middleware
app.use(clerkMiddleware());

app.get('/', (req, res) => 
  res.send('Backend connected successfully!')
);

// Test route to send an email via Brevo API helper
app.post('/send-test-email', async (req, res) => {
  try {
    // Allow overriding via request body for quick testing
    const { to = 'testuser@example.com', subject, html, text } = req.body || {};

    await sendEmail({
      to,
      subject: subject || '🎉 Test Email from Backend via Brevo API',
      html: html || '<h1>Hello from Brevo API!</h1><p>This is a test email.</p>',
      text: text || 'Hello from Brevo API!'
    });

    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('send-test-email error:', error?.response?.data || error?.message || error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error?.response?.data || error?.message || String(error)
    });
  }
});

// Health check endpoint for webhook testing
app.get('/api/stripe/webhook/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString(),
    hasSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    hasKey: !!process.env.STRIPE_SECRET_KEY
  });
});

app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/booking', bookingRouter);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
