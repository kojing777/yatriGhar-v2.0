import React, { useState } from "react";
import Title from "./Title";
import { FaArrowRight } from "react-icons/fa6";

const Gallery = () => {
  const [stopScroll, setStopScroll] = useState(false);
  const cardData = [
    {
      title: "Luxury Heritage Stays",
      image:
        "https://i.pinimg.com/1200x/db/84/17/db8417d6c2c6b6eb211f4c75dd7c3c2c.jpg",
    },
    {
      title: "Mountain Retreat Escapes",
      image:
        "https://i.pinimg.com/1200x/4f/a5/43/4fa54307c3368ee814f57561391866bf.jpg",
    },
    {
      title: "Beachfront Paradise",
      image:
        "https://i.pinimg.com/736x/69/45/84/6945848220f1248d976b620297852023.jpg",
    },
    {
      title: "Cultural Heritage Tours",
      image:
        "https://i.pinimg.com/736x/ac/f7/03/acf7033f3bc52ae6ab19df597001c1c3.jpg",
    },
    {
      title: "Adventure Getaways",
      image:
        "https://i.pinimg.com/736x/7c/ee/73/7cee73b1f3046b3d54db0959308c6228.jpg",
    },
    {
      title: "Royal Palace Experiences",
      image:
        "https://i.pinimg.com/736x/4f/d2/ca/4fd2ca4ed6c192e7ddd880cbb4105831.jpg",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-amber-50/30">
      <style>{`
        @keyframes marqueeScroll { 
          0% { transform: translateX(0%); } 
          100% { transform: translateX(-50%); } 
        }
        .marquee-inner { 
          animation: marqueeScroll linear infinite; 
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Title
            title="YatriGhar Gallery"
            subTitle="Immerse yourself in breathtaking visuals of our premium stays and unforgettable travel experiences across India"
          />
        </div>

        {/* Marquee Gallery */}
        <div
          className="overflow-hidden w-full mb-10 relative"
          onMouseEnter={() => setStopScroll(true)}
          onMouseLeave={() => setStopScroll(false)}
          onTouchStart={() => setStopScroll(true)}
          onTouchEnd={() => setStopScroll(false)}
        >
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 h-full w-20 sm:w-24 md:w-32 z-10 pointer-events-none bg-gradient-to-r from-slate-50 to-transparent" />
          <div className="absolute right-0 top-0 h-full w-20 sm:w-24 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-slate-50 to-transparent" />

          {/* Marquee Container */}
          <div
            className="marquee-inner flex w-fit"
            style={{
              animationPlayState: stopScroll ? "paused" : "running",
              animationDuration: Math.max(18000, cardData.length * 2500) + "ms",
            }}
          >
            <div className="flex items-stretch space-x-4 sm:space-x-6 lg:space-x-8">
              {[...cardData, ...cardData].map((card, index) => (
                <div
                  key={index}
                  className="relative group rounded-2xl overflow-hidden shadow-xl transform transition-all duration-700 hover:scale-105 hover:shadow-2xl"
                  style={{
                    width: 'clamp(280px, 20vw, 320px)',
                    height: 'clamp(320px, 25vw, 380px)',
                    minWidth: '280px'
                  }}
                >
                  {/* Image */}
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-all duration-500" />

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-0 group-hover:translate-y-[-10px] transition-transform duration-500">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white text-lg sm:text-xl font-playfair font-semibold mb-2 drop-shadow-2xl leading-tight">
                        {card.title}
                      </h3>
                      <div className="w-12 h-0.5 bg-amber-400 mb-3 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-500 delay-200"></div>
                      <p className="text-amber-100 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-300">
                        Explore this destination
                      </p>
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/30 rounded-2xl transition-all duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <a
            href="/gallery"
            className="group inline-flex items-center gap-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl transform"
            aria-label="View full gallery"
          >
            <span className="relative overflow-hidden">
              <span className="inline-block transform group-hover:translate-y-[-100%] transition-transform duration-300">
                Explore Full Gallery
              </span>
              <span className="absolute top-0 left-0 inline-block transform translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300">
                Explore Full Gallery
              </span>
            </span>
            <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Gallery;