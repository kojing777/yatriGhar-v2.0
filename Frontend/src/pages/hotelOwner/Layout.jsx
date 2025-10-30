import Navbar from "../../components/hotelOwner/Navbar";
import Sidebar from "../../components/hotelOwner/Sidebar";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";

const Layout = () => {
  const { isOwner, setIsOwner } = useAppContext();

  useEffect(() => {
    // In demo mode, automatically set user as owner when accessing /owner route
    if (!isOwner) {
      setIsOwner(true);
    }
  }, [isOwner, setIsOwner]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 pt-10 md:px-10 p-4 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
