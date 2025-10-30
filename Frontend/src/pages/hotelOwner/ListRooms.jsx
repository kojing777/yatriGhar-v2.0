import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import { roomsDummyData } from "../../assets/assets";
import toast from "react-hot-toast";

const ListRooms = () => {
  const [rooms, setRooms] = useState([]); // Start with empty array
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(null); // roomId being toggled
  const {currency } = useAppContext();

  // Fetching rooms of the hotel owner - now using static data
  const fetchRooms = () => {
    console.log("Fetching rooms...", roomsDummyData);
    setLoading(true);
    
    // Simulate a small delay for realistic loading experience
    setTimeout(() => {
      setRooms(roomsDummyData);
      setLoading(false);
      console.log("Rooms loaded:", roomsDummyData.length);
    }, 500);
  };

  // Optimistic UI for toggling room availability - now purely frontend
  const toggleAvailability = async (roomId) => {
    setToggleLoading(roomId);
    // Optimistically update UI
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room._id === roomId ? { ...room, isAvailable: !room.isAvailable } : room
      )
    );
    
    // Simulate API call delay and response
    setTimeout(() => {
      toast.success("Room availability updated (Demo Mode)");
      setToggleLoading(null);
    }, 1000);
  };

  useEffect(() => {
    // In demo mode, always fetch rooms regardless of user authentication
    fetchRooms();
  }, []);

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="List of Rooms"
        subTitle="View, edit, or manage your listed rooms. Ensure all details are accurate for a better booking experience."
      />
      <p className="text-gray-800 mt-8">All Rooms</p>

      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
        {loading ? (
          <div className="flex justify-center items-center py-10">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
                <th className="py-3 px-4 text-gray-800 font-medium">Facility</th>
                <th className="py-3 px-4 text-gray-800 font-medium">Price /Night</th>
                <th className="py-3 px-4 text-gray-800 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rooms.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {item.roomType}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                    {item.amenities.join(", ")}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center max-sm:hidden">
                    {currency} {item.pricePerNight}
                  </td>
                  <td className="py-3 px-4 text-red-500 border-t border-gray-300 text-center">
                    <label className="relative inline-flex cursor-pointer items-center text-gray-900 gap-3">
                      <input
                        onChange={() => toggleAvailability(item._id)}
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.isAvailable}
                        disabled={toggleLoading === item._id}
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                      <span className="dot absolute left-1 top-1 h-5 w-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListRooms;
