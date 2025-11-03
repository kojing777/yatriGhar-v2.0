import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const HotelCart = ({ room, index }) => {
  if (!room || room.hotel === null) return null;

  // Defensive: room.images may be stored oddly (e.g., a single comma-joined string).
  // Find the first valid image URL to use as src.
  const getFirstImageUrl = () => {
    if (!room.images) return null;
    if (Array.isArray(room.images) && room.images.length > 0) {
      const first = room.images[0];
      if (typeof first === "string" && first.includes(",")) {
        // split and take the first non-empty chunk
        const parts = first.split(",").map((s) => s.trim()).filter(Boolean);
        return parts.length ? parts[0] : null;
      }
      return first;
    }
    if (typeof room.images === "string") {
      // fallback: if it's a single comma-separated string
      const parts = room.images.split(",").map((s) => s.trim()).filter(Boolean);
      return parts.length ? parts[0] : null;
    }
    return null;
  };

  const imageUrl = getFirstImageUrl();

  return (
    <Link
      className="relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
      onClick={() => scrollTo(0, 0)}
      key={room._id}
      to={`/rooms/${room._id}`}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" />
      ) : (
        <img src={assets.uploadArea} alt="placeholder" />
      )}
      {index % 2 === 0 && (
        <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full">
          Best Seller
        </p>
      )}

      <div className="p-4 pt-5">
        <div className="flex items-center justify-between">
          <p className="font-playfair text-xl font-medium text-gray-800">
            {room.hotel.name || "Unknown Hotel"}
          </p>
          <div className="flex items-center gap-1">
            <img src={assets.starIconFilled} alt="staricon" /> 4.5
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2 text-sm">
          <img src={assets.locationIcon} alt="locationIcon" />
          <span>{room.hotel?.address || "Unknown Address"}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p>
            <span className="text-xl text-gray-800">${room.pricePerNight}</span>{" "}
            /Night
          </p>
          <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gry-50 transition-all cursor-pointer">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCart;
