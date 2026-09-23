import React, { useState } from 'react';
import { ElafLogo } from './ElafLogo';
import { Search, Menu, X, Clock, MapPin, Phone, UtensilsCrossed } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenArchitectureModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'story', label: 'Our Story' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl">
      {/* Top Micro-Bar: Location, Hours, and Phone Hotline */}
      <div className="hidden md:flex items-center justify-between px-6 py-2 bg-zinc-900/90 text-xs text-zinc-400 border-b border-zinc-800/40">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-rose-500" /> Shashe Garage, Harar, Ethiopia
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Open Daily: 8:00 AM – 11:30 PM
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="tel:0912455273"
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" /> Call for Orders & Reservations: 0912455273
          </a>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg"
        >
          <ElafLogo size="md" />
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'text-white bg-zinc-800/90 shadow-sm border border-zinc-700/50'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900/70'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Controls: Menu Search & Direct Call Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('menu')}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-rose-400" />
            <span>Search Menu</span>
          </button>

          <a
            href="tel:0912455273"
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/40 transition-all"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>0912455273</span>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-300 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-left ${
                  activeTab === item.id
                    ? 'bg-rose-600 text-white'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2.5 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Shashe Garage, Harar, Ethiopia
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Open: 8:00 AM – 11:30 PM Daily
            </span>
            <a
              href="tel:0912455273"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call: 0912455273
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
