import React from 'react';
import { ElafLogo } from '../common/ElafLogo';
import { Flame, Clock, Star, ArrowRight, ShieldCheck, Sparkles, ChefHat } from 'lucide-react';
import { MenuItem } from '../../types';

interface HeroSectionProps {
  onOrderNow: () => void;
  onExploreMenu: () => void;
  featuredDishes: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOrderNow,
  onExploreMenu,
  featuredDishes,
  onSelectDish,
}) => {
  const signatureDish = featuredDishes[0];

  return (
    <section className="relative w-full overflow-hidden bg-zinc-950 pt-8 pb-16 lg:py-24 border-b border-zinc-900">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-rose-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-amber-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand, Headline, Value Props & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-rose-900/40 text-rose-400 text-xs font-semibold shadow-inner">
              <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Authentic Flame-Grilled Excellence & Gourmet Dining</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
              Experience The Passion of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400">
                Elaf Restaurant
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              From our 24-hour peri-marinated flame-grilled chicken and dry-aged prime steaks to artisan wood-fired sourdough pizzas and Ethiopian royal tibs. Every dish is seasoned with heritage and fired to order.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOrderNow}
                id="hero-order-now-button"
                className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold rounded-xl shadow-xl shadow-rose-950/50 flex items-center justify-center gap-3 transition-all group"
              >
                <span>Order Online Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreMenu}
                id="hero-view-menu-button"
                className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold rounded-xl border border-zinc-800 transition-all flex items-center justify-center gap-2"
              >
                <ChefHat className="w-4 h-4 text-amber-400" />
                <span>Explore Full Menu</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-zinc-900 text-left">
              <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/60">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>4.9 / 5.0</span>
                </div>
                <span className="text-[11px] text-zinc-400 block mt-0.5">Over 1,200+ Reviews</span>
              </div>

              <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/60">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>25–35 Min</span>
                </div>
                <span className="text-[11px] text-zinc-400 block mt-0.5">Fast Hot Delivery</span>
              </div>

              <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/60">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Fresh Daily</span>
                </div>
                <span className="text-[11px] text-zinc-400 block mt-0.5">100% Halal & Pure</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase featuring Elaf Logo and Signature Dish Spotlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl p-6 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 shadow-2xl">
              {/* Top Card Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <ElafLogo size="sm" showText={false} />
                  <div>
                    <span className="text-xs text-rose-400 font-bold tracking-wider uppercase block">Chef's Signature</span>
                    <h3 className="text-white font-serif font-bold text-sm">
                      {signatureDish?.name || 'Full Fried Chicken with Rice'}
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-rose-600/20 text-rose-400 border border-rose-600/30 rounded-full text-xs font-bold">
                  {signatureDish ? `${signatureDish.price.toLocaleString()} ETB` : '1,400 ETB'}
                </span>
              </div>

              {/* Main Dish Imagery */}
              <div className="relative my-4 aspect-4/3 rounded-2xl overflow-hidden border border-zinc-800 group">
                <img
                  src={
                    signatureDish?.imageUrl ||
                    'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={signatureDish?.name || 'Elaf Signature Dish'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-200">
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    <Flame className="w-3.5 h-3.5 text-rose-500" /> Slow Braised & Roasted
                  </span>
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Fresh Daily
                  </span>
                </div>
              </div>

              {/* Quick dish selection carousel / thumbnails */}
              <div className="space-y-2">
                <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Popular Picks Right Now:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {featuredDishes.slice(1, 3).map((dish) => (
                    <button
                      key={dish.id}
                      onClick={() => onSelectDish(dish)}
                      className="flex items-center gap-2 p-2 bg-zinc-900/80 hover:bg-zinc-800 rounded-xl border border-zinc-800/80 text-left transition-colors group"
                    >
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-zinc-200 truncate group-hover:text-rose-400">
                          {dish.name}
                        </p>
                        <p className="text-[11px] font-bold text-amber-400">
                          {dish.price.toLocaleString()} ETB
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Customize CTA */}
              <button
                onClick={() => {
                  if (signatureDish) onSelectDish(signatureDish);
                }}
                className="mt-4 w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md"
              >
                Customize & Order {signatureDish ? `(${signatureDish.price.toLocaleString()} ETB)` : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
