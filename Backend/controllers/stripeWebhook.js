import Stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhook = async (request, response) => {

    // Initialize Stripe with your secret key
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers['stripe-signature'];
    let event;

    // Ensure we use the raw request body bytes for signature verification.
    // express.raw puts a Buffer on req.body for routes using express.raw().
    const rawBody = Buffer.isBuffer(request.body) ? request.body : Buffer.from(JSON.stringify(request.body));

    try {
        event = stripeInstance.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        // Prefer handling the Checkout Session completion which contains metadata directly
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const bookingId = session?.metadata?.bookingId;

            if (!bookingId) {
                console.warn('checkout.session.completed received but no bookingId in metadata', { sessionId: session.id, metadata: session.metadata });
            } else {
                await Booking.findByIdAndUpdate(bookingId, { isPaid: true, paymentStatus: 'stripe' });
                console.log(`Booking ${bookingId} marked as paid (checkout.session.completed)`);
            }

        } else if (event.type === 'payment_intent.succeeded') {
            // Fallback: try to find the Checkout Session linked to this PaymentIntent
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const sessions = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
                limit: 1,
            });

            const session = sessions?.data?.[0];
            const bookingId = session?.metadata?.bookingId || paymentIntent?.metadata?.bookingId;

            if (!bookingId) {
                console.warn('payment_intent.succeeded received but bookingId not found', { paymentIntentId, sessionMetadata: session?.metadata, paymentIntentMetadata: paymentIntent?.metadata });
            } else {
                await Booking.findByIdAndUpdate(bookingId, { isPaid: true, paymentStatus: 'stripe' });
                console.log(`Booking ${bookingId} marked as paid (payment_intent.succeeded)`);
            }

        } else {
            console.log(`Unhandled event type ${event.type}`);
        }

        return response.status(200).json({ received: true });
    } catch (err) {
        console.error('Error processing Stripe webhook event:', err?.message || err);
        return response.status(500).json({ success: false, message: err?.message || 'Webhook handler error' });
    }

}