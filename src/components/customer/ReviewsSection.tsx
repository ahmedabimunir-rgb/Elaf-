import React from 'react';
import { Review } from '../../types';
import { Star, MessageSquarePlus, CheckCircle, Quote } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: Review[];
  onOpenReviewModal: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onOpenReviewModal }) => {
  const published = reviews.filter((r) => r.isPublished);
  const avgRating =
    published.length > 0
      ? (published.reduce((acc, r) => acc + r.rating, 0) / published.length).toFixed(1)
      : '5.0';

  return (
    <section className="py-20 bg-zinc-950 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> Real Verified Experiences
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              What Our Guests Love About Elaf
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Authentic feedback from verified diners across delivery, pickup, and table service.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2.5 rounded-xl border border-zinc-800">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white text-base">{avgRating}</span>
              <span className="text-xs text-zinc-400">({published.length} reviews)</span>
            </div>

            <button
              onClick={onOpenReviewModal}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-rose-950"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {published.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-zinc-900/60 rounded-2xl border border-zinc-800 flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-zinc-800/80 -z-0 pointer-events-none" />

              <div className="space-y-3 relative z-10">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400' : 'text-zinc-700'}`}
                    />
                  ))}
                </div>

                <p className="text-sm text-zinc-300 italic leading-relaxed font-light">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span>{rev.customerName}</span>
                    <span title="Verified Customer" className="inline-flex">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    </span>
                  </div>
                  {rev.dishName && (
                    <span className="text-[11px] text-rose-400 truncate max-w-[180px] block mt-0.5">
                      {rev.dishName}
                    </span>
                  )}
                </div>

                <span className="text-zinc-500 font-mono text-[11px]">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
