import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // svix expects the raw request body bytes for verification. Depending on how
        // the route is set up req.body may already be a Buffer (express.raw) or a parsed
        // object (if another middleware ran). Handle both.
        const rawBody = Buffer.isBuffer(req.body)
            ? req.body
            : Buffer.from(JSON.stringify(req.body));

        //getting headers from request
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        //verifying the headers using raw payload
        await whook.verify(rawBody, headers);

        // Parse the verified payload
        const payload = JSON.parse(rawBody.toString());
        const { data, type } = payload;

        // Safely extract fields (Clerk's payload shape can vary). Provide sensible fallbacks.
        const email = data?.email_addresses?.[0]?.email_address || data?.primary_email_address || '';
        const username = [data?.first_name, data?.last_name].filter(Boolean).join(' ') || data?.username || (email ? email.split('@')[0] : `user_${data?.id}`);
        const image = data?.image_url || '';

        const userData = {
            _id: data.id,
            email,
            username,
            image,
        };

        // Use upsert for create/update to make handlers idempotent and resilient
        switch (type) {
            case "user.created":
                await User.findByIdAndUpdate(data.id, userData, { upsert: true, new: true, setDefaultsOnInsert: true });
                break;

            case "user.updated":
                await User.findByIdAndUpdate(data.id, userData, { new: true });
                break;

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                break;

            default:
                console.log("Unknown event type", type);
                break;
        }
        res.json({ success: true, message: 'webhook received successfully' });
    } catch (error) {
        console.error('Clerk webhook error:', error?.message || error);
        // Return 400 for verification errors to help Clerk/Svix diagnostics
        const status = error?.message?.toLowerCase?.().includes('failed to verify') ? 400 : 500;
        res.status(status).json({ success: false, message: error.message || 'Webhook processing error' });
    }
};

export default clerkWebhooks;