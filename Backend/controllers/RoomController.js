import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";

//api to create a new room for a hotel
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities, } = req.body;
        const ownerId = req.user?._id;
        const hotel = await Hotel.findOne({ owner: ownerId });

        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }

        // upload images to cloudinary
        const uploadedImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        });

        const images = await Promise.all(uploadedImages);
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        });

        res.status(201).json({ success: true, message: "Room created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//api to get all rooms for a hotel
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, rooms });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//api to get all rooms for a specific hotel
export const getOwnerRoom = async (req, res) => {
    try {
        // find hotel owned by authenticated user
        const ownerId = req.user?._id;
        const hotelData = await Hotel.findOne({ owner: ownerId });
        if (!hotelData) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }
        // Rooms are stored in Room collection with `hotel` reference — query them directly
        const rooms = await Room.find({ hotel: hotelData._id }).populate('hotel');
        res.status(200).json({ success: true, rooms });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//api to toggle room availability of a specific room
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;

        // Find the room by ID
        const roomData = await Room.findById(roomId);
        if (!roomData) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();

        // return consistent response shape and include updated room state
        res.status(200).json({ success: true, message: "Room availability updated", room: roomData });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}