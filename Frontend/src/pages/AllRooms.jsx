import React, { useMemo, useState } from "react";
import { facilityIcons } from "../assets/assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineMapPin } from "react-icons/hi2";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />

      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer mt-2 text-sm">
      <input type="radio" checked={selected} onChange={() => onChange(label)} />

      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { rooms, currency } = useAppContext();
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    roomTypes: [],
    priceRange: "",
    sortBy: "",
  });
  const [selectedSort, setSelectedSort] = useState("");

  const roomTypes = ["single", "double", "deluxe", "family"];
  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];
  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];
  //handle changes for filters and sorting
  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };

      if (type === "roomTypes") {
        if (checked) {
          updatedFilters[type].push(value);
        } else {
          updatedFilters[type] = updatedFilters[type].filter(
            (item) => item !== value
          );
        }
      } else if (type === "priceRange") {
        updatedFilters[type] = checked ? value : "";
      }

      return updatedFilters;
    });
  };
  const handleSortChange = (sortOptions) => {
    setSelectedSort(sortOptions);
  };

  //filter and sort rooms based on selected filters and sort options
  const filteredRooms = useMemo(() => {
    if (!rooms || rooms.length === 0) return [];

    //function to check if a filter is selected room types
    const matchsRoomType = (room) => {
      if (selectedFilters.roomTypes.length === 0) return true;

      // Handle different room type naming conventions
      const roomType = room.roomType?.toLowerCase();
      return selectedFilters.roomTypes.some((filterType) => {
        const filter = filterType.toLowerCase();
        return (
          roomType === filter ||
          roomType?.includes(filter) ||
          filter.includes(roomType)
        );
      });
    };

    //function to check if a filter is selected price range
    const matchsPriceRange = (room) => {
      if (!selectedFilters.priceRange) return true;
      const [min, max] = selectedFilters.priceRange.split(" to ").map(Number);
      return room.pricePerNight >= min && room.pricePerNight <= max;
    };

    //function to check if a filter is selected sort by //corrected function name
    const sortRooms = (a, b) => {
      if (selectedSort === "Price Low to High") {
        return a.pricePerNight - b.pricePerNight;
      }
      if (selectedSort === "Price High to Low") {
        return b.pricePerNight - a.pricePerNight;
      }
      if (selectedSort === "Newest First") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    };

    //filter destinations based on selected filters
    const filteredDestination = (room) => {
      const destination = searchParams.get("destination");
      if (!destination) return true;
      return room.hotel?.city?.toLowerCase().includes(destination.toLowerCase());
    };

    return rooms
      .filter(
        (room) =>
          matchsRoomType(room) &&
          matchsPriceRange(room) &&
          filteredDestination(room)
      )
      .sort(sortRooms);
  }, [rooms, selectedFilters, selectedSort, searchParams]);

  //clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      roomTypes: [],
      priceRange: "",
      sortBy: "",
    });
    setSelectedSort("");
    setSearchParams({});
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* left content */}
      <div>
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Our Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>
        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
          >
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              src={room.images[0]}
              alt="hotel-img"
              title="view room Details"
              className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
            />
            <div className="mt-4 md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500">{room.hotel?.city || "Unknown City"}</p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room.id}`);
                  scrollTo(0, 0);
                }}
                className="text-gray-800 text-3xl font-playfair cursor-pointer"
              >
                {room.hotel?.name || "Unknown Hotel"}
              </p>
              <div className="flex items-center">
                <StarRating />
                <p className="ml-2">200+ reviews</p>
              </div>
              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <HiOutlineMapPin className="h-4 w-4" />
                <span>{room.hotel?.address || "Unknown Address"}</span>
              </div>
              {/* room aminities */}
              <div className="flex flex-wrap items-center mb-6 gap-4 mt-3">
                {room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg bg-[#f5f5ff]/70"
                  >
                    <img src={facilityIcons[item]} alt="" className="w-5 h-5" />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
              {/* room price per night */}
              <p className="text-xl font-medium text-gray-700">
                {currency}{room.pricePerNight}/night
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* filters */}
      <div className="bg-white  w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16">
        <div
          className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b ${
            openFilters && "border-b"
          }`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-sm cursor-pointer">
            <span
              onClick={() => setOpenFilters(!openFilters)}
              className="lg:hidden"
            >
              {openFilters ? "HIDE" : "SHOW"}
            </span>
            <span
              onClick={clearFilters}
              className="hidden lg:block cursor-pointer"
            >
              CLEAR
            </span>
          </div>
        </div>
        <div
          className={`${
            openFilters ? "h-auto" : "h-0 lg:h-auto"
          } overflow-hidden transition-all duration-700`}
        >
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room.charAt(0).toUpperCase() + room.slice(1)}
                selected={selectedFilters.roomTypes.includes(room)}
                onChange={(checked) =>
                  handleFilterChange(checked, room, "roomTypes")
                }
              />
            ))}
          </div>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRanges.map((range, index) => (
              <CheckBox
                key={index}
                label={`${currency}${range}`}
                selected={selectedFilters.priceRange === range}
                onChange={(checked) =>
                  handleFilterChange(checked, range, "priceRange")
                }
              />
            ))}
          </div>
          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort by</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSort === option}
                onChange={() => handleSortChange(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
