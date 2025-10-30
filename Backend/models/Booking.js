import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: { type: String, required: true, ref: "User" },
    room: { type: String, required: true, ref: "Room" },
    hotel: { type: String, required: true, ref: "Hotel" },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    guest: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    },
    isPaid: { type: Boolean, default: false }
}, { timestamps: true });


const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
