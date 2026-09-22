import React from 'react';
import { ElafLogo } from '../common/ElafLogo';
import { Flame, Utensils, HeartHandshake, Award, Clock, MapPin, Phone } from 'lucide-react';
import { StoreService } from '../../services/storeService';

export const StorySection: React.FC = () => {
  const settings = StoreService.getSettings();

  const pillars = [
    {
      icon: Flame,
      title: '24-Hour Herb Marinade',
      desc: 'Our poultry and steaks rest for a full day in cold-pressed oils, mountain herbs, and sun-ripened peri-peri chilies for deep infusion.',
    },
    {
      icon: Utensils,
      title: 'Flame-Fired Cooking',
      desc: 'We sear over natural lump charcoal and wood embers, caramelizing the skin while locking in rich natural juices.',
    },
    {
      icon: HeartHandshake,
      title: 'Ethiopian Culinary Heritage',
      desc: 'Honoring time-tested Ethiopian flavors—authentic clarified butter (niter kibbeh), aromatic rosemary, and berbere spices.',
    },
    {
      icon: Award,
      title: 'Ethical Quality First',
      desc: '100% fresh, grain-fed meats and local organic produce delivered daily from vetted farms. Zero frozen compromises.',
    },
  ];

  return (
    <section className="py-20 bg-zinc-950 border-b border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-900/40 text-rose-400 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" /> Our Culinary Heritage
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              Rooted in Tradition,{' '}
              <span className="text-rose-500">Mastered by Fire.</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              At <strong className="text-white font-semibold">Elaf Restaurant</strong>, food is more than a meal—it is a celebration of warmth, fellowship, and artisanal craftsmanship. Our rooster emblem stands for pride, bold flavor, and the early-morning dedication of our kitchen staff.
            </p>

            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              Whether you are dining in our vibrant Bole restaurant, picking up a quick family feast, or ordering hot delivery to your doorstep, every single plate receives relentless attention to detail.
            </p>

            <div className="pt-2">
              <ElafLogo size="md" />
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 bg-zinc-900/70 rounded-2xl border border-zinc-800 hover:border-rose-900/60 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-600/10 flex items-center justify-center text-rose-500 border border-rose-600/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-white text-base">{pillar.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visit & Dine With Us Card */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            <div className="space-y-2 md:pr-6 pt-4 md:pt-0">
              <div className="flex items-center justify-center md:justify-start gap-2 text-rose-500 font-bold text-sm">
                <MapPin className="w-4 h-4" /> Location & Dine-In
              </div>
              <p className="text-sm text-zinc-300 font-medium">{settings.address}</p>
              <p className="text-xs text-zinc-500">Dedicated parking & patio seating available.</p>
            </div>

            <div className="space-y-2 md:px-6 pt-6 md:pt-0">
              <div className="flex items-center justify-center md:justify-start gap-2 text-amber-500 font-bold text-sm">
                <Clock className="w-4 h-4" /> Service Schedule
              </div>
              <p className="text-sm text-zinc-300 font-medium">{settings.openingHours}</p>
              <p className="text-xs text-zinc-500">Continuous kitchen service throughout the day.</p>
            </div>

            <div className="space-y-2 md:pl-6 pt-6 md:pt-0">
              <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-500 font-bold text-sm">
                <Phone className="w-4 h-4" /> Direct Hotline
              </div>
              <p className="text-sm text-zinc-300 font-medium">{settings.phone}</p>
              <p className="text-xs text-zinc-500">Call for VIP reservations or catering queries.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
