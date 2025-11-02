import User from "../models/User.js";

// Middleware to check if user is authenticated.
// This is defensive: clerk's middleware should provide req.auth(), but if it's
// missing (misconfiguration or a non-authenticated request) we return 401
// instead of throwing an unhandled exception which results in a 500.
export const protect = async (req, res, next) => {
    try {
        // Some Clerk middleware versions expose req.auth as a function.
        // Guard against missing req.auth to avoid crashing.
        let auth = null;
        if (typeof req.auth === 'function') {
            auth = req.auth();
        } else if (req.auth) {
            // In some environments req.auth might already be an object
            auth = req.auth;
        }

        const userId = auth && (auth.userId || auth.user_id || auth.user?.id);

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};