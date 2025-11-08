import React from "react";
import { FaArrowRight, FaCalendarAlt, FaChevronRight, FaClock, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import Title from "../components/Title";

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Discover India's Hidden Heritage Stays",
      excerpt: "Explore the untold stories behind India's most preserved heritage properties and royal palaces turned into luxury stays.",
      image: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&h=600&fit=crop&q=80",
      category: "Heritage Travel",
      readTime: "5 min read",
      author: "Travel Curator",
      date: "Dec 15, 2024",
      featured: true
    },
    {
      id: 2,
      title: "Monsoon Getaways: Best Hill Stations to Visit",
      excerpt: "Experience the magic of monsoon in these breathtaking hill stations with lush greenery and misty mountains.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80",
      category: "Seasonal Guides",
      readTime: "4 min read",
      author: "Mountain Expert",
      date: "Dec 12, 2024",
      featured: false
    },
    {
      id: 3,
      title: "Cultural Festivals You Can't Miss in 2024",
      excerpt: "From Rajasthan's vibrant fairs to Kerala's traditional celebrations, immerse yourself in India's rich cultural tapestry.",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop&q=80",
      category: "Cultural Insights",
      readTime: "6 min read",
      author: "Culture Guide",
      date: "Dec 10, 2024",
      featured: false
    },
    {
      id: 4,
      title: "Luxury on Wheels: India's Premium Train Journeys",
      excerpt: "Step aboard these magnificent trains that offer royal experiences while traversing through incredible landscapes.",
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop&q=80",
      category: "Luxury Travel",
      readTime: "7 min read",
      author: "Railway Connoisseur",
      date: "Dec 8, 2024",
      featured: false
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .blog-card {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>

      <section className="py-16 bg-gradient-to-b from-slate-50 to-amber-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <Title title="Travel Blog"
            subTitle="Discover inspiring travel stories, expert guides, and insider tips to make your Indian journey unforgettable." />
          </div>

          {/* Featured Blog Post */}
          <div className="blog-card mb-16">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="relative overflow-hidden">
                  <img 
                    className="w-full h-64 lg:h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                    src={blogPosts[0].image} 
                    alt={blogPosts[0].title}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                      {blogPosts[0].category}
                    </span>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <FaCalendarAlt className="w-3 h-3" />
                      {blogPosts[0].date}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl lg:text-3xl font-playfair font-bold text-gray-900 mb-4 leading-tight">
                    {blogPosts[0].title}
                  </h2>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {blogPosts[0].excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <FaUser className="w-3 h-3" />
                        {blogPosts[0].author}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {blogPosts[0].readTime}
                      </div>
                    </div>
                    
                    <button className="group flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105">
                      Read More
                      <FaChevronRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Link to="/blogs" className="group inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              View All Blog Posts
               <FaChevronRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogSection;