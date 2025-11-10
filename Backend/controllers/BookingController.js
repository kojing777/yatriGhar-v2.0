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
        try {
            if (!process.env.SENDER_EMAIL) {
                console.warn('⚠️ SENDER_EMAIL not set, skipping email sending');
            } else if (!req.user.email) {
                console.warn('⚠️ User email not found, skipping email sending');
            } else {
                const mailOptions = {
                    from: process.env.SENDER_EMAIL,
                    to: req.user.email,
                    subject: 'Booking Confirmation',
                                            html: `
                                                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #111827;">
                                                    <div style="max-width:600px;margin:0 auto;padding:24px;background:#ffffff;border-radius:8px;box-shadow:0 4px 20px rgba(2,6,23,0.08);">
                                                        <div style="text-align:center;padding-bottom:12px;">
                                                            <img src="${process.env.FRONTEND_URL || ''}/yatri.png" alt="YatriGhar" style="height:56px;object-fit:contain;" />
                                                        </div>
                                                        <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px">Booking Confirmed. Thank you, ${req.user.username}!</h2>
                                                        <p style="margin:0 0 16px;color:#475569;line-height:1.5">We're delighted to confirm your booking. Below are the key details — we've saved everything for you and look forward to making your stay memorable.</p>

                                                        <table style="width:100%;border-collapse:collapse;margin-bottom:18px;font-size:14px;color:#334155">
                                                            <tr>
                                                                <td style="padding:8px 0;font-weight:600;width:40%">Booking ID</td>
                                                                <td style="padding:8px 0">${booking._id}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding:8px 0;font-weight:600">Hotel</td>
                                                                <td style="padding:8px 0">${roomData.hotel?.name || 'N/A'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding:8px 0;font-weight:600">Room</td>
                                                                <td style="padding:8px 0">${roomData.name || 'N/A'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding:8px 0;font-weight:600">Check-in</td>
                                                                <td style="padding:8px 0">${new Date(checkInDate).toDateString()}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding:8px 0;font-weight:600">Check-out</td>
                                                                <td style="padding:8px 0">${new Date(checkOutDate).toDateString()}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding:8px 0;font-weight:600">Guests</td>
                                                                <td style="padding:8px 0">${guests}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding:8px 0;font-weight:600">Total Price</td>
                                                                <td style="padding:8px 0">Rs. ${totalPrice}</td>
                                                            </tr>
                                                        </table>

                                                        <p style="margin:0 0 18px;color:#334155">A sweet note from our team:</p>
                                                        <blockquote style="margin:0 0 18px;padding:12px 16px;background:#f8fafc;border-left:4px solid #f59e0b;color:#0f172a">We're thrilled to be part of your journey. Travel safe, soak up the local flavors, and let us take care of the rest — we hope this trip leaves you with wonderful memories.</blockquote>

                                                        <div style="text-align:center;margin-top:20px">
                                                            <a href="${process.env.FRONTEND_URL || 'https://yourdomain.com'}/my-bookings" style="display:inline-block;padding:10px 18px;background:#f59e0b;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600">View your booking</a>
                                                        </div>

                                                        <hr style="border:none;border-top:1px solid #e6edf3;margin:20px 0" />

                                                        <div style="font-size:13px;color:#64748b;line-height:1.6">
                                                            <p style="margin:0 0 8px">Need help? Contact our support team:</p>
                                                            <p style="margin:0">Email: <a href="mailto:${process.env.SUPPORT_EMAIL || process.env.SENDER_EMAIL}" style="color:#0f172a;text-decoration:none">${process.env.SUPPORT_EMAIL || process.env.SENDER_EMAIL}</a> | Phone: <a href="tel:${process.env.SUPPORT_PHONE || '+1-555-0100'}" style="color:#0f172a;text-decoration:none">${process.env.SUPPORT_PHONE || '+1-555-0100'}</a></p>
                                                            <p style="margin:12px 0 0;color:#94a3b8">We're here for you 24/7. If anything needs changing, reply to this email or visit your bookings page.</p>
                                                        </div>

                                                        <p style="margin:18px 0 0;color:#94a3b8;font-size:12px">Warmly,<br/>The YatriGhar Team</p>
                                                    </div>

                                                    <div style="max-width:600px;margin:16px auto 0;text-align:center;font-size:12px;color:#94a3b8">
                                                        <p style="margin:6px 0">YatriGhar · 123 Traveler Lane · Your City</p>
                                                        <p style="margin:6px 0">If you didn't make this booking, please <a href="mailto:${process.env.SUPPORT_EMAIL || process.env.SENDER_EMAIL}" style="color:#0f172a">contact us</a> immediately.</p>
                                                    </div>
                                                </div>
                                            `
                };
                await transporter.sendMail(mailOptions);
                console.log(`✅ Confirmation email sent to ${req.user.email}`);
            }
        } catch (emailError) {
            // Log email error but don't fail the booking creation
            console.error('❌ Failed to send confirmation email:');
            console.error('   - Error:', emailError.message);
            console.error('   - Error code:', emailError.code);
            console.error('   - Response:', emailError.response);
            console.error('   - Booking was created successfully despite email failure');
        }
        
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

        if (!bookingId) {
            return res.status(400).json({ success: false, message: 'Booking ID is required' });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const roomData = await Room.findById(booking.room).populate('hotel');
        if (!roomData) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const totalPrice = booking.totalPrice;

        // Get origin from headers or use environment variable as fallback
        const origin = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || process.env.FRONTEND_URL || 'http://localhost:5173';

        // Initialize Stripe with the secret key
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('STRIPE_SECRET_KEY is not set in environment variables');
            return res.status(500).json({ success: false, message: 'Stripe configuration error' });
        }

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Booking for ${roomData.name} at ${roomData.hotel.name}`,
                    },
                    unit_amount: Math.round(totalPrice * 100), // amount in cents, ensure it's an integer
                },
                quantity: 1,
            },
        ];
        
        // Convert bookingId to string for metadata
        const bookingIdString = bookingId.toString();
        
        // Create a new Stripe Checkout session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/loader/my-bookings?payment=success`,
            cancel_url: `${origin}/my-bookings?payment=cancelled`,
            // Attach bookingId to the Checkout Session metadata AND to the underlying PaymentIntent
            metadata: {
                bookingId: bookingIdString,
            },
            payment_intent_data: {
                metadata: {
                    bookingId: bookingIdString,
                },
            },
            // Add customer email if available
            customer_email: req.user?.email || undefined,
        });
        
        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error('stripePayment error:', error?.message || error);
        res.status(500).json({ success: false, message: error?.message || 'Stripe payment failed' });
    }
}