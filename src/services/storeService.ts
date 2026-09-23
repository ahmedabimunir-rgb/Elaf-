import {
  Category,
  MenuItem,
  Order,
  Coupon,
  RestaurantSettings,
  Review,
  OrderStatus,
  OrderType,
  PaymentMethod,
  User,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
  INITIAL_REVIEWS,
} from '../data/seedData';

const STORAGE_KEYS = {
  CATEGORIES: 'elaf_categories_v2',
  MENU_ITEMS: 'elaf_menu_items_v2',
  ORDERS: 'elaf_orders_v2',
  COUPONS: 'elaf_coupons_v2',
  SETTINGS: 'elaf_settings_v3',
  REVIEWS: 'elaf_reviews_v2',
  USER: 'elaf_current_user_v3',
};

// Safe JSON local storage reader
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export class StoreService {
  // --- Category Operations ---
  static getCategories(): Category[] {
    return getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  static saveCategories(categories: Category[]): void {
    setStored(STORAGE_KEYS.CATEGORIES, categories);
  }

  static addCategory(name: string, icon: string = 'Utensils', description?: string): Category {
    const categories = this.getCategories();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      icon,
      description,
      sortOrder: categories.length + 1,
      isActive: true,
    };
    categories.push(newCategory);
    this.saveCategories(categories);
    return newCategory;
  }

  static updateCategory(id: string, updates: Partial<Category>): Category | null {
    const categories = this.getCategories();
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    categories[idx] = { ...categories[idx], ...updates };
    this.saveCategories(categories);
    return categories[idx];
  }

  static deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    if (filtered.length === categories.length) return false;
    this.saveCategories(filtered);
    return true;
  }

  // --- Menu Item Operations ---
  static getMenuItems(): MenuItem[] {
    return getStored<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, INITIAL_MENU_ITEMS);
  }

  static saveMenuItems(items: MenuItem[]): void {
    setStored(STORAGE_KEYS.MENU_ITEMS, items);
  }

  static getMenuItemById(id: string): MenuItem | undefined {
    return this.getMenuItems().find((item) => item.id === id);
  }

  static addMenuItem(itemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): MenuItem {
    const items = this.getMenuItems();
    const newItem: MenuItem = {
      ...itemData,
      id: `dish-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    this.saveMenuItems(items);
    return newItem;
  }

  static updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const items = this.getMenuItems();
    const idx = items.findIndex((item) => item.id === id);
    if (idx === -1) return null;
    items[idx] = {
      ...items[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveMenuItems(items);
    return items[idx];
  }

  static toggleItemAvailability(id: string): boolean {
    const items = this.getMenuItems();
    const idx = items.findIndex((item) => item.id === id);
    if (idx === -1) return false;
    items[idx].isAvailable = !items[idx].isAvailable;
    items[idx].updatedAt = new Date().toISOString();
    this.saveMenuItems(items);
    return items[idx].isAvailable;
  }

  static deleteMenuItem(id: string): boolean {
    const items = this.getMenuItems();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    this.saveMenuItems(filtered);
    return true;
  }

  // --- Orders & Anti-Tamper Pricing Engine ---
  static getOrders(): Order[] {
    return getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  static saveOrders(orders: Order[]): void {
    setStored(STORAGE_KEYS.ORDERS, orders);
  }

  static getOrderById(idOrNumber: string): Order | undefined {
    const normalized = idOrNumber.trim().toUpperCase();
    return this.getOrders().find(
      (o) => o.id === idOrNumber || o.orderNumber.toUpperCase() === normalized
    );
  }

  /**
   * ANTI-TAMPER ORDER CREATION:
   * The server never trusts client-sent prices.
   * It takes raw item IDs, looks up canonical prices in the database,
   * adds verified add-on prices, calculates genuine subtotal, validates coupon thresholds,
   * adds delivery fee, and snapshots the order.
   */
  static createVerifiedOrder(payload: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    orderType: OrderType;
    tableNumber?: string;
    deliveryAddress?: string;
    deliveryNotes?: string;
    specialInstructions?: string;
    paymentMethod: PaymentMethod;
    couponCode?: string;
    userId?: string;
    rawCartItems: {
      menuItemId: string;
      addonIds: string[];
      quantity: number;
      notes?: string;
    }[];
  }): { success: boolean; order?: Order; error?: string } {
    if (!payload.rawCartItems || payload.rawCartItems.length === 0) {
      return { success: false, error: 'Shopping cart is empty.' };
    }

    const menuItems = this.getMenuItems();
    const settings = this.getSettings();
    let verifiedSubtotal = 0;
    const orderItemSnapshots = [];

    for (const item of payload.rawCartItems) {
      const canonicalItem = menuItems.find((m) => m.id === item.menuItemId);
      if (!canonicalItem) {
        return { success: false, error: `Invalid item selected: ${item.menuItemId}` };
      }
      if (!canonicalItem.isAvailable) {
        return { success: false, error: `"${canonicalItem.name}" is currently unavailable.` };
      }

      // Calculate add-ons from canonical database item
      let unitAddonsPrice = 0;
      const verifiedAddons: { name: string; price: number }[] = [];

      for (const addId of item.addonIds) {
        const canonicalAddon = canonicalItem.addons?.find((a) => a.id === addId);
        if (canonicalAddon && canonicalAddon.isAvailable) {
          unitAddonsPrice += canonicalAddon.price;
          verifiedAddons.push({ name: canonicalAddon.name, price: canonicalAddon.price });
        }
      }

      const verifiedUnitPrice = canonicalItem.price + unitAddonsPrice;
      const safeQty = Math.max(1, Math.min(50, Math.floor(item.quantity || 1)));
      const lineTotal = verifiedUnitPrice * safeQty;

      verifiedSubtotal += lineTotal;
      orderItemSnapshots.push({
        id: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        menuItemId: canonicalItem.id,
        name: canonicalItem.name,
        unitPrice: verifiedUnitPrice,
        quantity: safeQty,
        totalPrice: lineTotal,
        addons: verifiedAddons,
        notes: item.notes,
      });
    }

    // Validate delivery minimum
    if (payload.orderType === 'DELIVERY' && verifiedSubtotal < settings.minOrderAmount) {
      return {
        success: false,
        error: `Minimum order for delivery is ${settings.currencySymbol}${settings.minOrderAmount.toFixed(2)}.`,
      };
    }

    // Validate coupon code
    let discountAmount = 0;
    let appliedCoupon: Coupon | undefined;

    if (payload.couponCode) {
      const couponCheck = this.validateCoupon(payload.couponCode, verifiedSubtotal);
      if (couponCheck.valid && couponCheck.coupon) {
        discountAmount = couponCheck.discount;
        appliedCoupon = couponCheck.coupon;
        // Increment coupon usage count
        this.incrementCouponUsage(appliedCoupon.id);
      }
    }

    const deliveryFee = payload.orderType === 'DELIVERY' ? settings.deliveryFee : 0;
    const finalTotal = Math.max(0, verifiedSubtotal - discountAmount + deliveryFee);

    // Generate readable order number: ELAF-XXXX
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ELAF-${randomNum}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: payload.userId,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail,
      orderType: payload.orderType,
      tableNumber: payload.tableNumber,
      deliveryAddress: payload.deliveryAddress,
      deliveryNotes: payload.deliveryNotes,
      specialInstructions: payload.specialInstructions,
      items: orderItemSnapshots,
      subtotal: Number(verifiedSubtotal.toFixed(2)),
      deliveryFee: Number(deliveryFee.toFixed(2)),
      discount: Number(discountAmount.toFixed(2)),
      total: Number(finalTotal.toFixed(2)),
      couponCode: appliedCoupon?.code,
      paymentMethod: payload.paymentMethod,
      paymentStatus:
        payload.paymentMethod === 'CASH_ON_DELIVERY' || payload.paymentMethod === 'CARD_ON_DELIVERY'
          ? 'PENDING'
          : 'PAID',
      orderStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.saveOrders(orders);
    this.notifyOrderCreated(newOrder);

    return { success: true, order: newOrder };
  }

  /**
   * Broadcasts a newly placed order to all listeners in this window,
   * across open tabs via BroadcastChannel, and via localStorage storage event.
   */
  static notifyOrderCreated(newOrder: Order): void {
    if (typeof window === 'undefined') return;

    // 1. Same-window CustomEvent
    try {
      window.dispatchEvent(new CustomEvent('elaf_order_created', { detail: newOrder }));
    } catch {}

    // 2. Cross-tab BroadcastChannel
    try {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('elaf_orders_channel');
        channel.postMessage({ type: 'NEW_ORDER', order: newOrder, timestamp: Date.now() });
        channel.close();
      }
    } catch {}

    // 3. Cross-tab localStorage trigger for other browser tabs
    try {
      localStorage.setItem(
        'elaf_order_event_ping',
        JSON.stringify({
          id: newOrder.id,
          orderNumber: newOrder.orderNumber,
          timestamp: Date.now(),
        })
      );
    } catch {}
  }

  /**
   * Subscribes to real-time incoming orders across all local channels.
   * Returns an unsubscribe function for React useEffect cleanup.
   */
  static subscribeToNewOrders(callback: (order: Order) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    // Same-window CustomEvent listener
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<Order>;
      if (customEvent.detail) {
        callback(customEvent.detail);
      }
    };
    window.addEventListener('elaf_order_created', handleCustomEvent);

    // Cross-tab BroadcastChannel listener
    let channel: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel('elaf_orders_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'NEW_ORDER' && event.data?.order) {
            callback(event.data.order);
          }
        };
      }
    } catch {}

    // Cross-tab storage event listener
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'elaf_order_event_ping' && e.newValue) {
        try {
          const pingData = JSON.parse(e.newValue);
          const currentOrders = this.getOrders();
          const target = currentOrders.find((o) => o.id === pingData.id) || currentOrders[0];
          if (target) {
            callback(target);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('elaf_order_created', handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
      if (channel) {
        try {
          channel.close();
        } catch {}
      }
    };
  }

  /**
   * Helper to simulate a realistic incoming customer order for staff testing.
   */
  static simulateTestOrder(): Order {
    const menuItems = this.getMenuItems();
    const dish = menuItems[0] || {
      id: 'dish-1',
      name: 'Full Fried Chicken with Rice',
      price: 1400,
    };

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ELAF-${randomNum}`;
    const testNames = ['Fatima Ahmed', 'Yohannes Girma', 'Hanan Mohammed', 'Abdulkarim Ali', 'Selamawit Desta'];
    const randomName = testNames[Math.floor(Math.random() * testNames.length)];
    const types: OrderType[] = ['DELIVERY', 'DINE_IN', 'PICKUP'];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: randomName,
      customerPhone: '0912455273',
      orderType: randomType,
      tableNumber: randomType === 'DINE_IN' ? `Table ${Math.floor(Math.random() * 12) + 1}` : undefined,
      deliveryAddress: randomType === 'DELIVERY' ? 'Shashe Garage area, Harar' : undefined,
      deliveryNotes: randomType === 'DELIVERY' ? 'Please call upon arrival' : undefined,
      specialInstructions: 'Extra spicy sauce dip and fresh limes, please.',
      items: [
        {
          id: `snap-${Date.now()}`,
          menuItemId: dish.id,
          name: dish.name,
          unitPrice: dish.price,
          quantity: 1,
          totalPrice: dish.price,
          addons: [{ name: 'Special House Sauce Dip', price: 50 }],
        },
      ],
      subtotal: dish.price + 50,
      deliveryFee: randomType === 'DELIVERY' ? 150 : 0,
      discount: 0,
      total: dish.price + 50 + (randomType === 'DELIVERY' ? 150 : 0),
      paymentMethod: 'TELEBIRR',
      paymentStatus: 'PAID',
      orderStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.saveOrders(orders);
    this.notifyOrderCreated(newOrder);
    return newOrder;
  }

  static updateOrderStatus(orderId: string, newStatus: OrderStatus): Order | null {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return null;

    orders[idx].orderStatus = newStatus;
    orders[idx].updatedAt = new Date().toISOString();

    // Auto mark paid on complete if was pending cash
    if (newStatus === 'COMPLETED' && orders[idx].paymentStatus === 'PENDING') {
      orders[idx].paymentStatus = 'PAID';
    }

    this.saveOrders(orders);
    return orders[idx];
  }

  static addOrderInternalNotes(orderId: string, notes: string): Order | null {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return null;

    orders[idx].internalNotes = notes;
    orders[idx].updatedAt = new Date().toISOString();
    this.saveOrders(orders);
    return orders[idx];
  }

  // --- Coupons ---
  static getCoupons(): Coupon[] {
    return getStored<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }

  static saveCoupons(coupons: Coupon[]): void {
    setStored(STORAGE_KEYS.COUPONS, coupons);
  }

  static validateCoupon(
    code: string,
    subtotal: number
  ): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
    const normalized = code.trim().toUpperCase();
    const coupon = this.getCoupons().find((c) => c.code.toUpperCase() === normalized);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code.' };
    }
    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: 'This coupon is no longer active.' };
    }
    if (new Date(coupon.expiresAt).getTime() < Date.now()) {
      return { valid: false, discount: 0, message: 'This coupon has expired.' };
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'This coupon has reached its usage limit.' };
    }
    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Requires minimum order of $${coupon.minOrderAmount.toFixed(2)}.`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, subtotal);

    return {
      valid: true,
      discount: Number(discount.toFixed(2)),
      message: `Coupon "${coupon.code}" applied!`,
      coupon,
    };
  }

  static incrementCouponUsage(couponId: string): void {
    const coupons = this.getCoupons();
    const idx = coupons.findIndex((c) => c.id === couponId);
    if (idx !== -1) {
      coupons[idx].usedCount += 1;
      this.saveCoupons(coupons);
    }
  }

  static createCoupon(couponData: Omit<Coupon, 'id' | 'usedCount'>): Coupon {
    const coupons = this.getCoupons();
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup-${Date.now()}`,
      code: couponData.code.trim().toUpperCase(),
      usedCount: 0,
    };
    coupons.unshift(newCoupon);
    this.saveCoupons(coupons);
    return newCoupon;
  }

  static toggleCouponActive(id: string): boolean {
    const coupons = this.getCoupons();
    const idx = coupons.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    coupons[idx].isActive = !coupons[idx].isActive;
    this.saveCoupons(coupons);
    return coupons[idx].isActive;
  }

  static deleteCoupon(id: string): boolean {
    const coupons = this.getCoupons();
    const filtered = coupons.filter((c) => c.id !== id);
    if (filtered.length === coupons.length) return false;
    this.saveCoupons(filtered);
    return true;
  }

  // --- Reviews ---
  static getReviews(): Review[] {
    return getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  static saveReviews(reviews: Review[]): void {
    setStored(STORAGE_KEYS.REVIEWS, reviews);
  }

  static addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'isPublished'>): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isPublished: true,
    };
    reviews.unshift(newReview);
    this.saveReviews(reviews);
    return newReview;
  }

  // --- Restaurant Settings ---
  static getSettings(): RestaurantSettings {
    return getStored<RestaurantSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  static saveSettings(settings: RestaurantSettings): void {
    setStored(STORAGE_KEYS.SETTINGS, settings);
  }

  // --- Current User / Demo Role Session ---
  static getCurrentUser(): User {
    const fallback: User = {
      id: 'demo-user-1',
      name: 'Ahmed Munir',
      email: 'ahmed@example.com',
      phone: '0912455273',
      role: 'CUSTOMER',
      createdAt: '2026-09-01T00:00:00Z',
    };
    return getStored<User>(STORAGE_KEYS.USER, fallback);
  }

  static setCurrentUser(user: User): void {
    setStored(STORAGE_KEYS.USER, user);
  }

  // Reset to initial factory defaults
  static resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.MENU_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.COUPONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}
