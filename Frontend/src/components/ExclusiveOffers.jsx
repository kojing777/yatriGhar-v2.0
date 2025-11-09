import React, { useEffect, useState } from "react";
import Title from "./Title";
import { exclusiveOffers } from "../assets/assets";
import { FaChevronRight } from "react-icons/fa";

const ExclusiveOffers = () => {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ 
    days: 0, 
    hours: 0, 
    minutes: 0, 
    seconds: 0 
  });

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3); // 3 days from now
    targetDate.setHours(23, 59, 59, 999); // Set to end of day

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Initial call to avoid delay
    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mount effect for animations
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  // Format number with leading zero
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <section className="flex flex-col items-center px-6 md:px-12 lg:px-20 pt-14 pb-16 bg-slate-50">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
          <Title
            align="left"
            title="YatriGhar Exclusive Offers"
            subTitle="Handpicked limited-time deals for unforgettable stays — grab them before they're gone!"
          />

          <a
            href="/offers"
            className="my-4 group inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-xl self-center md:self-auto mx-auto md:mx-0"
            aria-label="View all offers"
          >
            Grab All Offers
            <FaChevronRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full" role="list">
          {exclusiveOffers.map((item, i) => (
            <article
              key={item._id || i}
              role="listitem"
              aria-labelledby={`offer-title-${i}`}
              className={`group relative overflow-hidden rounded-xl text-white bg-no-repeat bg-cover bg-center p-6 flex flex-col justify-between shadow-lg transform transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0.5)), url(${item.image || "https://via.placeholder.com/800x600?text=Offer"})`,
                transitionDelay: `${i * 80}ms`,
                minHeight: 260,
              }}
            >
              <div className="flex items-start justify-between">
                <span className="inline-block px-3 py-1 bg-white text-gray-900 rounded-full font-medium text-sm shadow-sm">
                  {item.priceOff}% off
                </span>
                <span className="text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">Limited</span>
              </div>

              <div className="mt-4">
                <h3 id={`offer-title-${i}`} className="text-xl sm:text-2xl font-playfair font-semibold leading-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-white/90 leading-relaxed line-clamp-3">{item.description}</p>
                <p className="text-xs text-white/70 mt-3">Expires {item.expiryDate}</p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  className="bg-white text-gray-900 px-4 py-2 rounded-md font-medium duration-500 hover:scale-105 transition-transform"
                  aria-label={`View offer: ${item.title}`}
                >
                  View Offer
                </button>
                <FaChevronRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              
              {/* subtle hover lift */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </article>
          ))}
        </div>

        {/* Countdown Banner */}
        <div 
          className="mt-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            transitionDelay: '0.4s'
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-xl font-bold font-playfair mb-1">Limited Time Offers</h3>
              <p className="text-white/90">Book now before these deals expire!</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold bg-white/20 rounded-lg px-3 py-2 min-w-[60px]">
                  {formatNumber(timeLeft.days)}
                </div>
                <div className="text-xs mt-1">Days</div>
              </div>
              <div className="text-2xl text-white/70">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-white/20 rounded-lg px-3 py-2 min-w-[60px]">
                  {formatNumber(timeLeft.hours)}
                </div>
                <div className="text-xs mt-1">Hours</div>
              </div>
              <div className="text-2xl text-white/70">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-white/20 rounded-lg px-3 py-2 min-w-[60px]">
                  {formatNumber(timeLeft.minutes)}
                </div>
                <div className="text-xs mt-1">Minutes</div>
              </div>
              <div className="text-2xl text-white/70">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-white/20 rounded-lg px-3 py-2 min-w-[60px]">
                  {formatNumber(timeLeft.seconds)}
                </div>
                <div className="text-xs mt-1">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExclusiveOffers;