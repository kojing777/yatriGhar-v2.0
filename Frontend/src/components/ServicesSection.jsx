import React, { useState, useEffect } from "react";
import Title from "./Title";

export default function ServicesSection() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const services = [
    {
      title: "Easy Hotel Booking",
      desc: "Book hotels across Nepal instantly with our fast and reliable system.",
      icon: "🏨",
      highlight: true,
    },
    {
      title: "Comfort & Luxury",
      desc: "Enjoy verified stays with comfort, cleanliness, and top-rated amenities.",
      icon: "🛏️",
    },
    {
      title: "Local Experience",
      desc: "Discover nearby attractions, local events, and hidden gems effortlessly.",
      icon: "📍",
    },
    {
      title: "24/7 Support",
      desc: "Our dedicated support team is here round-the-clock for your assistance.",
      icon: "💬",
    },
  ];

  return (
    <section className="flex flex-col items-center py-20 bg-slate-50 px-6 md:px-16 lg:px-24 text-center">
      <Title title={"Our Services"} subTitle={"We Offer the Best Hospitality Services"} />
      <div className="h-8" />

      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative rounded-xl p-6 md:p-8 transition-all duration-500 transform ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${
                service.highlight
                  ? "bg-white/90 backdrop-blur-sm border border-amber-200 shadow-xl scale-105 z-10"
                  : "bg-white/90 backdrop-blur-sm border border-white/20 hover:shadow-2xl hover:-translate-y-2 shadow-lg"
              } group cursor-pointer overflow-hidden`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              
              <div className="flex items-start gap-4 relative z-10">
                <div
                  className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 transform group-hover:scale-110${
                    service.highlight
                      ? "bg-amber-100 text-amber-600 group-hover:bg-amber-200 group-hover:shadow-md"
                      : "bg-amber-100 text-amber-600 group-hover:bg-amber-200 group-hover:shadow-md"
                  } shadow-sm border-2 border-white/10`}
                >
                  {service.icon}
                </div>

                <div className="text-left">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-gray-900 mt-2 text-sm md:text-sm leading-relaxed max-w-xs transition-colors duration-300 group-hover:text-gray-700">
                    {service.desc}
                  </p>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className={`absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-300 ${
                service.highlight 
                  ? "group-hover:border-amber-300" 
                  : "group-hover:border-amber-200"
              }`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}