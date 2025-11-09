import React, { useMemo, useState } from "react";
import { facilityIcons } from "../assets/assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineMapPin } from "react-icons/hi2";
import { MdOutlineKingBed, MdAttachMoney, MdSwapVert } from "react-icons/md";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import Title from "../components/Title";

const CheckBox = ({ label, selected = false, onChange = () => {}, icon = null }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
        className="w-4 h-4"
      />
      {icon && <span className="text-amber-500 w-4 h-4">{icon}</span>}

      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {}, icon = null }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        checked={selected}
        onChange={() => onChange(label)}
        className="w-4 h-4"
      />
      {icon && <span className="text-amber-500 w-4 h-4">{icon}</span>}

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
      return room.hotel?.city
        ?.toLowerCase()
        .includes(destination.toLowerCase());
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
    <div className="flex flex-col-reverse lg:flex-row  mb-6 items-start justify-between pt-28 px-4 md:px-16 lg:px-24 xl:px-32 gap-8 lg:gap-10">
      {/* left content */}
      <div className="flex-1">
        <div className="flex flex-col items-start lg:items-start text-start lg:text-left mb-6">
          <Title
            title="Our Rooms"
            subTitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories."
            align="left"
          />
        </div>
        {filteredRooms.map((room) => (
          <article
            key={room._id}
            className="bg-white/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 mb-8 border border-transparent hover:border-amber-100"
          >
            <div className="md:flex">
              <div className="md:w-1/2">
                <div
                  className="relative overflow-hidden group cursor-pointer h-60 md:h-full"
                  onClick={() => {
                    navigate(`/rooms/${room._id}`);
                    scrollTo(0, 0);
                  }}
                >
                  <img
                    src={room.images?.[0]}
                    alt={room.hotel?.name || "room image"}
                    className="w-full h-60 md:h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                    {currency}
                    {room.pricePerNight}/night
                  </div>
                  {room.featured && (
                    <div className="absolute top-4 right-4 bg-white/80 text-amber-600 px-3 py-1 rounded-md text-sm font-semibold">
                      Featured
                    </div>
                  )}
                </div>
              </div>

              <div className="md:w-1/2 p-6 flex flex-col justify-between gap-4">
                <div>
                  <p className="text-sm text-amber-600 font-medium">
                    {room.hotel?.city || "Unknown City"}
                  </p>
                  <h3
                    onClick={() => {
                      navigate(`/rooms/${room._id}`);
                      scrollTo(0, 0);
                    }}
                    className="text-2xl md:text-3xl font-playfair text-gray-900 cursor-pointer hover:text-amber-600 transition-colors"
                  >
                    {room.hotel?.name || "Unknown Hotel"}
                  </h3>

                  <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                    <StarRating />
                    <span className="text-xs">200+ reviews</span>
                    <span className="flex items-center gap-1">
                      <HiOutlineMapPin className="h-4 w-4 text-amber-400" />
                      {room.hotel?.address || "Unknown Address"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {room.amenities?.slice(0, 6).map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm"
                      >
                        <img
                          src={facilityIcons[item]}
                          alt=""
                          className="w-4 h-4"
                        />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-lg text-gray-600">
                    From{" "}
                    <span className="font-semibold text-gray-900">
                      {currency}
                      {room.pricePerNight}
                    </span>{" "}
                    / night
                  </div>
                  <button
                    onClick={() => {
                      navigate(`/rooms/${room._id}`);
                      scrollTo(0, 0);
                    }}
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2 rounded-2xl font-semibold shadow-md transition-all duration-500 transform hover:scale-105 hover:shadow-xl"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {/* filters */}
      <div className="bg-white w-full lg:w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-auto">
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
            <p className="font-medium text-gray-800 pb-2 flex items-center gap-2">
              <MdOutlineKingBed className="text-amber-500 w-5 h-5" /> Popular Filters
            </p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room.charAt(0).toUpperCase() + room.slice(1)}
                selected={selectedFilters.roomTypes.includes(room)}
                onChange={(checked) =>
                  handleFilterChange(checked, room, "roomTypes")
                }
                icon={<MdOutlineKingBed className="w-4 h-4" />}
              />
            ))}
          </div>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2 flex items-center gap-2">
              <MdAttachMoney className="text-amber-500 w-5 h-5" /> Price Range
            </p>
            {priceRanges.map((range, index) => (
              <CheckBox
                key={index}
                label={`${currency}${range}`}
                selected={selectedFilters.priceRange === range}
                onChange={(checked) =>
                  handleFilterChange(checked, range, "priceRange")
                }
                icon={<MdAttachMoney className="w-4 h-4" />}
              />
            ))}
          </div>
          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2 flex items-center gap-2">
              <MdSwapVert className="text-amber-500 w-5 h-5" /> Sort by
            </p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSort === option}
                onChange={() => handleSortChange(option)}
                icon={<MdSwapVert className="w-4 h-4" />}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
