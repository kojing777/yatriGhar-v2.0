import React, { useEffect, useState } from "react";
import Title from "./Title";
import { assets, exclusiveOffers } from "../assets/assets";

const ExclusiveOffers = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // mount to trigger entrance animation
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="flex flex-col items-center px-6 md:px-16 lg:px-24 pt-20 pb-30 bg-slate-50">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <Title
            align="left"
            title="YatriGhar Exclusive Offers"
            subTitle="Handpicked limited-time deals for unforgettable stays — grab them before they're gone!"
          />

          <button className="group flex items-center gap-2 font-medium cursor-pointer max-md:mt-6">
            View All Offers
            <img
              className="group-hover:translate-x-1 transition-all"
              src={assets.arrowIcon}
              alt="arrowIcon"
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full">
          {exclusiveOffers.map((item, i) => (
            <article
              key={item._id}
              className={`relative overflow-hidden rounded-xl text-white bg-no-repeat bg-cover bg-center p-6 flex flex-col justify-between shadow-lg transform transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45)), url(${item.image || "https://via.placeholder.com/800x600?text=Offer"})`,
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div>
                <span className="inline-block px-3 py-1 bg-white text-gray-900 rounded-full font-medium">
                  {item.priceOff}% off
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-playfair font-semibold leading-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-white/90 leading-relaxed">{item.description}</p>
                <p className="text-xs text-white/70 mt-3">Expires {item.expiryDate}</p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button className="bg-white text-gray-900 px-4 py-2 rounded-md font-medium hover:scale-105 transition-transform">
                  View Offer
                </button>
                <img src={assets.arrowIcon} alt="arrow" className="w-5 h-5 invert" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExclusiveOffers;
