import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const HotelReg = () => {
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
      className="fixed top-0 bottom-0 left-0 right-0 z-[100] flex items-center justify-center bg-black/70"
    >
      {/* animated gradient background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-20 left-10"></div>
        <div className="absolute w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse bottom-20 right-10"></div>
      </div>

      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex bg-white rounded-2xl shadow-2xl overflow-hidden max-w-3xl w-full max-md:mx-4 animate-fadeIn"
      >
        <img
          src={assets.regImage}
          alt="registration image"
          className="w-1/2 hidden md:block object-cover"
        />

        <div className="relative flex flex-col items-center md:w-1/2 w-full p-6 md:p-10">
          <img
            src={assets.closeIcon}
            onClick={() => setShowHotelReg(false)}
            alt="close icon"
            className="absolute top-4 right-4 h-5 w-5 cursor-pointer hover:scale-110 transition-all duration-300"
          />

          <p className="text-3xl font-bold text-amber-600 mt-4">
            Register Your Hotel
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details to get started
          </p>

          {/* Hotel Name */}
          <div className="w-full mt-6">
            <label htmlFor="hotelName" className="font-medium text-gray-600">
              Hotel Name
            </label>
            <input
              type="text"
              id="hotelName"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full border border-gray-200 rounded px-3 py-2.5 mt-1 outline-none focus:border-amber-400 font-light transition-all"
              placeholder="Enter your hotel name"
              required
            />
          </div>

          {/* Contact Number */}
          <div className="w-full mt-6">
            <label htmlFor="contact" className="font-medium text-gray-600">
              Contact Number
            </label>
            <input
              type="text"
              id="contact"
              onChange={(e) => setContact(e.target.value)}
              value={contact}
              className="w-full border border-gray-200 rounded px-3 py-2.5 mt-1 outline-none focus:border-amber-400 font-light transition-all"
              placeholder="Enter your contact number"
              required
            />
          </div>

          {/* Address */}
          <div className="w-full mt-6">
            <label htmlFor="address" className="font-medium text-gray-600">
              Address
            </label>
            <input
              type="text"
              id="address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              className="w-full border border-gray-200 rounded px-3 py-2.5 mt-1 outline-none focus:border-amber-400 font-light transition-all"
              placeholder="Enter your hotel address"
              required
            />
          </div>

          {/* Select City */}
          <div className="w-full mt-6">
            <label htmlFor="city" className="font-medium text-gray-600">
              City
            </label>
            <select
              id="city"
              onChange={(e) => setCity(e.target.value)}
              value={city}
              className="w-full border border-gray-200 rounded px-3 py-2.5 mt-1 outline-none focus:border-amber-400 font-light bg-transparent transition-all"
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

          {/* Submit Button */}
          <button className="mt-8 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
