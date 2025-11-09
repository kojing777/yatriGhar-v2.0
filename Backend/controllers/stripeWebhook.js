import Stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhook = async (request, response) => {
    // Initialize Stripe with your secret key
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('STRIPE_SECRET_KEY is not set in environment variables');
        return response.status(500).send('Webhook configuration error');
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
        return response.status(500).send('Webhook configuration error');
    }

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers['stripe-signature'];
    if (!sig) {
        console.error('⚠️  Stripe signature header is missing');
        return response.status(400).send('Webhook Error: Missing stripe-signature header');
    }

    let event;

    // Ensure we use the raw request body bytes for signature verification.
    // express.raw({ type: 'application/json' }) should give us a Buffer
    // But if it's not a Buffer, we need to handle it properly
    let rawBody;
    if (Buffer.isBuffer(request.body)) {
        rawBody = request.body;
    } else if (typeof request.body === 'string') {
        rawBody = Buffer.from(request.body, 'utf8');
    } else {
        // This shouldn't happen with express.raw, but handle it anyway
        console.error('⚠️ Request body is not a Buffer or string:', typeof request.body);
        rawBody = Buffer.from(JSON.stringify(request.body), 'utf8');
    }

    try {
        event = stripeInstance.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`⚠️  Webhook signature verification failed.`, err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        console.log(`📦 Received webhook event: ${event.type} (ID: ${event.id})`);
        
        // Prefer handling the Checkout Session completion which contains metadata directly
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const bookingId = session?.metadata?.bookingId;

            console.log(`✅ checkout.session.completed - Session ID: ${session.id}, Booking ID: ${bookingId}`);

            if (!bookingId) {
                console.warn('⚠️ checkout.session.completed received but no bookingId in metadata', { 
                    sessionId: session.id, 
                    metadata: session.metadata 
                });
                return response.status(200).json({ received: true });
            }
            
            try {
                // Trim any whitespace from bookingId
                const trimmedBookingId = bookingId.trim();
                console.log(`   - Trimmed bookingId: ${trimmedBookingId}`);
                
                // Validate bookingId format (MongoDB ObjectId is 24 hex characters)
                if (!/^[0-9a-fA-F]{24}$/.test(trimmedBookingId)) {
                    console.error(`❌ Invalid booking ID format: ${trimmedBookingId}`);
                    console.error(`   - Booking ID must be a valid MongoDB ObjectId (24 hex characters)`);
                    return response.status(200).json({ received: true });
                }
                
                // Try to find the booking first to verify it exists
                const existingBooking = await Booking.findById(trimmedBookingId);
                if (!existingBooking) {
                    console.error(`❌ Booking ${trimmedBookingId} not found in database`);
                    console.error(`   - Session ID: ${session.id}`);
                    console.error(`   - Amount paid: ${session.amount_total ? session.amount_total / 100 : 'N/A'} ${session.currency || 'N/A'}`);
                    
                    // List a few recent bookings for debugging
                    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5).select('_id createdAt totalPrice');
                    console.error(`   - Recent booking IDs in database:`, recentBookings.map(b => ({
                        id: b._id.toString(),
                        createdAt: b.createdAt,
                        totalPrice: b.totalPrice
                    })));
                    
                    // Try to find booking by matching amount and recent date (within last hour)
                    if (session.amount_total) {
                        const amountInDollars = session.amount_total / 100;
                        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                        const matchingBooking = await Booking.findOne({
                            totalPrice: amountInDollars,
                            createdAt: { $gte: oneHourAgo },
                            isPaid: false
                        });
                        
                        if (matchingBooking) {
                            console.log(`   - Found potential matching booking by amount: ${matchingBooking._id}`);
                            console.log(`   - Updating this booking instead...`);
                            const updatedBooking = await Booking.findByIdAndUpdate(
                                matchingBooking._id,
                                { isPaid: true, paymentStatus: 'stripe' },
                                { new: true, runValidators: true }
                            );
                            if (updatedBooking) {
                                console.log(`✅ Booking ${matchingBooking._id} successfully marked as paid (matched by amount)`);
                                return response.status(200).json({ received: true });
                            }
                        }
                    }
                    
                    return response.status(200).json({ received: true });
                }
                
                console.log(`   - Found existing booking: ${existingBooking._id}`);
                
                // Update the booking
                const booking = await Booking.findByIdAndUpdate(
                    trimmedBookingId, 
                    { isPaid: true, paymentStatus: 'stripe' },
                    { new: true, runValidators: true }
                );
                
                if (!booking) {
                    console.error(`❌ Failed to update booking ${trimmedBookingId}`);
                    return response.status(200).json({ received: true });
                }
                
                console.log(`✅ Booking ${trimmedBookingId} successfully marked as paid (checkout.session.completed)`);
                console.log(`   - isPaid: ${booking.isPaid}`);
                console.log(`   - paymentStatus: ${booking.paymentStatus}`);
            } catch (dbError) {
                console.error(`❌ Database error updating booking ${bookingId}:`, dbError.message);
                console.error(`   - Error name:`, dbError.name);
                if (dbError.name === 'ValidationError') {
                    console.error(`   - Validation errors:`, dbError.errors);
                }
                throw dbError;
            }

        } else if (event.type === 'payment_intent.succeeded') {
            // Handle payment_intent.succeeded - check metadata directly first
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
            
            console.log(`✅ payment_intent.succeeded - PaymentIntent ID: ${paymentIntentId}`);
            console.log(`   - Amount: ${paymentIntent.amount / 100} ${paymentIntent.currency}`);
            console.log(`   - Status: ${paymentIntent.status}`);
            console.log(`   - Metadata:`, paymentIntent.metadata);

            // First, try to get bookingId directly from paymentIntent metadata (most reliable)
            let bookingId = paymentIntent?.metadata?.bookingId;

            // If not found in paymentIntent, try to get it from the checkout session
            if (!bookingId) {
                console.log(`   - BookingId not in paymentIntent metadata, looking up checkout session...`);
                try {
                    const sessions = await stripeInstance.checkout.sessions.list({
                        payment_intent: paymentIntentId,
                        limit: 1,
                    });

                    const session = sessions?.data?.[0];
                    if (session) {
                        bookingId = session?.metadata?.bookingId;
                        console.log(`   - Found session ${session.id}, bookingId: ${bookingId}`);
                    } else {
                        console.warn(`   - No checkout session found for payment_intent ${paymentIntentId}`);
                    }
                } catch (sessionError) {
                    console.error(`   - Error looking up session:`, sessionError.message);
                }
            }

            if (!bookingId) {
                console.warn('⚠️ payment_intent.succeeded received but bookingId not found', { 
                    paymentIntentId, 
                    paymentIntentMetadata: paymentIntent?.metadata 
                });
                return response.status(200).json({ received: true });
            }

            console.log(`   - Processing booking update for bookingId: ${bookingId} (type: ${typeof bookingId})`);
            
            try {
                // Trim any whitespace from bookingId
                const trimmedBookingId = bookingId.trim();
                console.log(`   - Trimmed bookingId: ${trimmedBookingId}`);
                
                // Validate bookingId format (MongoDB ObjectId is 24 hex characters)
                if (!/^[0-9a-fA-F]{24}$/.test(trimmedBookingId)) {
                    console.error(`❌ Invalid booking ID format: ${trimmedBookingId}`);
                    console.error(`   - Booking ID must be a valid MongoDB ObjectId (24 hex characters)`);
                    return response.status(200).json({ received: true });
                }
                
                // Try to find the booking first to verify it exists
                const existingBooking = await Booking.findById(trimmedBookingId);
                if (!existingBooking) {
                    console.error(`❌ Booking ${trimmedBookingId} not found in database`);
                    console.error(`   - Attempted to find booking with ID: ${trimmedBookingId}`);
                    console.error(`   - PaymentIntent ID: ${paymentIntentId}`);
                    console.error(`   - Amount paid: ${paymentIntent.amount / 100} ${paymentIntent.currency}`);
                    
                    // List a few recent bookings for debugging
                    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5).select('_id createdAt totalPrice');
                    console.error(`   - Recent booking IDs in database:`, recentBookings.map(b => ({
                        id: b._id.toString(),
                        createdAt: b.createdAt,
                        totalPrice: b.totalPrice
                    })));
                    
                    // Try to find booking by matching amount and recent date (within last hour)
                    const amountInDollars = paymentIntent.amount / 100;
                    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                    const matchingBooking = await Booking.findOne({
                        totalPrice: amountInDollars,
                        createdAt: { $gte: oneHourAgo },
                        isPaid: false
                    });
                    
                    if (matchingBooking) {
                        console.log(`   - Found potential matching booking by amount: ${matchingBooking._id}`);
                        console.log(`   - Updating this booking instead...`);
                        const updatedBooking = await Booking.findByIdAndUpdate(
                            matchingBooking._id,
                            { isPaid: true, paymentStatus: 'stripe' },
                            { new: true, runValidators: true }
                        );
                        if (updatedBooking) {
                            console.log(`✅ Booking ${matchingBooking._id} successfully marked as paid (matched by amount)`);
                            return response.status(200).json({ received: true });
                        }
                    }
                    
                    return response.status(200).json({ received: true });
                }
                
                console.log(`   - Found existing booking: ${existingBooking._id}`);
                console.log(`   - Current isPaid: ${existingBooking.isPaid}`);
                console.log(`   - Current paymentStatus: ${existingBooking.paymentStatus}`);
                
                // Update the booking
                const booking = await Booking.findByIdAndUpdate(
                    trimmedBookingId, 
                    { isPaid: true, paymentStatus: 'stripe' },
                    { new: true, runValidators: true }
                );
                
                if (!booking) {
                    console.error(`❌ Failed to update booking ${trimmedBookingId} - booking not found after update`);
                    return response.status(200).json({ received: true });
                }
                
                console.log(`✅ Booking ${trimmedBookingId} successfully marked as paid (payment_intent.succeeded)`);
                console.log(`   - isPaid: ${booking.isPaid}`);
                console.log(`   - paymentStatus: ${booking.paymentStatus}`);
            } catch (dbError) {
                console.error(`❌ Database error updating booking ${bookingId}:`, dbError.message);
                console.error(`   - Error name:`, dbError.name);
                console.error(`   - Error stack:`, dbError.stack);
                if (dbError.name === 'ValidationError') {
                    console.error(`   - Validation errors:`, dbError.errors);
                }
                throw dbError;
            }

        } else {
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }

        return response.status(200).json({ received: true });
    } catch (err) {
        console.error('❌ Error processing Stripe webhook event:');
        console.error('   - Event type:', event.type);
        console.error('   - Event ID:', event.id);
        console.error('   - Error message:', err?.message);
        console.error('   - Error stack:', err?.stack);
        // Still return 200 to Stripe to prevent retries, but log the error
        return response.status(200).json({ received: true, error: err?.message });
    }

}