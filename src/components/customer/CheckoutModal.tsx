import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { StoreService } from '../../services/storeService';
import { Order, PaymentMethod } from '../../types';
import {
  X,
  Truck,
  Store,
  QrCode,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Clock,
  MapPin,
  Check,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const {
    items,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    subtotal,
    deliveryFee,
    discount,
    total,
    appliedCouponCode,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const settings = StoreService.getSettings();

  // Form states
  const [customerName, setCustomerName] = useState(user.name || '');
  const [customerPhone, setCustomerPhone] = useState(user.phone || '+251 9');
  const [customerEmail, setCustomerEmail] = useState(user.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState('Bole Medhanialem area, Addis Ababa');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please provide your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setErrorMsg('Please provide a valid contact phone number.');
      return;
    }
    if (orderType === 'DELIVERY' && !deliveryAddress.trim()) {
      setErrorMsg('Please specify your delivery address.');
      return;
    }
    if (orderType === 'DINE_IN' && !tableNumber.trim()) {
      setErrorMsg('Please specify your table number for Dine-In.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Package raw cart items for anti-tamper server price recalculation
      const rawCartItems = items.map((item) => ({
        menuItemId: item.menuItem.id,
        addonIds: item.selectedAddons.map((a) => a.id),
        quantity: item.quantity,
        notes: item.specialInstructions,
      }));

      // Call the server/store pricing engine
      const res = StoreService.createVerifiedOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        orderType,
        tableNumber: orderType === 'DINE_IN' ? tableNumber.trim() : undefined,
        deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress.trim() : undefined,
        deliveryNotes: deliveryNotes.trim() || undefined,
        specialInstructions: specialInstructions.trim() || undefined,
        paymentMethod,
        couponCode: appliedCouponCode || undefined,
        userId: user.id,
        rawCartItems,
      });

      if (!res.success || !res.order) {
        setErrorMsg(res.error || 'Failed to process order. Please check inputs.');
        setIsSubmitting(false);
        return;
      }

      // Order successfully verified and snapshot saved!
      clearCart();
      setIsSubmitting(false);
      onClose();
      onOrderSuccess(res.order);
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-500 font-bold uppercase tracking-wider block">
              Final Step
            </span>
            <h2 className="text-xl font-serif font-bold text-white">Complete Your Order</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Fulfillment Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              1. Fulfillment Type
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setOrderType('DELIVERY')}
                className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  orderType === 'DELIVERY'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Delivery</span>
                <span className="text-[10px] text-zinc-300 font-normal">To your door</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('PICKUP')}
                className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  orderType === 'PICKUP'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Pickup</span>
                <span className="text-[10px] text-zinc-300 font-normal">At restaurant</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('DINE_IN')}
                className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  orderType === 'DINE_IN'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Dine-In QR</span>
                <span className="text-[10px] text-zinc-300 font-normal">To your table</span>
              </button>
            </div>
          </div>

          {/* 2. Customer Contact Information */}
          <div className="space-y-3 pt-2 border-t border-zinc-900">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              2. Contact Information
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Ahmed Munir"
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+251 9XX XXX XXX"
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Email (Optional for receipt)</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* 3. Location / Address / Table Details */}
          <div className="space-y-3 pt-2 border-t border-zinc-900">
            {orderType === 'DELIVERY' && (
              <>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  3. Delivery Destination
                </label>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Street Address / Area *</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Bole Medhanialem, next to Edna Mall, House 45"
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">
                    Landmark / Floor / Gate Instructions
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. 3rd floor, ring bell twice, blue gate"
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
                  />
                </div>
              </>
            )}

            {orderType === 'DINE_IN' && (
              <>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  3. Table Selection
                </label>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Table Number or Area *</label>
                  <input
                    type="text"
                    required
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 5, Patio Table 2, VIP Booth"
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
                  />
                </div>
              </>
            )}

            {orderType === 'PICKUP' && (
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Restaurant Pickup Location:</span>
                  <span>{settings.address}</span>
                  <span className="block text-zinc-500 mt-1">Ready in approximately 20–25 minutes.</span>
                </div>
              </div>
            )}
          </div>

          {/* 4. Payment Method Selection */}
          <div className="space-y-3 pt-2 border-t border-zinc-900">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                4. Payment Method
              </label>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Secure Checkout
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Cash on Delivery / Handover */}
              <div
                onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'bg-rose-950/30 border-rose-600 text-white'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-xs font-semibold block">Cash on Handover</span>
                    <span className="text-[10px] text-zinc-400">Pay driver or waiter</span>
                  </div>
                </div>
                {paymentMethod === 'CASH_ON_DELIVERY' && <Check className="w-4 h-4 text-rose-500" />}
              </div>

              {/* Card on Delivery */}
              <div
                onClick={() => setPaymentMethod('CARD_ON_DELIVERY')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'CARD_ON_DELIVERY'
                    ? 'bg-rose-950/30 border-rose-600 text-white'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="text-xs font-semibold block">Card on Delivery</span>
                    <span className="text-[10px] text-zinc-400">POS terminal with courier</span>
                  </div>
                </div>
                {paymentMethod === 'CARD_ON_DELIVERY' && <Check className="w-4 h-4 text-rose-500" />}
              </div>

              {/* Telebirr (Ethiopian Mobile Wallet) */}
              <div
                onClick={() => setPaymentMethod('TELEBIRR')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'TELEBIRR'
                    ? 'bg-rose-950/30 border-rose-600 text-white'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-semibold block">Telebirr (Ethiopia)</span>
                    <span className="text-[10px] text-zinc-400">Instant mobile payment</span>
                  </div>
                </div>
                {paymentMethod === 'TELEBIRR' && <Check className="w-4 h-4 text-rose-500" />}
              </div>

              {/* Chapa Payment Gateway */}
              <div
                onClick={() => setPaymentMethod('CHAPA')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'CHAPA'
                    ? 'bg-rose-950/30 border-rose-600 text-white'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="text-xs font-semibold block">Chapa Pay</span>
                    <span className="text-[10px] text-zinc-400">Debit card & local banks</span>
                  </div>
                </div>
                {paymentMethod === 'CHAPA' && <Check className="w-4 h-4 text-rose-500" />}
              </div>
            </div>
          </div>

          {/* 5. Order Summary Snapshot */}
          <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider mb-2">Order Breakdown</h4>
            <div className="flex justify-between text-zinc-400">
              <span>Items ({items.length})</span>
              <span className="text-white">{subtotal.toLocaleString()} ETB</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Coupon Discount ({appliedCouponCode})</span>
                <span>-{discount.toLocaleString()} ETB</span>
              </div>
            )}
            {orderType === 'DELIVERY' && (
              <div className="flex justify-between text-zinc-400">
                <span>Delivery Fee</span>
                <span className="text-white">{deliveryFee.toLocaleString()} ETB</span>
              </div>
            )}
            <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold text-white">
              <span>Grand Total</span>
              <span className="text-base text-amber-400 font-sans">{total.toLocaleString()} ETB</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-rose-600 hover:bg-rose-500 active:scale-98 disabled:opacity-50 text-white font-bold rounded-xl shadow-xl shadow-rose-950 text-sm transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Verifying & Placing Order...</span>
            ) : (
              <span>Place Order ({total.toLocaleString()} ETB)</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
