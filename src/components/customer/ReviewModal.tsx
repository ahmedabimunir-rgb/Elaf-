import React, { useState } from 'react';
import { Order } from '../../types';
import { StoreService } from '../../services/storeService';
import { X, Star, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  onReviewSubmitted: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  order,
  onReviewSubmitted,
}) => {
  const [customerName, setCustomerName] = useState(order?.customerName || '');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [selectedDish, setSelectedDish] = useState(order?.items[0]?.name || 'Elaf Signature Flame-Grilled Peri Chicken');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please provide your name.');
      return;
    }
    if (!comment.trim() || comment.length < 5) {
      setErrorMsg('Please write a brief comment about your food and service.');
      return;
    }

    StoreService.addReview({
      orderId: order?.id || `order-${Date.now()}`,
      orderNumber: order?.orderNumber || 'ELAF-VERIFIED',
      customerName: customerName.trim(),
      rating,
      comment: comment.trim(),
      dishName: selectedDish,
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      onReviewSubmitted();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 flex items-center justify-center text-rose-500 border border-rose-600/30">
              <Star className="w-4 h-4 fill-rose-500" />
            </div>
            <h2 className="text-lg font-serif font-bold text-white">Rate Your Experience</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-white">Thank You!</h3>
            <p className="text-xs text-zinc-400">Your review has been verified and published.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 bg-red-950/40 p-2.5 rounded-xl border border-red-800/60">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errorMsg}
              </p>
            )}

            {/* Rating Stars */}
            <div className="space-y-1 text-center py-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                How would you rate your feast?
              </label>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                          : 'text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs text-amber-400 font-semibold block pt-1">
                {rating === 5
                  ? 'Exceptional — 5 Stars!'
                  : rating === 4
                  ? 'Very Good — 4 Stars'
                  : rating === 3
                  ? 'Good — 3 Stars'
                  : 'Needs Improvement'}
              </span>
            </div>

            {/* Name Input */}
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Sara Haile"
                className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Dish selection */}
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Favorite Dish</label>
              <input
                type="text"
                value={selectedDish}
                onChange={(e) => setSelectedDish(e.target.value)}
                placeholder="Dish name (e.g., Flame-Grilled Peri Chicken)"
                className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Review & Comments *</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell other food lovers what made your dish memorable..."
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-950 flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Submit Review</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
