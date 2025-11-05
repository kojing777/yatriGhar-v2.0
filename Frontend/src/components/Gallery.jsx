import React, { useState } from "react";

const Gallery = () => {
  const [stopScroll, setStopScroll] = useState(false);
  const cardData = [
    {
      title: "Unlock Your Creative Flow",
      image:
        "https://images.unsplash.com/photo-1543487945-139a97f387d5?w=1200&auto=format&fit=crop&q=60",
    },
    {
      title: "Design Your Digital Future",
      image:
        "https://images.unsplash.com/photo-1529254479751-faeedc59e78f?w=1200&auto=format&fit=crop&q=60",
    },
    {
      title: "Build with Passion, Ship with Pride",
      image:
        "https://images.unsplash.com/photo-1618327907215-4e514efabd41?w=1200&auto=format&fit=crop&q=60",
    },
    {
      title: "Think Big, Code Smart",
      image:
        "https://images.unsplash.com/photo-1583407723467-9b2d22504831?w=1200&auto=format&fit=crop&q=60",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <style>{`
        .marquee-inner { animation: marqueeScroll linear infinite; }
        @keyframes marqueeScroll { 0% { transform: translateX(0%);} 100% { transform: translateX(-50%);} }
      `}</style>

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Memories Await</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Explore moments captured by travelers at YatriGhar — get inspired and start planning your next getaway.
          </p>
        </div>

        <div
          className="overflow-hidden w-full relative"
          onMouseEnter={() => setStopScroll(true)}
          onMouseLeave={() => setStopScroll(false)}
          onTouchStart={() => setStopScroll(true)}
          onTouchEnd={() => setStopScroll(false)}
        >
          {/* Left fade */}
          <div className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />

          <div
            className="marquee-inner flex w-fit"
            style={{
              animationPlayState: stopScroll ? "paused" : "running",
              animationDuration: Math.max(12000, cardData.length * 2200) + "ms",
            }}
          >
            <div className="flex items-stretch">
              {[...cardData, ...cardData].map((card, index) => (
                <div
                  key={index}
                  className="mx-3 w-44 sm:w-56 md:w-64 lg:w-72 h-56 sm:h-64 md:h-72 lg:h-80 relative group rounded-xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-105"
                >
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute left-0 bottom-0 p-4">
                    <p className="text-white text-sm sm:text-base font-semibold drop-shadow-md">{card.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right fade */}
          <div className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>

        <div className="mt-6 text-center">
          <button className="inline-block bg-primary text-white px-5 py-2 rounded-full shadow hover:brightness-95 transition">
            View Full Gallery
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
