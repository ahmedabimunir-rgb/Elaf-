import React from 'react';
import { ElafLogo } from './ElafLogo';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Send, ShieldCheck, Heart } from 'lucide-react';
import { StoreService } from '../../services/storeService';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenArchitectureModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenArchitectureModal }) => {
  const settings = StoreService.getSettings();

  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-800/80 text-zinc-400">
      {/* Top Banner: Authentic Quality Assurance */}
      <div className="bg-gradient-to-r from-rose-950/40 via-zinc-900 to-rose-950/40 border-b border-zinc-800/60 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-600/20 flex items-center justify-center text-rose-500 border border-rose-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base">100% Fresh Daily & Handcrafted</h4>
              <p className="text-xs text-zinc-400">Every flame-grilled cut and sourdough base prepared from scratch in our kitchen.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('menu')}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-rose-950 transition-all"
            >
              Order Online Now
            </button>
            <button
              onClick={onOpenArchitectureModal}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg border border-zinc-700 transition-all"
            >
              View System Architecture
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <ElafLogo size="lg" />
            <p className="text-sm text-zinc-400 leading-relaxed pt-2">
              Elaf Restaurant is celebrated for our signature 24-hour peri-marinated flame-grilled chicken, prime steaks, artisan wood-fired pizzas, and heritage Ethiopian specialties.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors border border-zinc-800"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors border border-zinc-800"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.socials.telegram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors border border-zinc-800"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Opening Hours & Delivery Details */}
          <div className="space-y-4">
            <h3 className="text-white font-serif font-bold text-lg tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" /> Opening Hours
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li className="flex justify-between pb-1.5 border-b border-zinc-800/80">
                <span className="text-zinc-300">Monday – Friday</span>
                <span className="text-white font-medium">8:00 AM – 11:30 PM</span>
              </li>
              <li className="flex justify-between pb-1.5 border-b border-zinc-800/80">
                <span className="text-zinc-300">Saturday & Sunday</span>
                <span className="text-white font-medium">8:00 AM – Midnight</span>
              </li>
              <li className="flex justify-between pb-1.5 border-b border-zinc-800/80">
                <span className="text-zinc-300">Delivery Hours</span>
                <span className="text-emerald-400 font-medium">Available All Day</span>
              </li>
              <li className="pt-1 text-xs text-zinc-500">
                Average preparation + delivery time: 25 - 40 minutes.
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h3 className="text-white font-serif font-bold text-lg tracking-wide">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-rose-400 transition-colors"
                >
                  Explore Full Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('story')}
                  className="hover:text-rose-400 transition-colors"
                >
                  Our Culinary Heritage & Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-rose-400 transition-colors"
                >
                  Verified Guest Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-rose-400 transition-colors text-amber-400/90 font-medium"
                >
                  Staff / Admin Management Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Direct Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-serif font-bold text-lg tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" /> Location & Contact
            </h3>
            <div className="space-y-3 text-sm text-zinc-400">
              <p className="leading-snug text-zinc-300">
                {settings.address}
              </p>
              <div className="flex items-center gap-2 text-zinc-300">
                <Phone className="w-4 h-4 text-rose-500" />
                <a href={`tel:${settings.phone}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Mail className="w-4 h-4 text-rose-500" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </div>
              <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 text-xs text-zinc-400">
                <span className="font-semibold text-rose-400">Dine-In QR Available:</span> Scan your table code to order directly to your seat!
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Tech Stack */}
        <div className="mt-16 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Elaf Restaurant. All rights reserved. Crafted with authentic passion.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Stack: TypeScript • React • Tailwind • PostgreSQL • Prisma • Zod</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
