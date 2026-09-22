export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  prepTimeMinutes: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  ingredients: string[];
  addons: Addon[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CartItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart line ID (combines itemId + serialized addons)
  menuItem: MenuItem;
  selectedAddons: CartItemAddon[];
  specialInstructions?: string;
  quantity: number;
  unitPrice: number; // base price + addons
  totalPrice: number; // unitPrice * quantity
}

export type OrderType = 'DELIVERY' | 'PICKUP' | 'DINE_IN';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'UNPAID' | 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentMethod =
  | 'CASH_ON_DELIVERY'
  | 'CARD_ON_DELIVERY'
  | 'TELEBIRR'
  | 'CHAPA';

export interface OrderItemSnapshot {
  id: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  addons: { name: string; price: number }[];
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ELAF-8291"
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: OrderType;
  tableNumber?: string; // For QR dine-in
  deliveryAddress?: string;
  deliveryNotes?: string;
  specialInstructions?: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number; // 15 for 15%, or 5.00 for $5
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  dishName?: string;
  createdAt: string;
  isPublished: boolean;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  deliveryFee: number;
  minOrderAmount: number;
  currencySymbol: string;
  currencyCode: string;
  socials: {
    instagram?: string;
    facebook?: string;
    telegram?: string;
    whatsapp?: string;
  };
}
