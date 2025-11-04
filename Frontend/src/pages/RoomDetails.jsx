import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms, navigate, getToken, axios } = useAppContext();
  // Assuming you want to use the room ID from the URL
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
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
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
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt="room images"
                  className={`w-full rounded-xl object-cover cursor-pointer ${
                    mainImage === image && "outline-3 outline-orange-500"
                  } `}
                />
              ))}
          </div>
        </div>
        {/* room highlights */}
        <div className="flex flex-col md:flex-row  justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Indulge in a World of Refined Comfort.
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 mt-3">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 "
                >
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className="h-5 w-5"
                  />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
          {/* room price */}
          <p className="text-2xl font-medium">${room.pricePerNight}/Night</p>
        </div>

        {/* checkin checkout form */}
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
          action=""
        >
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium">
                Check-in{" "}
              </label>

              <input
                onChange={(e) => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                type="date"
                id="checkInDate"
                placeholder="Check-In"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              />
            </div>

            {/* check out  */}
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div className="flex flex-col">
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
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              />
            </div>

            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            <div className="flex flex-col">
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
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md  max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer "
          >
            {isAvailable ? "Book Now" : "Check Availability"}
          </button>
        </form>

        {/* common specification */}
        <div className="mt-24 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img
                src={spec.icon}
                alt={`${spec.title}-icon`}
                className="w-6.5"
              />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 te4xt-gray-500">
          <p>
Guests will be accommodated on the ground floor based on availability. Enjoy a comfortable two-bedroom apartment that captures the true essence of city living. The listed price is for two guests please select the number of guests to view the exact rate for larger groups.
          </p>
        </div>

        {/* hotel owner name */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-4">
            <img
              src={
                room.hotel && room.hotel.owner
                  ? room.hotel.owner.image
                  : assets.userIcon
              }
              alt="Host"
              className="h-14 w-14 md:h-18 md:w-18 rounded-full"
            />
            <div>
              <p className="text-lg md:text-xl">
                Hosted by {room.hotel?.name || "Unknown Hotel"}
              </p>
              <div className="flex items-center mt-1">
                <StarRating />
                <p className="ml-2">200+ reviews</p>
              </div>
            </div>
          </div>
          <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">
            Contact Us
          </button>
        </div>
      </div>
    )
  );
};

export default RoomDetails;
