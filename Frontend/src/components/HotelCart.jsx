import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
const HotelCart = ({ room, index }) => {
  if (!room || room.hotel === null) return null;

  const { currency } = useAppContext();

  const getFirstImageUrl = () => {
    if (!room.images) return null;
    if (Array.isArray(room.images) && room.images.length > 0) {
      const first = room.images[0];
      if (typeof first === "string" && first.includes(",")) {
        const parts = first
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        return parts.length ? parts[0] : null;
      }
      return first;
    }
    if (typeof room.images === "string") {
      const parts = room.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return parts.length ? parts[0] : null;
    }
    return null;
  };

  const imageUrl = getFirstImageUrl();

  return (
    <Link
      className="relative w-full rounded-xl overflow-hidden bg-white text-gray-500 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
      onClick={() => scrollTo(0, 0)}
      key={room._id}
      to={`/rooms/${room._id}`}
    >
      {/* Image: fixed aspect ratio so all cards match height */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${room.hotel?.name || "hotel"} image`}
          className="w-full h-44 sm:h-48 md:h-56 lg:h-64 object-cover"
        />
      ) : (
        <img
          src={assets.uploadArea}
          alt="placeholder"
          className="w-full h-44 sm:h-48 md:h-56 lg:h-64 object-cover"
        />
      )}

      {index % 2 === 0 && (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-300 to-orange-300 text-gray-700 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-md">
          Best Seller
        </span>
      )}

      <div className="p-4 pt-5">
        <div className="flex items-center justify-between">
          <p className="font-playfair text-lg sm:text-xl font-medium text-gray-800">
            {room.hotel.name || "Unknown Hotel"}
          </p>
          <div className="flex items-center gap-1 text-sm">
            <img
              src={assets.starIconFilled}
              alt="star icon"
              className="w-4 h-4"
            />
            <span className="ml-1">4.5</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
          <img
            src={assets.locationIcon}
            alt="location icon"
            className="w-4 h-4"
          />
          <span className="truncate">
            {room.hotel?.address || "Unknown Address"}
          </span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p>
            <span className="text-lg sm:text-xl text-gray-800">
              {currency}
              {room.pricePerNight}
            </span>
            <span className="text-sm text-gray-600"> /Night</span>
          </p>
          <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCart;
