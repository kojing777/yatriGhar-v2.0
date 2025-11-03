import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const HotelReg = () => {
  // This component is used to register a hotel

  const { setShowHotelReg, setIsOwner, axios, getToken } = useAppContext();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const token = await getToken();
      const response = await axios.post(
        `/api/hotels`,
        { name, contact, address, city },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { data, status } = response;
      if (data?.success || status === 201 || data?.message) {
        toast.success(data?.message || "Hotel registered successfully");
        setShowHotelReg(false);
        setIsOwner(true);
      } else {
        toast.error(data?.message || "Failed to register hotel");
      }
    } catch (error) {
      const serverMessage = error?.response?.data?.message;
      toast.error(serverMessage || error.message || "Something went wrong");
    }
  };

  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-100   flex items-center justify-center bg-black/70"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        action=""
        className="flex bg-white rounded-xl max-w-4xl max-md:mx-2"
      >
        <img
          src={assets.regImage}
          alt="registration image"
          className="w-1/2 rounded-xl hidden md:block"
        />

        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
          <img
            src={assets.closeIcon}
            onClick={() => setShowHotelReg(false)}
            alt="close icon"
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
          />
          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

          {/* hotel name */}
          <div className="w-full mt-6">
            <label htmlFor="hotelName" className="font-medium text-gray-500">
              Hotel Name
            </label>
            <input
              type="text"
              id="hotelName"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full border border-gray-200 rounded  px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              placeholder="Enter your hotel name"
              required
            />
          </div>
          {/* phone */}
          <div className="w-full mt-6">
            <label htmlFor="contact" className="font-medium text-gray-500">
              Contact Number
            </label>
            <input
              type="text"
              id="contact"
              onChange={(e) => setContact(e.target.value)}
              value={contact}
              className="w-full border border-gray-200 rounded  px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              placeholder="Enter your contact number"
              required
            />
          </div>

          {/* address */}
          <div className="w-full mt-6">
            <label htmlFor="address" className="font-medium text-gray-500">
              Address
            </label>
            <input
              type="text"
              id="address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              className="w-full border border-gray-200 rounded  px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              placeholder="Enter your hotel address"
              required
            />
          </div>
          {/* select city drop down */}
          <div className="w-full mt-4 max-w-6- mr-auto">
            <label htmlFor="city" className="font-medium text-gray-500">
              City
            </label>
            <select
              id="city"
              onChange={(e) => setCity(e.target.value)}
              value={city}
              className="w-full border border-gray-200 rounded  px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            >
              <option value="">Select your city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <button className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded mr-auto cursor-pointer hover:bg-indigo-600 transition-all">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
