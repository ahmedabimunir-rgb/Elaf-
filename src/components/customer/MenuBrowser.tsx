import React, { useState, useMemo } from 'react';
import { Category, MenuItem } from '../../types';
import { Search, Flame, Star, Clock, Info, X, AlertCircle } from 'lucide-react';

interface MenuBrowserProps {
  categories: Category[];
  menuItems: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
}

export const MenuBrowser: React.FC<MenuBrowserProps> = ({
  categories,
  menuItems,
  onSelectDish,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeCategories = useMemo(
    () => categories.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
    [categories]
  );

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'all' || item.categoryId === selectedCategory;

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.ingredients?.some((ing) => ing.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-zinc-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500 block mb-1">
              Chef-Crafted Selections
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Our Full Menu
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Browse by category, discover ingredients, and view current prices in ETB.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients..."
              className="w-full pl-10 pr-9 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-rose-500 text-white text-sm rounded-xl focus:outline-none transition-all placeholder:text-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Filter Tabs (Scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <span>All Dishes</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-zinc-950/40 text-inherit">
              {menuItems.length}
            </span>
          </button>

          {activeCategories.map((cat) => {
            const count = menuItems.filter((m) => m.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-950'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <span>{cat.name}</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-zinc-950/40 text-inherit">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-20 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800 max-w-lg mx-auto p-8 space-y-4">
            <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-white">No dishes found</h3>
            <p className="text-xs text-zinc-400">
              We couldn't find any dishes matching "{searchQuery}". Try searching for something else or clearing your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((dish) => (
            <div
              key={dish.id}
              className={`bg-zinc-900/70 hover:bg-zinc-900 rounded-2xl border transition-all duration-200 flex flex-col justify-between p-5 group relative ${
                dish.isAvailable
                  ? 'border-zinc-800 hover:border-zinc-700 shadow-sm hover:shadow-lg'
                  : 'border-zinc-800/40 opacity-70 bg-zinc-950/60'
              }`}
            >
              <div className="space-y-3">
                {/* Header row: Status tags & prep time */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {dish.isFeatured && (
                      <span className="px-2 py-0.5 bg-rose-600/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold rounded-md flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}
                    {dish.isPopular && (
                      <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold rounded-md flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-400" /> Popular
                      </span>
                    )}
                    {!dish.isAvailable && (
                      <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-800/60 text-[10px] font-bold rounded-md">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-zinc-400 text-[11px]">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{dish.prepTimeMinutes}m</span>
                  </div>
                </div>

                {/* Food Name & Description */}
                <div className="pt-1">
                  <h3
                    onClick={() => dish.isAvailable && onSelectDish(dish)}
                    className="font-serif font-bold text-lg text-white group-hover:text-rose-400 transition-colors cursor-pointer leading-snug"
                  >
                    {dish.name}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-light mt-1.5">
                    {dish.description}
                  </p>
                </div>

                {/* Ingredients preview */}
                {dish.ingredients && dish.ingredients.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1">
                    {dish.ingredients.slice(0, 3).map((ing, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded-md"
                      >
                        {ing}
                      </span>
                    ))}
                    {dish.ingredients.length > 3 && (
                      <span className="text-[10px] text-zinc-500 py-0.5">
                        +{dish.ingredients.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Row: Food Price & Details Button */}
              <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-semibold">
                    Price
                  </span>
                  <span className="text-xl font-black text-amber-400 font-sans tracking-tight">
                    {dish.price.toLocaleString()}{' '}
                    <span className="text-xs text-zinc-400 font-bold">ETB</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectDish(dish)}
                  className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold rounded-xl border border-zinc-700/80 transition-colors flex items-center gap-1.5"
                  title="View ingredients and details"
                >
                  <Info className="w-3.5 h-3.5 text-rose-400" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
