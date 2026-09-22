import React from 'react';
import { MenuItem } from '../../types';
import { Flame, Star, Clock, Plus, Sparkles } from 'lucide-react';

interface FeaturedSectionProps {
  dishes: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
  onViewAllMenu: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  dishes,
  onSelectDish,
  onViewAllMenu,
}) => {
  const featured = dishes.filter((d) => d.isFeatured || d.isPopular).slice(0, 6);

  return (
    <section className="py-16 bg-zinc-950 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-rose-500">
              <Sparkles className="w-3.5 h-3.5" /> Culinary Highlights
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Signature Dishes & Chef's Favorites
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Hand-selected crowd pleasers prepared with fresh ingredients, balanced marinades, and artisanal craftsmanship.
            </p>
          </div>

          <button
            onClick={onViewAllMenu}
            className="self-start md:self-auto px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-rose-400 hover:text-rose-300 font-semibold text-xs rounded-xl border border-zinc-800 transition-colors"
          >
            View Full Menu ({dishes.length} Items) →
          </button>
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((dish) => (
            <div
              key={dish.id}
              className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col group"
            >
              {/* Image Container with Badges */}
              <div
                className="relative aspect-16/10 overflow-hidden cursor-pointer"
                onClick={() => onSelectDish(dish)}
              >
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-80" />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {dish.isFeatured && (
                    <span className="px-2.5 py-0.5 bg-rose-600/90 text-white text-[11px] font-bold rounded-md backdrop-blur-md shadow-md flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Featured
                    </span>
                  )}
                  {dish.isPopular && (
                    <span className="px-2.5 py-0.5 bg-amber-500/90 text-zinc-950 text-[11px] font-bold rounded-md backdrop-blur-md shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-zinc-950" /> Popular
                    </span>
                  )}
                </div>

                {/* Prep time badge */}
                <div className="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur-md text-zinc-300 text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{dish.prepTimeMinutes}m</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => onSelectDish(dish)}
                      className="font-serif font-bold text-lg text-white group-hover:text-rose-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {dish.name}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-light">
                    {dish.description}
                  </p>
                </div>

                {/* Card Footer: Price & Customize Button */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Price</span>
                    <span className="text-xl font-bold text-white font-sans">
                      ${dish.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectDish(dish)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-950 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Customize</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
