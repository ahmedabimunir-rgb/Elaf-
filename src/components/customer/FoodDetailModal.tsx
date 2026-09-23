import React from 'react';
import { MenuItem } from '../../types';
import { X, Clock, Sparkles, AlertCircle, Phone, MapPin, CheckCircle2 } from 'lucide-react';

interface FoodDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ dish, onClose }) => {
  if (!dish) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700/60 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Header focused on Food Name & Price */}
          <div className="p-6 sm:p-8 bg-zinc-900/90 border-b border-zinc-800/80 pr-14">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="px-2.5 py-0.5 bg-rose-600/20 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-md uppercase tracking-wider">
                Freshly Prepared Daily
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs text-zinc-300 bg-zinc-800/80">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{dish.prepTimeMinutes} mins prep</span>
              </div>
              {dish.isAvailable ? (
                <span className="px-2.5 py-0.5 bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-medium rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> In Kitchen
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-medium rounded-md">
                  Currently Sold Out
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              {dish.name}
            </h2>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Price:</span>
              <span className="text-3xl font-black text-amber-400 font-sans tracking-tight">
                {dish.price.toLocaleString()} <span className="text-sm text-zinc-400 font-bold">ETB</span>
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Description & Flavor Profile
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed font-light">
                {dish.description}
              </p>
            </div>

            {/* Core Ingredients */}
            {dish.ingredients && dish.ingredients.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-zinc-900">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Ingredients & Seasonings
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {dish.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="bg-zinc-900 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-lg text-xs"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Add-ons & Sides info */}
            {dish.addons && dish.addons.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-zinc-900">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Available Sides & Add-ons
                  </h3>
                  <span className="text-[11px] text-zinc-500">Optional extra</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dish.addons.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs"
                    >
                      <span className="font-medium text-zinc-300">{addon.name}</span>
                      <span className="font-bold text-amber-400">+{addon.price.toLocaleString()} ETB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restaurant Order Hotline & Dine-in Box */}
            <div className="p-4 bg-gradient-to-r from-rose-950/20 via-zinc-900/40 to-zinc-900/60 rounded-2xl border border-rose-900/30 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Dine-In & Takeout Available
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Visit us at <strong>Shashe Garage, Harar</strong> or call our kitchen hotline directly for orders, reservations, and catering inquiries.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar: Call Hotline & Close */}
        <div className="p-4 sm:p-5 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold rounded-xl border border-zinc-700 transition-colors"
          >
            Close
          </button>

          <a
            href="tel:0912455273"
            className="flex-1 sm:flex-none px-6 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950 transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 0912455273</span>
          </a>
        </div>
      </div>
    </div>
  );
};
