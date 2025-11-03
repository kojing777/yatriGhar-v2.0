import React from "react";
import HotelCart from "./HotelCart";
import Title from "./Title";
import { useAppContext } from "../context/AppContext";

const FeaturedDestination = () => {
  const { rooms, navigate } = useAppContext();
  
  return rooms.length > 0 && (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
      <Title
        title="Featured Destinations"
        subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
        align="center"
      />

      <div className="flex flex-wrap items-center justify-center mt-20 gap-6">
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCart key={room._id} room={room} index={index} />
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/rooms");
          scrollTo(0, 0);
        }}
        className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
      >
        View All Destinations
      </button>
    </div>
  );
};

export default FeaturedDestination;
