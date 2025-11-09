import { useState, useEffect } from "react";
import { cities } from "../assets/assets";
import { MdEditCalendar } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";


const Hero = () => {
  const { navigate, setSearchedCities, axios, getToken } = useAppContext();
  const [destinations, setDestinations] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSearch = async (e) => {
    e.preventDefault();
    console.log("Searching for destination:", destinations);

    navigate(`/rooms?destination=${destinations}`);

    await axios.post(
      "api/user/store-recent-search",
      { recentSearchedCity: destinations },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );

    setSearchedCities((prevSearchedCities) => {
      const updatedSearchedCities = [destinations, ...prevSearchedCities];
      if (updatedSearchedCities.length > 3) {
        updatedSearchedCities.pop();
      }
      return updatedSearchedCities;
    });
  };

  return (
    <div className='relative flex flex-col items-start justify-center px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 text-white h-screen bg-black overflow-hidden'>
      {/* Video Background with Effects */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/vid3.mp4"
          poster="/nepal1.jpg"
          aria-hidden="true"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/30 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {/* Subtle Grain Effect */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%221%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.03%22/%3E%3C/svg%3E')] opacity-30"></div>
      </div>

      {/* Content */}
      <div className="relative mt-12 z-10 w-full max-w-7xl mx-auto">
        <div className={`space-y-6 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Header Text */}
          <div className="space-y-4 max-w-2xl">
            <p className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 rounded-full text-sm font-medium inline-block transform hover:scale-105 transition-transform duration-300">
              Authentic Nepali Hospitality
            </p>
            
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold ">
              Experience Nepal Like a Local with Our{" "}
              <span className="text-amber-400">Homestays</span>
            </h1>
            
            <p className="text-lg text-white/90 leading-relaxed max-w-xl">
              Immerse yourself in Nepali culture while enjoying warm hospitality in
              traditional homes across the Himalayas.
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={onSearch}
              className={`bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-gray-700 shadow-xl border border-white/20 mt-6 w-full max-w-4xl transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
              {/* Destination */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-600 font-medium">
                  <MdEditCalendar className="text-lg" />
                  <label htmlFor="destinationInput" className="text-sm">Destination</label>
                </div>
                <input
                  onChange={(e) => setDestinations(e.target.value)}
                  value={destinations}
                  list="destinations"
                  id="destinationInput"
                  type="text"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                  placeholder="Where to?"
                  required
                />
                <datalist id="destinations">
                  {cities.map((city, index) => (
                    <option value={city} key={index} />
                  ))}
                </datalist>
              </div>

              {/* Check In */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-600 font-medium">
                  <MdEditCalendar className="text-lg" />
                  <label htmlFor="checkIn" className="text-sm">Check in</label>
                </div>
                <input
                  id="checkIn"
                  type="date"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                />
              </div>

              {/* Check Out */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-600 font-medium">
                  <MdEditCalendar className="text-lg" />
                  <label htmlFor="checkOut" className="text-sm">Check out</label>
                </div>
                <input
                  id="checkOut"
                  type="date"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                />
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-600 font-medium">
                  <label htmlFor="guests" className="text-sm">Guests</label>
                </div>
                <input
                  min={1}
                  max={4}
                  id="guests"
                  type="number"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                  placeholder="0"
                />
              </div>

              {/* Search Button */}
              <button className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-5 sm:px-6 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group col-span-1 sm:col-span-2 lg:col-span-1">
                <FaSearch className="text-lg transform group-hover:scale-110 transition-transform" />
                <span className="text-sm sm:text-base">Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;