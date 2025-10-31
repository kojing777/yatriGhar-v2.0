import User from "../models/User.js";

// middleware to check if user is authenticated
export const protect = async (req, res, next) => {
    try {
        // Clerk may attach auth info as a function (req.auth()) or as an object (req.auth)
        let authInfo;
        if (typeof req.auth === 'function') {
            authInfo = req.auth();
        } else {
            authInfo = req.auth || {};
        }

        const userId = authInfo?.userId || authInfo?.sub || authInfo?.user_id || authInfo?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Auth middleware error:', error.message || error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};