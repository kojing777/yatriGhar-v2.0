import Stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhook = async (request, response) => {

    // Initialize Stripe with your secret key
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;


        const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId,
        });

        const bookingId = session.data[0].metadata.bookingId;

        // Update booking status to paid
        await Booking.findByIdAndUpdate(bookingId, { isPaid: true, paymentStatus: 'stripe' });
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }

    response.status(200).json({ received: true });

}