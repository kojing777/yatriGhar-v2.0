import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import { FaCalendarAlt, FaClock, FaUser, FaChevronRight, FaArrowLeft, FaTags, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";


const AllBlogs = () => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    setMounted(true);
    // ensure we start scrolled to top when navigating to /blogs
    if (typeof window !== "undefined" && window.scrollTo) {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } catch {
        // fallback for older browsers
        window.scrollTo(0, 0);
      }
    }
  }, []);

  const blogPosts = [
    {
      id: 1,
      title: "Discover Nepal's Hidden Heritage Stays",
      excerpt: "Explore the untold stories behind Nepal's most preserved heritage properties and royal palaces turned into luxury stays.",
      image: "https://i.pinimg.com/1200x/3f/fe/89/3ffe89496781e7c666b3632a3b4ab643.jpg",
      readTime: "5 min read",
      author: "Travel Curator",
      date: "Dec 15, 2024",
      featured: true
    },
    {
      id: 2,
      title: "Monsoon Getaways: Best Hill Stations to Visit",
      excerpt: "Experience the magic of monsoon in these breathtaking hill stations with lush greenery and misty mountains.",
      image: "https://i.pinimg.com/736x/dd/c0/84/ddc084c183a8c9a59f53170133a30dd3.jpg",
      category: "Seasonal Guides",
      readTime: "4 min read",
      author: "Mountain Expert",
      date: "Dec 12, 2024",
      featured: false
    },
    {
      id: 3,
      title: "Cultural Festivals You Can't Miss in 2024",
      excerpt: "From Kathmandu’s lively street parades to Pokhara’s vibrant New Year festivities, immerse yourself in Nepal’s rich cultural heritage and timeless traditions.",
      image: "https://i.pinimg.com/736x/1c/ab/e9/1cabe972ebc95f0ac65fa3559f89fa00.jpg",
      category: "Cultural Insights",
      readTime: "6 min read",
      author: "Culture Guide",
      date: "Dec 10, 2024",
      featured: false
    },
    {
      id: 4,
      title: "Luxury on Wheels: Nepal’s Premium Scenic Journeys",
      excerpt: "Embark on breathtaking journeys across Nepal’s majestic landscapes — from the serene hills to the Himalayan foothills — where comfort meets adventure in truly luxurious travel experiences.",
      image: "https://i.pinimg.com/1200x/63/2c/14/632c14c7b55f738d5b411a7da75bd946.jpg",
      category: "Luxury Travel",
      readTime: "7 min read",
      author: "Railway Connoisseur",
      date: "Dec 8, 2024",
      featured: false
    },
    {
      id: 5,
      title: "Mountain Escapes: Unexplored Himalayan Gems",
      excerpt: "Discover serene mountain retreats and hidden valleys of Nepal, far from the tourist crowds — perfect for a peaceful escape amid breathtaking Himalayan views.",
      image: "https://i.pinimg.com/1200x/47/da/2d/47da2d09a9bb2394dd764adc789ab193.jpg",
      category: "Beach Getaways",
      readTime: "5 min read",
      author: "Coastal Explorer",
      date: "Dec 5, 2024",
      featured: false
    },
    {
      id: 6,
      title: "Wildlife Sanctuaries: Nepal’s Natural Treasures",
      excerpt: "Embark on thrilling wildlife adventures in Nepal's most renowned national parks and sanctuaries.",
      image: "https://i.pinimg.com/1200x/39/b9/93/39b9935b9efbea8b60de86ce0859c93c.jpg",
      category: "Wildlife & Nature",
      readTime: "6 min read",
      author: "Nature Guide",
      date: "Dec 3, 2024",
      featured: false
    }
  ];

  const categories = [
    "Heritage Travel", "Luxury Travel", "Seasonal Guides", 
    "Cultural Insights", "Beach Getaways", "Wildlife & Nature", "Adventure Travel"
  ];

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="min-h-screen mt-14 bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="mb-6 lg:mb-0">
            <Title 
              title="YatriGhar Travel Blog" 
              subTitle="Discover inspiring stories, expert guides, and travel insights from across India"
              align="left" 
            />
          </div>
          <Link 
            to="/" 
            className="group inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm text-amber-600 hover:text-amber-700 px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <MdKeyboardArrowLeft  className="transform group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>
        </div>

        {/* Search Bar */}
        <div className={`mb-12 transition-all duration-700 delay-200 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search blogs by title, category, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg focus:shadow-xl focus:border-amber-300 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {filteredPosts.map((post, index) => (
                <article 
                  key={post.id}
                  className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden group cursor-pointer transition-all duration-500 transform ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  } hover:shadow-xl`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-40 sm:h-48 md:h-56 object-cover transform group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        post.featured 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-white/90 backdrop-blur-sm text-slate-700'
                      } transition-all duration-300`}>
                        {post.featured && <FaTags className="w-3 h-3" />}
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-3 leading-tight group-hover:text-amber-700 transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <FaUser className="text-amber-500" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-amber-500" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaClock className="text-amber-500" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <Link
                      to={`/blogs/${post.id}`}
                      className="group inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 mt-5 rounded-2xl font-semibold shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-xl w-full md:w-auto justify-center"
                    >
                      Read Article
                      <FaChevronRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-200 rounded-2xl transition-all duration-300 pointer-events-none" />
                </article>
              ))}
            </div>

            {/* No Results Message */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No blogs found</h3>
                <p className="text-slate-600">Try adjusting your search terms or browse all categories</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className={`lg:sticky lg:top-6 space-y-6 transition-all duration-700 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {/* Categories */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h4 className="text-lg font-playfair font-semibold mb-4 flex items-center gap-2">
                  <FaTags className="text-amber-500" />
                  Popular Topics
                </h4>
                <ul className="space-y-3">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <button 
                        onClick={() => setSearchTerm(category)}
                        className="w-full text-left text-sm text-slate-600 hover:text-amber-600 px-3 py-2 rounded-lg hover:bg-amber-50 transition-all duration-300 transform hover:translate-x-2"
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                <h4 className="text-lg font-playfair font-semibold mb-3">Stay Updated</h4>
                <p className="text-amber-100 text-sm mb-4">Get the latest travel stories and guides delivered to your inbox.</p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-amber-100 focus:outline-none focus:bg-white/30 transition-all duration-300"
                  />
                  <button className="w-full bg-white text-amber-600 font-semibold py-3 rounded-xl hover:bg-amber-50 transition-all duration-300 transform hover:scale-105">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default AllBlogs;