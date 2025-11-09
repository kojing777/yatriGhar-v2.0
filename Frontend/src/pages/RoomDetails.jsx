import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms, navigate, getToken, axios, currency } = useAppContext();
  const [room, setRoom] = useState(null); // State to hold room data
  const [mainImage, setMainImage] = useState(null); // State for main image URL
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);

  const [isAvailable, setIsAvailable] = useState(false);
  //check room available
  const checkAvailability = async () => {
    try {
      if (!checkInDate || !checkOutDate) {
        toast.error("Please select both check-in and check-out dates");
        return;
      }
      const { data } = await axios.post("/api/booking/check-availability", {
        room: id,
        checkInDate,
        checkOutDate,
      });
      if (data.success) {
        if (data.isAvailable) {
          setIsAvailable(true);
          toast.success("Room is available");
        } else {
          setIsAvailable(false);
          toast.error("Room is not available");
        }
      } else {
        toast.error("Failed to check availability. Please try again.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //handle form to check availability and book the room
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      if (!isAvailable) {
        return checkAvailability();
      } else {
        const token = await getToken();
        const { data } = await axios.post(
          "/api/booking/book",
          {
            room: id,
            checkInDate,
            checkOutDate,
            guests,
            PaymentMethod: "Pay at Hotel",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) {
          toast.success("Room booked successfully");
          navigate("/my-bookings");
          scrollTo(0, 0);
        } else {
          toast.error("Failed to book the room. Please try again.");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const room = rooms.find((room) => room._id === id);
    room && setRoom(room);
    room && setMainImage(room.images[0]);
  }, [rooms, id]);

  if (!room) {
    return (
      <div className="text-center mt-20 text-red-500">Room not found.</div>
    );
  }

  return (
    room && (
      <div className="py-12 md:py-20 lg:py-28 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* room details */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel?.name || "Unknown Hotel"}{" "}
            <span className="font-inter text-sm">({room.roomType})</span>
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% off
          </p>
        </div>

        {/* room rating */}
        <div className="flex items-center mt-2 gap-1">
          <StarRating />
          <p className="ml-2">250+ reviews</p>
        </div>
        {/* rooms address */}
        <div className="flex items-center gap-1 text-gray-400 mt-2">
          <img src={assets.locationIcon} alt="" />
          <span>{room.hotel?.address || "Unknown Address"}</span>
        </div>

        {/* room images */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              alt="room images"
              className="w-full rounded-xl shadow-lg object-cover h-64 md:h-80 lg:h-[420px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images &&
              room.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt={`room image ${index + 1}`}
                  className={`w-full rounded-xl object-cover cursor-pointer h-36 md:h-44 lg:h-50 ${
                    mainImage === image ? "outline-3 outline-orange-500" : ""
                  }`}
                />
              ))}
          </div>
        </div>
        {/* room highlights */}
        <div className="flex flex-col md:flex-row  justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Indulge in a Nepalese Oasis of Refined Comfort.
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-6 mt-3">
              {room.amenities.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm"
                >
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className="w-4 h-4"
                  />
                  <span className="truncate">{item}</span>
                </span>
              ))}
            </div>
          </div>
          {/* room price */}
          <p className="text-2xl font-medium">
            {currency}
            {room.pricePerNight}/Night
          </p>
        </div>

        {/* checkin checkout form */}
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-4 md:p-6 rounded-xl mx-auto mt-12 max-w-6xl"
          action=""
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10 text-amber-600 font-medium w-full">
            <div className="flex flex-col w-full md:w-auto">
              <label htmlFor="checkInDate" className="font-medium">
                Check-in
              </label>

              <input
                onChange={(e) => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                type="date"
                id="checkInDate"
                placeholder="Check-In"
                required
                className="w-full md:w-52 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              />
            </div>

            {/* check out  */}
            <div className="hidden md:block w-px h-12 bg-gray-300/70"></div>
            <div className="flex flex-col w-full md:w-auto">
              <label htmlFor="checkOutDate" className="font-medium">
                Check-Out
              </label>

              <input
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate}
                disabled={!checkInDate}
                type="date"
                id="checkOutDate"
                placeholder="Check-Out"
                required
                className="w-full md:w-52 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              />
            </div>

            <div className="hidden md:block w-px h-12 bg-gray-300/70"></div>

            <div className="flex flex-col w-full md:w-auto">
              <label htmlFor="Guests" className="font-medium">
                Guests
              </label>

              <input
                onChange={(e) => setGuests(e.target.value)}
                value={guests}
                type="number"
                id="Guests"
                placeholder="1"
                required
                className="w-full md:max-w-[80px] rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-amber-500 hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md w-full md:w-auto mt-4 md:mt-0 px-6 py-3 md:py-4 text-base cursor-pointer"
          >
            {isAvailable ? "Book Now" : "Check Availability"}
          </button>
        </form>

        {/* common specification */}
        <div className="mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {roomCommonData.map((spec, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center ring-1 ring-amber-100">
                    <img src={spec.icon} alt={`${spec.title}-icon`} className="h-6 w-6" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-base font-medium text-slate-800 truncate">{spec.title}</p>
                  <p className="text-sm text-slate-500 mt-1">{spec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-start md:items-start gap-8">
          {/* hotel owner name (left on md+) */}
          <div className="md:w-1/3 w-full">
            <div className="flex flex-col items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex gap-4 items-center">
                <img
                  src={
                    room.hotel && room.hotel.owner
                      ? room.hotel.owner.image
                      : assets.userIcon
                  }
                  alt="Host"
                  className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover"
                />
                <div>
                  <p className="text-lg md:text-xl font-medium">
                    Hosted by {room.hotel?.name || "Unknown Hotel"}
                  </p>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <StarRating />
                    <p className="ml-2">200+ reviews</p>
                  </div>
                </div>
              </div>

              <button className="px-6 py-2.5 mt-2 rounded text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all cursor-pointer w-full">
                Contact Us
              </button>
            </div>
          </div>

          <div className="md:w-2/3 max-w-3xl border-y border-gray-300 py-10 text-gray-700">
            <p>
              Guests will be accommodated on the ground floor based on
              availability. Enjoy a comfortable two-bedroom apartment that
              captures the true essence of city living. The listed price is for
              two guests please select the number of guests to view the exact rate
              for larger groups.
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default RoomDetails;
