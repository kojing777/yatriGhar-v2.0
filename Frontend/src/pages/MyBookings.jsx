import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { user, axios, getToken, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [activeReviewBooking, setActiveReviewBooking] = useState(null);
  const [reviewText, setReviewText] = useState("");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Refresh bookings when component becomes visible (e.g., returning from payment)
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchUserBookings();
      }
    };

    // Refresh when window gains focus (user returns from Stripe)
    window.addEventListener('focus', handleFocus);
    
    // Also refresh on mount if coming from payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      fetchUserBookings();
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handlePayment = async (bookingId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/booking/stripe-payment",
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Error initiating payment");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Payment initiation failed";
      toast.error(errorMessage);
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
                <p>Total : {currency}{booking.totalPrice}</p>
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
              <div className="flex flex-col items-start justify-center pt-3">
                {!activeReviewBooking || activeReviewBooking !== booking._id ? (
                  <button
                    onClick={() => { setActiveReviewBooking(booking._id); setReviewText(''); }}
                    className="mt-4 px-4 py-1.5 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Leave a Review
                  </button>
                ) : (
                  <div className="mt-4 w-full">
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write your review here..."
                      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      rows={4}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={async () => {
                          try {
                            // Save review to localStorage
                            const reviewsKey = 'yatri_reviews';
                            const existing = JSON.parse(localStorage.getItem(reviewsKey) || '[]');
                            const newReview = {
                              id: Date.now(),
                              bookingId: booking._id,
                              hotelId: booking.hotel?._id || booking.hotel,
                              hotelName: booking.hotel?.name || '',
                              user: user?.username || user?.email || 'Guest',
                              text: reviewText.trim(),
                              createdAt: new Date().toISOString(),
                            };
                            if (!newReview.text) {
                              toast.error('Review cannot be empty');
                              return;
                            }
                            existing.unshift(newReview);
                            localStorage.setItem(reviewsKey, JSON.stringify(existing));
                            toast.success('Review saved');
                            setActiveReviewBooking(null);
                            setReviewText('');
                          } catch (err) {
                            console.error('Save review error', err);
                            toast.error('Failed to save review');
                          }
                        }}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => { setActiveReviewBooking(null); setReviewText(''); }}
                        className="px-4 py-2 border rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
