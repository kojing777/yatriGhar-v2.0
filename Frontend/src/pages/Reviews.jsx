import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import { FaQuoteLeft } from 'react-icons/fa';

const avatarColors = [
  'bg-amber-400',
  'bg-indigo-400',
  'bg-emerald-400',
  'bg-pink-400',
  'bg-cyan-400',
  'bg-rose-400',
];

function initials(name) {
  if (!name) return 'G';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('yatri_reviews') || '[]');
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load reviews from localStorage', err);
      setReviews([]);
    }
  }, []);

  return (
    <section className="py-20 px-4 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Title title="Guest Reviews" subTitle="Real experiences from our travelers" />

        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No reviews yet. Be the first to leave a review after your stay!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {reviews.map((r, i) => {
              const color = avatarColors[i % avatarColors.length];
              return (
                <article key={r.id} className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-start gap-4">
                    <div className={`${color} rounded-full w-14 h-14 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}>{initials(r.user)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{r.user}</p>
                          <p className="text-xs text-amber-600">{r.hotelName || 'Guest Stay'}</p>
                        </div>
                        <time className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</time>
                      </div>

                      <div className="mt-3 text-gray-700 text-sm leading-relaxed">
                        <FaQuoteLeft className="text-amber-200 inline-block mr-2" />
                        <span>{r.text}</span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-xs text-gray-400">Booking: {r.bookingId ? r.bookingId.slice(0,8) : '—'}</div>
                        <div className="text-xs text-amber-500 font-medium">Verified Guest</div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;