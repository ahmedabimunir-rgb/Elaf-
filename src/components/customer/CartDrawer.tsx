import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { StoreService } from '../../services/storeService';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle,
  AlertCircle,
  Truck,
  Store,
  QrCode,
} from 'lucide-react';
import { OrderType } from '../../types';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    total,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    appliedCouponCode,
    applyCoupon,
    removeCoupon,
    couponMessage,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const settings = StoreService.getSettings();

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon.trim());
    setInputCoupon('');
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="absolute inset-0"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-600/20 flex items-center justify-center text-rose-500 border border-rose-600/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-white">Your Order</h2>
                <span className="text-xs text-zinc-400">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in cart
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-zinc-400 hover:text-red-400 transition-colors p-1"
                  title="Clear Cart"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Order Type Selector (Delivery / Pickup / Dine-in QR) */}
          <div className="p-4 bg-zinc-900/40 border-b border-zinc-800">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
              Fulfillment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setOrderType('DELIVERY')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  orderType === 'DELIVERY'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Delivery</span>
              </button>

              <button
                onClick={() => setOrderType('PICKUP')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  orderType === 'PICKUP'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Pickup</span>
              </button>

              <button
                onClick={() => setOrderType('DINE_IN')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  orderType === 'DINE_IN'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Dine-In QR</span>
              </button>
            </div>

            {/* If Dine-In, show Table Number input */}
            {orderType === 'DINE_IN' && (
              <div className="mt-3 pt-2 border-t border-zinc-800/80">
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Enter Table # (e.g., Table 4)"
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 text-xs text-white rounded-lg focus:outline-none focus:border-rose-500 placeholder:text-zinc-500"
                />
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 border border-zinc-800">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-serif font-bold text-white">Your Cart is Empty</h3>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Browse our flame-grilled chicken, prime steaks, and artisan pizzas to start your order.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl flex flex-col space-y-2.5"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.menuItem.imageUrl}
                      alt={item.menuItem.name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                          {item.menuItem.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors p-0.5"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Addons List */}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="text-[11px] text-zinc-400 space-y-0.5 mt-0.5">
                          {item.selectedAddons.map((addon) => (
                            <div key={addon.id} className="flex justify-between text-zinc-400">
                              <span>+ {addon.name}</span>
                              <span className="text-amber-400">+${addon.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Special Instructions Note */}
                      {item.specialInstructions && (
                        <p className="text-[10px] text-zinc-500 italic mt-1 bg-zinc-950/60 p-1.5 rounded border border-zinc-800">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-white min-w-[20px] text-center font-sans">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-white text-sm font-sans">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer: Coupon, Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-zinc-900/90 border-t border-zinc-800 space-y-4">
              {/* Coupon Code Input */}
              <div>
                {appliedCouponCode ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Coupon "{appliedCouponCode}" applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-zinc-400 hover:text-red-400 font-bold text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        placeholder="Promo code (e.g. ELAF10, WELCOME5)"
                        className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white rounded-xl focus:outline-none focus:border-rose-500 uppercase placeholder:normal-case placeholder:text-zinc-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl border border-zinc-700 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponMessage && !appliedCouponCode && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3 h-3" /> {couponMessage}
                  </p>
                )}
              </div>

              {/* Price Calculation Summary */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedCouponCode})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                {orderType === 'DELIVERY' && (
                  <div className="flex justify-between">
                    <span>Estimated Delivery Fee</span>
                    <span className="text-white font-medium">${deliveryFee.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Total</span>
                  <span className="text-base text-amber-400 font-sans">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleCheckoutClick}
                id="drawer-checkout-button"
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 active:scale-98 text-white font-bold rounded-xl shadow-lg shadow-rose-950 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
