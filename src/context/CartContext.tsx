import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CartItemAddon, MenuItem, OrderType } from '../types';
import { StoreService } from '../services/storeService';

interface CartContextType {
  items: CartItem[];
  addItem: (
    menuItem: MenuItem,
    selectedAddons: CartItemAddon[],
    quantity: number,
    specialInstructions?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  appliedCouponCode: string;
  setAppliedCouponCode: (code: string) => void;
  couponMessage: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'elaf_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderType, setOrderType] = useState<OrderType>('DELIVERY');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');
  const [couponMessage, setCouponMessage] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to persist cart:', err);
    }
  }, [items]);

  const settings = StoreService.getSettings();

  const addItem = (
    menuItem: MenuItem,
    selectedAddons: CartItemAddon[],
    quantity: number,
    specialInstructions?: string
  ) => {
    // Generate unique line ID by sorting addon IDs
    const sortedAddonIds = [...selectedAddons].map((a) => a.id).sort().join('-');
    const cartItemId = `${menuItem.id}__addons_${sortedAddonIds}__inst_${specialInstructions?.trim() || ''}`;

    const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = menuItem.price + addonsPrice;

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === cartItemId);
      if (existingIdx !== -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalPrice: unitPrice * newQty,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: cartItemId,
        menuItem,
        selectedAddons,
        specialInstructions,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
      };
      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const qty = Math.min(50, Math.max(1, newQuantity));
          return {
            ...item,
            quantity: qty,
            totalPrice: item.unitPrice * qty,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCouponCode('');
    setCouponMessage('');
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);

  // Dynamic coupon validation
  let discount = 0;
  if (appliedCouponCode && subtotal > 0) {
    const check = StoreService.validateCoupon(appliedCouponCode, subtotal);
    if (check.valid) {
      discount = check.discount;
    }
  }

  const applyCoupon = (code: string): boolean => {
    if (!code.trim()) return false;
    const check = StoreService.validateCoupon(code, subtotal);
    if (check.valid) {
      setAppliedCouponCode(check.coupon!.code);
      setCouponMessage(`Discount of $${check.discount.toFixed(2)} applied!`);
      return true;
    } else {
      setCouponMessage(check.message);
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCouponCode('');
    setCouponMessage('');
  };

  const deliveryFee = orderType === 'DELIVERY' && items.length > 0 ? settings.deliveryFee : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        discount,
        total,
        orderType,
        setOrderType,
        tableNumber,
        setTableNumber,
        appliedCouponCode,
        setAppliedCouponCode,
        couponMessage,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
