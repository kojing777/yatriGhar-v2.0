import React, { useState } from "react";
import { LiaBoxOpenSolid } from "react-icons/lia";
import { FaRegHand } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-hot-toast";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/newsletter/subscribe', { email });

      if (response.data.success) {
        setIsSubscribed(true);
        setEmail("");
        toast.success("Successfully subscribed! Check your email for exclusive offers.");
      } else {
        toast.error(response.data.message || "Failed to subscribe");
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(error.response?.data?.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
            Stay <span className="text-amber-700">Inspired!</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join our newsletter and be the first to discover new destinations,
            exclusive offers, and travel inspiration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Subscription Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
            {isSubscribed ? (
              <div className="bg-green-50 border border-green-100 p-4 rounded-lg mb-6">
                <p className="text-green-700 font-medium text-center">
                  🎉 Thanks for subscribing! Check your email for exclusive
                  offers.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-lg font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                    isLoading
                      ? "bg-amber-200 cursor-not-allowed text-amber-700"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white"
                  } focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 shadow-sm`}
                >
                  {isLoading ? "Subscribing..." : "Subscribe Now"}
                </button>
              </form>
            )}
          </div>

          {/* Benefits Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <LiaBoxOpenSolid className="h-6.5 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Exclusive Home Stay Offers
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Unlock special discounts and early access to our best home
                    stay deals every month.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <FaRegHand className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Travel Tips & Inspiration
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Receive curated travel guides, destination highlights, and
                    tips for your next adventure—no spam, just inspiration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
