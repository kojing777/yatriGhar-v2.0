import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { user, axios, getToken } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const fetchUserBookings = async () => {
    try {
      const token = await getToken();
      const response = await axios.get("/api/booking/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error("Error fetching user bookings:", error);
    }
  };
  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const handlePayment = async (bookingId) => {
    try {
      const { data } = await axios.post(
        "/api/booking/stripe-payment",
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error("Error initiating payment");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Payment initiation failed");
    }
  };

  return (
    <div className="py-28 md:pb-35 px-4 md:pt-32 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Easily manage your bookings.plan your trips seamlessly with us"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
          <div className="w-1/3">Hotels</div>
          <div className="w-1/3">Dates & Times</div>
          <div className="w-1/3">Payments</div>
        </div>

        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
          >
            {/* Hotels Details */}
            <div className="flex flex-col md:flex-row">
              <img
                src={booking.room.images[0]}
                alt="hotel"
                className="w-28 h-24 rounded shadow object-cover"
              />
              <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                <p className="font-playfair text-2xl">
                  {booking.hotel ? booking.hotel.name : "Unknown Hotel"}
                  <span className="font-inter text-sm">
                    {" "}
                    ({booking.room.roomType})
                  </span>
                </p>

                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <img src={assets.locationIcon} alt="location icon" />
                  <span>
                    {booking.hotel ? booking.hotel.address : "Unknown Address"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <img src={assets.guestsIcon} alt="location icon" />
                  <span>Guests: {booking.guests}</span>
                </div>
                <p>Total : ${booking.totalPrice}</p>
              </div>
            </div>

            {/* Dates & Times */}
            <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
              <div>
                <p>Check-in: </p>
                <p className="text-gray-500 text-sm">
                  {new Date(booking.checkInDate).toDateString()}
                </p>
              </div>

              <div>
                <p>Check-out: </p>
                <p className="text-gray-500 text-sm">
                  {new Date(booking.checkOutDate).toDateString()}
                </p>
              </div>
            </div>

            {/* Payment Status */}
            <div className="flex flex-col items-start justify-center pt-3">
              <div className="flex items-center gap-2 ">
                <div
                  className={`h-3 w-3 rounded-full ${
                    booking.isPaid ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <p
                  className={`text-sm ${
                    booking.isPaid ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {booking.isPaid ? "Paid" : "Unpaid"}
                </p>
              </div>
              {/* <p className="text-sm font-medium">
                {booking.paymentStatus === "paid" ? "✅ Paid" : "❌ Unpaid"}
              </p> */}
              {!booking.isPaid && (
                <button onClick={() => handlePayment(booking._id)} className="mt-4 px-4 py-1.5 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-all cursor-pointer">
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
