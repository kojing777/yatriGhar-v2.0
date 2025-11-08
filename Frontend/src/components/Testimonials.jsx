import { useState } from "react";
import { testimonials } from "../assets/assets";
import StarRating from "./StarRating";
import { 
  FaQuoteLeft, 
  FaChevronRight, 
  FaHotel, 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRegSmileBeam,
  FaRegHeart,
  FaHeart
} from "react-icons/fa";
import { IoIosRibbon } from "react-icons/io";
import { GiSuitcase } from "react-icons/gi";

const Testimonials = () => {
  // State to track liked testimonials
  const [liked, setLiked] = useState(
    testimonials.reduce((acc, t) => {
      acc[t.id] = false;
      return acc;
    }, {})
  );

  return (
    <div className="relative overflow-hidden px-4 sm:px-6 md:px-16 lg:px-24 py-16 md:py-20 bg-white/80 backdrop-blur-sm">
      {/* Decorative elements */}
      <div className="absolute top-20 left-4 sm:left-10 hidden lg:block animate-float">
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full shadow-lg border border-white/20">
         
        </div>
      </div>
      <div className="absolute bottom-20 right-4 sm:right-10 hidden lg:block animate-float-delay">
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full shadow-lg border border-white/20">
          <FaRegSmileBeam className="text-amber-400 text-xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Title Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-800">
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                What Our Guests Say
              </span>
            </h2>
          </div>
          <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base">
            Hear from travelers who've experienced our hospitality firsthand
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={`relative bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 transform hover:-translate-y-1 animate-fade-in delay-${index * 100} group`}
            >

              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-amber-400"
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1">
                    <FaQuoteLeft className="text-white text-xs" />
                  </div>
                </div>
                <div>
                  <p className="font-playfair text-lg sm:text-xl font-semibold text-gray-800">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm flex items-center">
                    <FaMapMarkerAlt className="mr-1 text-amber-500" />
                    {testimonial.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-4">
                <StarRating rating={testimonial.rating} />
                <span className="text-amber-500 ml-2 text-sm font-medium">
                  {testimonial.rating?.toFixed(1) || '5.0'}
                </span>
              </div>

              <div className="relative mb-6">
                <FaQuoteLeft className="absolute -top-2 -left-2 text-gray-200 text-3xl -z-10" />
                <p className="text-gray-600 italic relative z-10 text-sm sm:text-base">
                  "{testimonial.review}"
                </p>
              </div>

              {testimonial.roomType && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 flex flex-wrap gap-2">
                  <span className="flex items-center">
                    <FaHotel className="mr-1 text-amber-500" />
                    {testimonial.roomType}
                  </span>
                  <span className="flex items-center">
                    <GiSuitcase className="mr-1 text-amber-500" />
                    {testimonial.duration || '3 nights'}
                  </span>
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-amber-500" />
                    {testimonial.date || 'Recently'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12 md:mt-16 animate-fade-in delay-500">
          <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center mx-auto group">
            Read More Reviews
            <FaChevronRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(-5px); }
          50% { transform: translateY(5px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 6s ease-in-out infinite 1s;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
      `}</style>
    </div>
  );
};

export default Testimonials;
