import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([
    "Kathmandu",
    "Pokhara",
  ]); // Default cities for demo
  const [rooms, setRooms] = useState([]);

  // Listen for route changes to update owner status
  useEffect(() => {
    if (location.pathname.startsWith("/owner")) {
      setIsOwner(true);
    }
  }, [location.pathname]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(`/api/rooms`);
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data?.message || "Failed to fetch rooms");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/api/user`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities);
      } else {
        // Retry fetching user data after 5 sec
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    axios,
    setIsOwner,
    showHotelReg,
    setShowHotelReg,
    fetchUser,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
