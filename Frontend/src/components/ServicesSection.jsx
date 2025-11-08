import Title from "./Title";

export default function ServicesSection() {
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
              className={`rounded-xl p-6 md:p-8 transition-all duration-200 transform ${
                service.highlight
                  ? "bg-white/90 backdrop-blur-sm border border-amber-200 shadow-xl scale-90"
                  : "bg-white/150 backdrop-blur-sm border border-white/20 hover:shadow-xl hover:-translate-y-3 shadow-lg"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl ${
                    service.highlight
                      ? "bg-amber-100 text-amber-600"
                      : "bg-amber-100 text-amber-600"
                  } shadow-sm border-2 border-white/10`}
                >
                  {service.icon}
                </div>

                <div className="text-left">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-900 mt-2 text-sm md:text-sm leading-relaxed max-w-xs">
                    {service.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
