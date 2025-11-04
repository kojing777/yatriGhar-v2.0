import React, { useEffect, useState } from "react";
import HotelCart from "./HotelCart";
import Title from "./Title";
import { useAppContext } from "../context/AppContext";

const RecommendedHotels = () => {
  const { rooms, searchedCities } = useAppContext();
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    console.log("RecommendedHotels - rooms:", rooms?.length);
    console.log("RecommendedHotels - searchedCities:", searchedCities);

    const filterHotels = () => {
      if (
        searchedCities &&
        searchedCities.length > 0 &&
        rooms &&
        rooms.length > 0
      ) {
        // Only show hotels from searched cities
        const filteredHotels = rooms.filter((room) => {
          console.log("Checking room city:", room.hotel?.city);
          return searchedCities.includes(room.hotel?.city);
        });
        console.log("Filtered hotels:", filteredHotels.length);
        setRecommended(filteredHotels);
      } else {
        // If no searches yet, don't show any recommendations
        setRecommended([]);
      }
    };

    filterHotels();
  }, [rooms, searchedCities]);
  return searchedCities && searchedCities.length > 0 ? (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
      <Title
        title="Recommended Hotels"
        subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
        align="center"
      />

      <div className="flex flex-wrap items-center justify-center mt-20 gap-6">
        {recommended.length > 0 ? (
          recommended
            .slice(0, 4)
            .map((room, index) => (
              <HotelCart key={room._id} room={room} index={index} />
            ))
        ) : (
          <p className="text-gray-500 text-center">
            No hotels found in the searched cities.
          </p>
        )}
      </div>
    </div>
  ) : null;
};

export default RecommendedHotels;
