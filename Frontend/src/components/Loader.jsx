import React from "react";
import { useAppContext } from "../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Loader = () => {
  const { navigate } = useAppContext();
  const { nextUrl } = useParams();
  const routerNavigate = useNavigate();

  useEffect(() => {
    if (nextUrl) {
      // Give webhook time to process (3-5 seconds is usually enough)
      // Then navigate and the page will refresh data
      const timer = setTimeout(() => {
        routerNavigate(`/${nextUrl}`, { replace: true });
        // Force a page reload to ensure fresh data
        window.location.reload();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [nextUrl, routerNavigate]);
  
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
      <p className="text-gray-600">Processing your payment...</p>
      <p className="text-sm text-gray-400">Please wait while we confirm your payment</p>
    </div>
  );
};

export default Loader;
