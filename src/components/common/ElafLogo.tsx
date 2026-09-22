import React from 'react';

interface ElafLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const ElafLogo: React.FC<ElafLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: { img: 'w-9 h-9', title: 'text-lg', subtitle: 'text-[9px] tracking-[0.25em]' },
    md: { img: 'w-12 h-12', title: 'text-xl', subtitle: 'text-[10px] tracking-[0.28em]' },
    lg: { img: 'w-16 h-16', title: 'text-2xl', subtitle: 'text-[11px] tracking-[0.3em]' },
    xl: { img: 'w-24 h-24', title: 'text-4xl', subtitle: 'text-[14px] tracking-[0.35em]' },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Circular Emblem */}
      <div className={`relative ${current.img} flex-shrink-0 drop-shadow-md rounded-full overflow-hidden border border-zinc-700/60 bg-zinc-950`}>
        <img
          src="/elaf-logo.svg"
          alt="Elaf Restaurant Official Logo"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={`font-serif font-black tracking-tight text-white ${current.title}`}>
              Elaf
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block mb-1"></span>
          </div>
          <span className={`font-sans font-bold text-zinc-400 uppercase ${current.subtitle}`}>
            RESTAURANT
          </span>
        </div>
      )}
    </div>
  );
};
