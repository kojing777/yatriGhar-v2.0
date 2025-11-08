import React from "react";
import Hero from "../components/Hero";
import FeaturedDestination from "../components/FeaturedDestination";
import ExclusiveOffers from "../components/ExclusiveOffers";
import Testimonials from "../components/Testimonials";
import NewsLetter from "../components/NewsLetter";
import RecommendedHotels from "../components/RecommendedHotel";
import Gallery from "../components/Gallery";
import ServicesSection from "../components/ServicesSection";
import BlogSection from "../pages/BlogSection";
const Home = () => {
  return (
    <>
      <Hero />
      <ServicesSection />
      <RecommendedHotels />
      <FeaturedDestination />
      <ExclusiveOffers />
      <Testimonials />
      <Gallery />
      <BlogSection />
      <NewsLetter />
    </>
  );
};

export default Home;
