import React from "react";
import HotelCart from "./HotelCart";
import Title from "./Title";
import { FaArrowRight } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";

const FeaturedDestination = () => {
  const { rooms, navigate } = useAppContext();
  
  return rooms.length > 0 && (
    <div className="relative overflow-hidden px-4 sm:px-6 md:px-16 lg:px-24 py-20 bg-white/80">
      <Title
        title="Featured Destinations"
        subTitle="Discover our handpicked hotels across Nepal, offering local charm and unforgettable stays."
        align="center"
      />
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-20">
          {rooms.slice(0, 8).map((room, index) => (
            <HotelCart key={room._id} room={room} index={index} />
          ))}
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={() => {
            navigate("/rooms");
            scrollTo(0, 0);
          }}
          className="my-16 inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          View All Destinations
          <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedDestination;
