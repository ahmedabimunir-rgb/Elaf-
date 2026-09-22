import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { StoreService } from '../../services/storeService';
import {
  X,
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Bike,
  Sparkles,
  Search,
  AlertCircle,
  MessageSquarePlus,
} from 'lucide-react';

interface OrderTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrder?: Order | null;
  onOpenReviewModal?: (order: Order) => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  isOpen,
  onClose,
  initialOrder,
  onOpenReviewModal,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialOrder?.orderNumber || '');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(initialOrder || null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!searchQuery.trim()) return;

    const found = StoreService.getOrderById(searchQuery.trim());
    if (found) {
      setCurrentOrder(found);
    } else {
      setErrorMsg(`No order found matching "${searchQuery}". Please check your order code.`);
    }
  };

  const steps: { key: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'PENDING', label: 'Order Received', icon: Clock },
    { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'PREPARING', label: 'In Kitchen', icon: ChefHat },
    { key: 'READY', label: 'Dish Ready', icon: PackageCheck },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike },
    { key: 'COMPLETED', label: 'Delivered / Enjoyed', icon: Sparkles },
  ];

  const getStepIndex = (status: OrderStatus) => {
    const idx = steps.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const currentIdx = currentOrder ? getStepIndex(currentOrder.orderStatus) : 0;
  const isCancelled = currentOrder?.orderStatus === 'CANCELLED';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 flex items-center justify-center text-rose-500 border border-rose-600/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">Track Your Order</h2>
              <span className="text-xs text-zinc-400">Live Kitchen & Handover Updates</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lookup Bar */}
        <div className="p-6 pb-2 border-b border-zinc-900">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order # (e.g. ELAF-8472)"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-rose-500 rounded-xl text-xs text-white uppercase focus:outline-none placeholder:normal-case placeholder:text-zinc-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl border border-zinc-700 transition-colors"
            >
              Lookup
            </button>
          </form>

          {errorMsg && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
            </p>
          )}
        </div>

        {/* Order Details & Timeline */}
        {currentOrder ? (
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Order Identity Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 gap-3">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
                  Order Number
                </span>
                <span className="text-lg font-mono font-black text-rose-400">
                  {currentOrder.orderNumber}
                </span>
                <span className="text-xs text-zinc-400 block mt-0.5">
                  Placed {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-zinc-800 text-zinc-200 text-xs font-semibold rounded-lg">
                  {currentOrder.orderType === 'DELIVERY'
                    ? 'Home Delivery'
                    : currentOrder.orderType === 'DINE_IN'
                    ? `Dine-In (${currentOrder.tableNumber || 'Table'})`
                    : 'Self Pickup'}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    isCancelled
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : currentOrder.orderStatus === 'COMPLETED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {currentOrder.orderStatus}
                </span>
              </div>
            </div>

            {/* Cancelled State banner */}
            {isCancelled ? (
              <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-2xl text-center space-y-2">
                <h4 className="text-sm font-bold text-red-300">This Order Has Been Cancelled</h4>
                <p className="text-xs text-red-200/80">
                  Please reach out to restaurant reception at +251 911 234 567 if you need assistance.
                </p>
              </div>
            ) : (
              /* Visual Timeline Stepper */
              <div className="py-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-6">
                  Live Status Timeline
                </h3>

                <div className="space-y-6">
                  {steps.map((step, idx) => {
                    const isDone = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex items-start gap-4 relative">
                        {/* Connecting vertical line */}
                        {idx < steps.length - 1 && (
                          <div
                            className={`absolute left-4 top-8 w-0.5 h-10 -ml-[1px] transition-colors ${
                              idx < currentIdx ? 'bg-rose-600' : 'bg-zinc-800'
                            }`}
                          />
                        )}

                        {/* Step Circle */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                            isCurrent
                              ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-950 scale-110'
                              : isDone
                              ? 'bg-zinc-900 border-rose-600 text-rose-500'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold tracking-wide ${
                                isCurrent
                                  ? 'text-white'
                                  : isDone
                                  ? 'text-zinc-300'
                                  : 'text-zinc-500'
                              }`}
                            >
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] bg-rose-950 text-rose-400 px-2 py-0.5 rounded-full border border-rose-900/60 font-semibold animate-pulse">
                                In Progress
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Items Snapshot Card */}
            <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider">Ordered Items</h4>
              <div className="divide-y divide-zinc-800/60">
                {currentOrder.items.map((item, i) => (
                  <div key={i} className="py-2 flex justify-between items-start gap-2">
                    <div>
                      <span className="font-semibold text-white">
                        {item.quantity}x {item.name}
                      </span>
                      {item.addons && item.addons.length > 0 && (
                        <p className="text-[11px] text-zinc-400">
                          Addons: {item.addons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-[10px] text-zinc-500 italic">"{item.notes}"</p>
                      )}
                    </div>
                    <span className="font-mono text-zinc-300">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-800 flex justify-between font-bold text-sm text-white">
                <span>Total Paid / Due</span>
                <span className="text-amber-400">${currentOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Completed Order Review Call to Action */}
            {currentOrder.orderStatus === 'COMPLETED' && onOpenReviewModal && (
              <div className="p-4 bg-gradient-to-r from-amber-950/40 to-rose-950/40 border border-amber-800/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-amber-300">How was your Elaf experience?</h4>
                  <p className="text-[11px] text-zinc-300">
                    Share feedback to help our chef maintain culinary perfection.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenReviewModal(currentOrder);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Review Meal</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-zinc-500 text-xs">
            Enter an order number above (e.g., <code className="text-rose-400 font-mono font-bold">ELAF-8472</code>) to track your delivery in real-time.
          </div>
        )}
      </div>
    </div>
  );
};
