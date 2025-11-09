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
    // express.raw puts a Buffer on req.body for routes using express.raw().
    const rawBody = Buffer.isBuffer(request.body) ? request.body : Buffer.from(JSON.stringify(request.body));

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
                
                // Try to find the booking first to verify it exists
                const existingBooking = await Booking.findById(trimmedBookingId);
                if (!existingBooking) {
                    console.error(`❌ Booking ${trimmedBookingId} not found in database`);
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
                
                // Try to find the booking first to verify it exists
                const existingBooking = await Booking.findById(trimmedBookingId);
                if (!existingBooking) {
                    console.error(`❌ Booking ${trimmedBookingId} not found in database`);
                    console.error(`   - Attempted to find booking with ID: ${trimmedBookingId}`);
                    // List a few recent bookings for debugging
                    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5).select('_id');
                    console.error(`   - Recent booking IDs in database:`, recentBookings.map(b => b._id.toString()));
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