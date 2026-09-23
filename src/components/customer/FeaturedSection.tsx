import React from 'react';
import { MenuItem } from '../../types';
import { Flame, Star, Clock, Info, Sparkles } from 'lucide-react';

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
              className="bg-zinc-900/70 hover:bg-zinc-900 rounded-2xl border border-zinc-800/80 hover:border-zinc-700/80 p-6 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl"
            >
              <div className="space-y-4">
                {/* Badges & Prep Time */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {dish.isFeatured && (
                      <span className="px-2.5 py-0.5 bg-rose-600/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold rounded-md flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Featured
                      </span>
                    )}
                    {dish.isPopular && (
                      <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold rounded-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" /> Popular
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-zinc-400 text-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{dish.prepTimeMinutes}m prep</span>
                  </div>
                </div>

                {/* Food Name & Description */}
                <div>
                  <h3
                    onClick={() => onSelectDish(dish)}
                    className="font-serif font-bold text-xl text-white group-hover:text-rose-400 transition-colors cursor-pointer leading-tight"
                  >
                    {dish.name}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-light mt-2">
                    {dish.description}
                  </p>
                </div>

                {/* Ingredients Pills */}
                {dish.ingredients && dish.ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {dish.ingredients.slice(0, 4).map((ing, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-zinc-400 bg-zinc-800/70 px-2 py-0.5 rounded-md"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Price & Details Button */}
              <div className="pt-5 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                    Price
                  </span>
                  <span className="text-2xl font-black text-amber-400 font-sans tracking-tight">
                    {dish.price.toLocaleString()}{' '}
                    <span className="text-xs text-zinc-400 font-bold">ETB</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectDish(dish)}
                  className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 hover:text-white text-xs font-semibold rounded-xl border border-zinc-700/80 transition-all flex items-center gap-1.5"
                  title="View ingredients and details"
                >
                  <Info className="w-3.5 h-3.5 text-rose-400" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
