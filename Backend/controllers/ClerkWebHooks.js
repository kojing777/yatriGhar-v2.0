import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        //getting headers from request
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        //verifying the headers
        await whook.verify(JSON.stringify(req.body), headers);

        //getting data from request body
        const { data, type } = req.body;

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        };

        //swithch case for different types of events
        switch (type) {
            case "user.created":
                //create user
                await User.create(userData);
                break;

            case "user.updated":
                //update user
                await User.findByIdAndUpdate(data.id, userData);
                break;

            case "user.deleted":
                //delete user
                await User.findByIdAndDelete(data.id);
                break;

            default:
                console.log("Unknown event type");
                break;
        }
        res.json({ success: true, message: 'webhook received successfully' });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;