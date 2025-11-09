import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import transporter from "../configs/nodemailer.js";
import Stripe from 'stripe';


//function to check availability of rooms
// Accepts an object { checkInDate, checkOutDate, room }
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        if (!room || !checkInDate || !checkOutDate) return false;
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate }
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;

    } catch (error) {
        console.error('checkAvailability error:', error.message);
        return false;
    }
};

//api to check room availability
//post/api/booking/check-availability
export const checkAvailabilityApi = async (req, res) => {

    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        res.status(200).json({ success: true, isAvailable });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//api to create a new booking
//POST /api/booking/create
export const createBooking = async (req, res) => {
    try {
    const { room, checkInDate, checkOutDate, guests, paymentMethod, PaymentMethod } = req.body;
    // Accept either `paymentMethod` or legacy `PaymentMethod` from frontend
    const chosenPaymentMethod = paymentMethod || PaymentMethod || 'Pay at Hotel';
        const user = req.user._id;

        //before booking check availability
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        
        if (!isAvailable) {
            return res.status(400).json({ success: false, message: "Room is not available" });
        }
        
        //get totalPrice from room details

        const roomData = await Room.findById(room).populate('hotel');
        let totalPrice = roomData.pricePerNight;

        //calculate total price based on number of nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        const timeDiff = checkOut.getTime() - checkIn.getTime()
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        totalPrice *= nights;
       
        //create booking
        const booking = await Booking.create({
            user,
            room,
            checkInDate,
            checkOutDate,
            hotel: roomData.hotel._id,
            guest: +guests,
            totalPrice,
            paymentMethod: chosenPaymentMethod,
        });

        // Send confirmation email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: 'Booking Confirmation',
            html: `<h1>Tour Booking Details</h1>
                   <p>Dear ${req.user.username},</p>
                   <p>Your booking for room ${booking._id} from ${checkInDate} to ${checkOutDate} has been confirmed.</p>
                   <p>Total Price: $${totalPrice}</p>
                   <p>Thank you for choosing our service!</p>
                   <p>Best regards,</p>
                   <p>YatriGhar Team</p>`
        };
        await transporter.sendMail(mailOptions);
        res.status(201).json({ success: true, message: "Booking created successfully", booking });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Failed to create booking' });
    }
};

//api to get all bookings of a user
//GET /api/booking/user
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user }).populate('room hotel').sort({ createdAt: -1 });

        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
    }
};

//api to get all bookings of a hotel
//GET /api/booking/hotel    
export const getHotelBookings = async (req, res) => {
    try {
        const ownerId = req.user?._id;
        const hotel = await Hotel.findOne({ owner: ownerId });
        if (!hotel) {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }
        const bookings = await Booking.find({ hotel: hotel._id }).populate('room hotel user').sort({ createdAt: -1 });

        //total bookings
        const totalBookings = bookings.length;

        //total revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        res.status(200).json({ success: true, dashboardData: { bookings, totalBookings, totalRevenue } });

    } catch (error) {
        
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch hotel bookings' });
    }
};


export const stripePayment = async (req, res) => {
    try {
        const {bookingId} = req.body;

        const booking = await Booking.findById(bookingId);
        const roomData = await Room.findById(booking.room).populate('hotel');
        const totalPrice = booking.totalPrice;

    const { origin } = req.headers || {};

    // Initialize Stripe with the secret key
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Booking for ${roomData.name} at ${roomData.hotel.name}`,
                    },
                    unit_amount: totalPrice * 100, // amount in cents
                },
                quantity: 1,
            },
        ];
        // Create a new Stripe Checkout session
    const session = await stripeInstance.checkout.sessions.create({
            // payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${origin}/loader/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            metadata : {
                bookingId,
            },
        });
        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error('stripePayment error:', error?.message || error);
        res.status(500).json({ success: false, message: error?.message || 'Stripe payment failed' });
    }
}