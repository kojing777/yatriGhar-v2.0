import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true},
    email: { type: String, required: true },
    image: { type: String, required: false },
    role: { type: String, enum: ['user', 'hotelOwner'], default: 'user' },
    recentSearchedCities: [{ type: String}],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;