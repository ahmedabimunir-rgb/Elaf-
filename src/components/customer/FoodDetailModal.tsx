import React, { useState } from 'react';
import { MenuItem, CartItemAddon } from '../../types';
import { useCart } from '../../context/CartContext';
import { X, Plus, Minus, Clock, Check, Sparkles, AlertCircle } from 'lucide-react';

interface FoodDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ dish, onClose }) => {
  const { addItem } = useCart();
  const [selectedAddons, setSelectedAddons] = useState<CartItemAddon[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  if (!dish) return null;

  const toggleAddon = (addon: { id: string; name: string; price: number }) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, { id: addon.id, name: addon.name, price: addon.price }];
      }
    });
  };

  const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);
  const unitPrice = dish.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(dish, selectedAddons, quantity, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-950/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700/60 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Hero Image */}
          <div className="relative aspect-16/9 w-full bg-zinc-900 overflow-hidden">
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="px-2.5 py-0.5 bg-rose-600/90 text-white text-xs font-bold rounded-md uppercase tracking-wider">
                  Freshly Prepared
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  {dish.name}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs text-zinc-300 border border-zinc-800">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{dish.prepTimeMinutes} mins prep</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Description & Ingredients */}
            <div className="space-y-3">
              <p className="text-sm text-zinc-300 leading-relaxed font-light">
                {dish.description}
              </p>

              {dish.ingredients && dish.ingredients.length > 0 && (
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 text-xs">
                  <span className="font-semibold text-zinc-300 block mb-1.5">
                    Core Ingredients:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dish.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customization Options & Add-ons */}
            {dish.addons && dish.addons.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-zinc-900">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Enhance Your Dish (Optional Add-ons)
                  </h3>
                  <span className="text-xs text-zinc-500">Choose any</span>
                </div>

                <div className="space-y-2">
                  {dish.addons.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => addon.isAvailable && toggleAddon(addon)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-rose-950/30 border-rose-600/80 text-white'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        } ${!addon.isAvailable ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-rose-600 border-rose-500 text-white'
                                : 'border-zinc-700 bg-zinc-800'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-xs sm:text-sm font-medium">{addon.name}</span>
                        </div>

                        <span className="text-xs sm:text-sm font-bold text-amber-400">
                          +{addon.price.toLocaleString()} ETB
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-2 pt-2 border-t border-zinc-900">
              <label
                htmlFor="instructions-textarea"
                className="text-xs font-bold text-white uppercase tracking-wider block"
              >
                Special Kitchen Instructions
              </label>
              <textarea
                id="instructions-textarea"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g., Extra crispy, no onions, sauce on the side, allergies..."
                rows={2}
                className="w-full p-3 bg-zinc-900 border border-zinc-800 focus:border-rose-500 rounded-xl text-xs text-white focus:outline-none placeholder:text-zinc-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Bar: Quantity & Add to Cart */}
        <div className="p-4 sm:p-6 bg-zinc-900/90 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl p-1 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 font-bold text-white text-base min-w-[32px] text-center font-sans">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(50, quantity + 1))}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Price & Add to Cart Action */}
          <button
            onClick={handleAddToCart}
            className="w-full sm:flex-1 py-3.5 px-6 bg-rose-600 hover:bg-rose-500 active:scale-98 text-white font-bold rounded-xl shadow-lg shadow-rose-950 transition-all flex items-center justify-between text-sm"
          >
            <span>Add to Cart</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-200 font-normal">
                ({unitPrice.toLocaleString()} ETB each)
              </span>
              <span className="font-black text-base font-sans">
                {totalPrice.toLocaleString()} ETB
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
