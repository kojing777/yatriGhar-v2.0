import React, { useState } from "react";
import { cities } from "../assets/assets";
import { MdEditCalendar } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";

const Hero = () => {
  const {navigate, setSearchedCities} = useAppContext();
  const [destinations, setDestinations] = useState('')
  const onSearch = async (e) => {
    e.preventDefault();
    console.log("Searching for destination:", destinations);
    
    navigate(`/rooms?destination=${destinations}`);
    
    //add destination to searched cities in context
    setSearchedCities((prevSearchedCities) => {
      console.log("Previous searched cities:", prevSearchedCities);
      const updatedsearchedCities = [...prevSearchedCities, destinations];
      if (updatedsearchedCities.length > 3) {
        updatedsearchedCities.shift(); // Remove the oldest city if more than 3
      }
      console.log("Updated searched cities:", updatedsearchedCities);
      return updatedsearchedCities;
    });

    // Removed backend API call for saving recent searches
    console.log("Search would be saved in demo mode");
  };
  return (
    <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/nepal1.jpg")] bg-no-repeat bg-cover bg-center h-screen'>
      <p className="bg-[#49b9ff]/50 px-3.5 py-1 rounded-full mt-20">
        Authentic Nepali Hospitality
      </p>
      <h1 className="font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-2xl mt-4">
        Experience Nepal Like a Local with Our Homestays
      </h1>
      <p className="max-w-130 mt-2 text-sm md:text-base">
        Immerse yourself in Nepali culture while enjoying warm hospitality in
        traditional homes across the Himalayas.
      </p>

      <form onSubmit={onSearch} className="bg-white mt-8 text-gray-500 rounded-lg px-6 py-4  flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto">
        <div>
          <div className="flex items-center gap-2">
            <MdEditCalendar />
            <label htmlFor="destinationInput">Destination</label>
          </div>
          <input onChange={(e) => {
            setDestinations(e.target.value);
          }} value={destinations}
            list="destinations"
            id="destinationInput"
            type="text"
            className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            placeholder="Where to ?"
            required
          />
          <datalist id="destinations">
            {cities.map((city, index) => (
              <option value={city} key={index} />
            ))}
          </datalist>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <MdEditCalendar />
            <label htmlFor="checkIn">Check in</label>
          </div>
          <input
            id="checkIn"
            type="date"
            className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <MdEditCalendar />
            <label htmlFor="checkOut">Check out</label>
          </div>
          <input
            id="checkOut"
            type="date"
            className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
          <label htmlFor="guests">Guests</label>
          <input
            min={1}
            max={4}
            id="guests"
            type="number"
            className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16"
            placeholder="0"
          />
        </div>

        <button className="flex items-center justify-center mt-5 gap-2 rounded-md bg-black py-2.5 px-5 text-white my-auto cursor-pointer max-md:w-full max-md:py-1">
          <FaSearch />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;
