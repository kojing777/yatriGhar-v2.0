import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
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
// Restrict CORS in dev to the frontend origin and allow credentials if needed.
// Set CORS_ORIGIN in Render to your production frontend origin.
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
// Preflight handler for complex requests
app.options('*', cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Clerk middleware
app.use(express.json());
app.use(clerkMiddleware());

// Clerk webhooks route
app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

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
