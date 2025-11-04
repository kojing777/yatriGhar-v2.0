import logo from "../assets/yatri.png";
import { assets } from "../assets/assets";
import { BsInstagram } from "react-icons/bs";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="text-gray-500/80 pt-8 bg-slate-50 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-wrap justify-between gap-12 md:gap-6">
        <div className="max-w-80">
          <img src={logo} alt="logo" className="mb-4 h-16 md:h-14" />
          <p className="text-sm">
           Explore the world’s most exceptional stays — from boutique hotels to luxurious villas and private retreats.
          </p>
          <div className="flex items-center gap-4 mt-4">
            {/* Instagram */}
            <BsInstagram className="h-6 w-6" />
            {/* Facebook */}
            <FaSquareFacebook className="h-6.5 w-6" />
            {/* TikTok */}
            <FaTiktok className="h-5 w-5" />
            {/* Twitter */}
            <FaXTwitter className="h-5 w-5" />
          </div>
        </div>

        <div>
          <p className="font-playfair text-lg text-gray-800">COMPANY</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link to="#">About</Link>
            </li>
            <li>
              <Link to="#">Careers</Link>
            </li>
            <li>
              <Link to="#">Press</Link>
            </li>
            <li>
              <Link to="#">Blog</Link>
            </li>
            <li>
              <Link to="#">Partners</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-lg font-playfair text-gray-800">SUPPORT</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link to="#">Help Center</Link>
            </li>
            <li>
              <Link to="#">Safety Information</Link>
            </li>
            <li>
              <Link to="#">Cancellation Options</Link>
            </li>
            <li>
              <Link to="#">Contact Us</Link>
            </li>
            <li>
              <Link to="#">Accessibility</Link>
            </li>
          </ul>
        </div>

        <div className="max-w-80">
          <p className="text-lg font-playfair text-gray-800">STAY UPDATED</p>
          <p className="mt-3 text-sm">
          Subscribe to our newsletter and receive exclusive offers and travel inspiration.
          </p>
          <div className="flex items-center mt-4">
            <input
              type="text"
              className="bg-white rounded-l border border-gray-300 h-9 px-3 outline-none"
              placeholder="Your email"
            />
            <button className="flex items-center justify-center bg-black h-9 w-9 aspect-square rounded-r">
              {/* Arrow icon */}
              <img
                src={assets.arrowIcon}
                alt="Arrow Icon"
                className="w-3.5 invert "
              />
            </button>
          </div>
        </div>
      </div>
      <hr className="border-gray-300 mt-8" />
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p>© {new Date().getFullYear()} YatriGhar. All rights reserved.</p>
        <ul className="flex items-center gap-4">
          <li>
            <Link to="#">Privacy</Link>
          </li>
          <li>
            <Link to="#">Terms</Link>
          </li>
          <li>
            <Link to="#">Sitemap</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
