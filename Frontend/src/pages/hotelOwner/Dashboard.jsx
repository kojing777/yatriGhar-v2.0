import { useState, useEffect } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { currency, user, axios, getToken } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    bookings: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get("/api/booking/hotel", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });
        if (data.success) {
          setDashboardData(data.dashboardData);
        } else {
          toast.error(data?.message || "Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, axios, getToken]);

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="Monitor your room listing,track booking and analyze revenue-all in one plcae. stay updated with real-time insights to ensure smooth oprations."
      />

      <div className="flex gap-4 my-8">
        {/* total bookings */}
        <div className="bg-primary/3 border border-primary/10 rounded p-4 flex  pr-8">
          <img
            src={assets.totalBookingIcon}
            alt=""
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-amber-500 text-lg">Total Bookings</p>
            <p className="text-neutral-500 text-base">
              {dashboardData.totalBookings}
            </p>
          </div>
        </div>
        {/* total revenue */}

        <div className="bg-primary/3 border border-primary/10 rounded p-4 flex  pr-8">
          <img
            src={assets.totalRevenueIcon}
            alt=""
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-amber-500 text-lg">Total Revenue</p>
            <p className="text-neutral-500 text-base">
              {currency} {dashboardData.totalRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* recent bookings */}
      <h2 className="text-blue-950/70 text-xl font-medium mb-5">
        Recent Bookings
      </h2>
      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium text-center ">
                User Name
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Roon Name
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Total Amount
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {dashboardData.bookings.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t text-center border-gray-300">
                  {item.user.username}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t text-center border-gray-300 max-sm:hidden">
                  {item.room.roomType}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  {currency} {item.totalPrice}
                </td>
                <td className="py-3 px-4 border-t border-gray-300 text-center">
                  <button
                    className={`inline-block py-1 px-3 text-xs rounded-full ${
                      item.isPaid
                        ? "bg-green-200 text-green-600"
                        : "bg-amber-200 text-yellow-600"
                    }`}
                  >
                    {item.isPaid ? "completed" : "pending"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
