import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
import { stripeWebhook } from './controllers/stripeWebhook.js';
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
app.use(cors());

// Stripe webhook route - MUST be before express.json() middleware
// Stripe webhooks require raw body for signature verification
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Clerk webhooks route - MUST be before express.json() middleware
app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

// Parse JSON bodies for all other routes
app.use(express.json());

// Clerk middleware
app.use(clerkMiddleware());

app.get('/', (req, res) => 
  res.send('Backend connected successfully!')
);

app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/booking', bookingRouter);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
