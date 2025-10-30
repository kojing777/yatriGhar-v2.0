import User from "../models/User.js";

//middkware to check if user is authenticated
export const protect = async (req, res, next) => {
const {userId} = req.auth();
    if (!userId) {
         res.json({ success: false, message: 'Unauthorized' });
    }else {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            req.user = user; // Attach user to request object
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }




}