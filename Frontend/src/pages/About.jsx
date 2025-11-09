import React from "react";
import DeveloperCard from "../pages/DeveloperCard ";
import Title from "../components/Title";

export default function About() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <div className="bg-gradient-to-b from-white via-slate-50 to-indigo-50 min-h-screen mt-6 py-20 px-6 md:px-16 lg:px-24 transition-colors duration-700">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Title title="About YatriGhar" subTitle="Connecting Travelers with Comfort" />
          <p className="text-slate-600 text-base md:text-lg mt-4 leading-relaxed">
            YatriGhar connects travelers with authentic local experiences and comfortable stays — blending
            technology with Nepal’s warmth and hospitality.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-20">
          <div className="bg-white/80 p-8 rounded-2xl shadow-md hover:shadow-xl border border-slate-100 transition-transform duration-500 hover:-translate-y-1">
            <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">
              Our mission is to simplify travel bookings through technology — making every journey
              effortless, affordable, and memorable. From personalized stays to local experiences,
              YatriGhar ensures every traveler feels at home, wherever they go.
            </p>
          </div>

          <div className="bg-white/80 p-8 rounded-2xl shadow-md hover:shadow-xl border border-slate-100 transition-transform duration-500 hover:-translate-y-1">
            <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed">
              We aim to become Nepal’s most trusted hospitality platform — bridging the gap between
              travelers and local hosts, and promoting authentic travel experiences powered by modern
              technology.
            </p>
          </div>
        </div>

        {/* Developer Cards Section */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-slate-800">
            Meet Our <span className="text-indigo-600">Developers</span>
          </h2>
          <p className="text-slate-600 text-lg mt-3">
            The passionate team behind <strong>YatriGhar</strong> — crafting travel experiences with creativity and purpose.
          </p>
        </div>

        <DeveloperCard />
      </div>
    </>
  );
}
