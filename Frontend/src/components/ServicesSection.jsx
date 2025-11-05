export default function ServicesSection() {
  const services = [
    {
      title: "Easy Hotel Booking",
      desc: "Book hotels across Nepal instantly with our fast and reliable system.",
      icon: "🏨",
    },
    {
      title: "Comfort & Luxury",
      desc: "Enjoy verified stays with comfort, cleanliness, and top-rated amenities.",
      icon: "🛏️",
      highlight: true,
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
    <section className="flex flex-col items-center py-20 bg-white px-6 md:px-16 lg:px-24 text-center">
      <p className="text-sm font-semibold text-blue-500 uppercase tracking-wide mb-2">
        Our Services
      </p>
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
        We Offer the Best Hospitality Services
      </h2>
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                service.highlight
                  ? "bg-white shadow-xl border border-gray-100 scale-105"
                  : "bg-gray-50 hover:bg-white hover:shadow-lg"
              }`}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">
                {service.title}
              </h3>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
