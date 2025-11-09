import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import HotelReg from "./components/HotelReg";
import Layout from "./pages/hotelOwner/Layout";
import AddRooms from "./pages/hotelOwner/AddRooms";
import ListRooms from "./pages/hotelOwner/ListRooms";
import Dashboard from "./pages/hotelOwner/Dashboard";
import About from "./pages/About";
import AllBlogs from "./pages/AllBlogs";
import GalleryAll from "./pages/GalleryAll";
import Reviews from "./pages/Reviews";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import Loader from "./components/Loader";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showHotelReg } = useAppContext();
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      {!isOwnerPath && <Navbar />}

      {showHotelReg && <HotelReg />}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<GalleryAll />} />
          <Route path="/blogs" element={<AllBlogs />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/loader/:nextUrl" element={<Loader />} />

          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRooms />} />
            <Route path="list-room" element={<ListRooms />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
