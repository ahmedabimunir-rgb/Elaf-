import React, { useState, useMemo } from 'react';
import {
  Order,
  MenuItem,
  Category,
  Coupon,
  RestaurantSettings,
  OrderStatus,
  Review,
} from '../../types';
import { StoreService } from '../../services/storeService';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  FolderTree,
  TicketPercent,
  Settings,
  BarChart3,
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  PackageCheck,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  Flame,
  Star,
  Eye,
  Search,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Save,
  RefreshCw,
  Phone,
  MapPin,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToCustomerView: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToCustomerView }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'menu' | 'categories' | 'coupons' | 'analytics' | 'settings'
  >('overview');

  // Live state
  const [orders, setOrders] = useState<Order[]>(() => StoreService.getOrders());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => StoreService.getMenuItems());
  const [categories, setCategories] = useState<Category[]>(() => StoreService.getCategories());
  const [coupons, setCoupons] = useState<Coupon[]>(() => StoreService.getCoupons());
  const [settings, setSettings] = useState<RestaurantSettings>(() => StoreService.getSettings());
  const [reviews, setReviews] = useState<Review[]>(() => StoreService.getReviews());

  // Selected order details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [internalNoteInput, setInternalNoteInput] = useState<string>('');

  // Search & Filters in Orders
  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Item editor modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemForm, setItemForm] = useState<{
    name: string;
    categoryId: string;
    description: string;
    price: number;
    imageUrl: string;
    prepTimeMinutes: number;
    isFeatured: boolean;
    isPopular: boolean;
    ingredientsText: string;
  }>({
    name: '',
    categoryId: categories[0]?.id || '',
    description: '',
    price: 15.0,
    imageUrl: '',
    prepTimeMinutes: 20,
    isFeatured: false,
    isPopular: false,
    ingredientsText: '',
  });

  // Category editor state
  const [newCatName, setNewCatName] = useState('');

  // Coupon creator state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponVal, setNewCouponVal] = useState(10);
  const [newCouponType, setNewCouponType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [newCouponMin, setNewCouponMin] = useState(20);

  // Refresh all state
  const reloadData = () => {
    setOrders(StoreService.getOrders());
    setMenuItems(StoreService.getMenuItems());
    setCategories(StoreService.getCategories());
    setCoupons(StoreService.getCoupons());
    setSettings(StoreService.getSettings());
    setReviews(StoreService.getReviews());
  };

  // Order state update handler
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = StoreService.updateOrderStatus(orderId, newStatus);
    if (updated) {
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      reloadData();
    }
  };

  const handleSaveInternalNote = () => {
    if (!selectedOrder) return;
    const updated = StoreService.addOrderInternalNotes(selectedOrder.id, internalNoteInput);
    if (updated) {
      setSelectedOrder(updated);
      setInternalNoteInput('');
      reloadData();
    }
  };

  // Menu item CRUD handlers
  const handleOpenCreateItem = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      categoryId: categories[0]?.id || '',
      description: '',
      price: 15.0,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      prepTimeMinutes: 20,
      isFeatured: false,
      isPopular: false,
      ingredientsText: 'Fresh herbs, spices, sea salt',
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      categoryId: item.categoryId,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      prepTimeMinutes: item.prepTimeMinutes,
      isFeatured: item.isFeatured,
      isPopular: item.isPopular,
      ingredientsText: item.ingredients?.join(', ') || '',
    });
    setIsItemModalOpen(true);
  };

  const handleSaveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredients = itemForm.ingredientsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    if (editingItem) {
      StoreService.updateMenuItem(editingItem.id, {
        name: itemForm.name,
        categoryId: itemForm.categoryId,
        description: itemForm.description,
        price: Number(itemForm.price),
        imageUrl: itemForm.imageUrl,
        prepTimeMinutes: Number(itemForm.prepTimeMinutes),
        isFeatured: itemForm.isFeatured,
        isPopular: itemForm.isPopular,
        ingredients,
      });
    } else {
      const slug = itemForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      StoreService.addMenuItem({
        name: itemForm.name,
        slug,
        categoryId: itemForm.categoryId,
        description: itemForm.description,
        price: Number(itemForm.price),
        imageUrl: itemForm.imageUrl,
        prepTimeMinutes: Number(itemForm.prepTimeMinutes),
        isAvailable: true,
        isFeatured: itemForm.isFeatured,
        isPopular: itemForm.isPopular,
        ingredients,
        addons: [
          { id: `add-${Date.now()}-1`, name: 'Special House Sauce Dip', price: 50, isAvailable: true },
          { id: `add-${Date.now()}-2`, name: 'Extra Melted Cheese', price: 100, isAvailable: true },
        ],
      });
    }

    setIsItemModalOpen(false);
    reloadData();
  };

  const handleToggleStock = (id: string) => {
    StoreService.toggleItemAvailability(id);
    reloadData();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      StoreService.deleteMenuItem(id);
      reloadData();
    }
  };

  // Category CRUD handlers
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    StoreService.addCategory(newCatName.trim());
    setNewCatName('');
    reloadData();
  };

  const handleToggleCategory = (cat: Category) => {
    StoreService.updateCategory(cat.id, { isActive: !cat.isActive });
    reloadData();
  };

  // Coupon CRUD handlers
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    StoreService.createCoupon({
      code: newCouponCode.trim(),
      description: `${newCouponVal}${newCouponType === 'PERCENTAGE' ? '%' : ' ETB'} discount on orders over ${newCouponMin} ETB`,
      discountType: newCouponType,
      discountValue: Number(newCouponVal),
      minOrderAmount: Number(newCouponMin),
      isActive: true,
      expiresAt: '2026-12-31T23:59:59Z',
    });
    setNewCouponCode('');
    reloadData();
  };

  const handleToggleCoupon = (id: string) => {
    StoreService.toggleCouponActive(id);
    reloadData();
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StoreService.saveSettings(settings);
    alert('Restaurant settings saved successfully!');
    reloadData();
  };

  // Analytics Metrics
  const totalRevenue = useMemo(
    () => orders.filter((o) => o.orderStatus !== 'CANCELLED').reduce((acc, o) => acc + o.total, 0),
    [orders]
  );
  const pendingCount = useMemo(() => orders.filter((o) => o.orderStatus === 'PENDING').length, [orders]);
  const activeCount = useMemo(
    () => orders.filter((o) => ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(o.orderStatus)).length,
    [orders]
  );
  const completedCount = useMemo(
    () => orders.filter((o) => o.orderStatus === 'COMPLETED').length,
    [orders]
  );

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = orderFilter === 'ALL' || order.orderStatus === orderFilter;
      const q = orderSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderFilter, orderSearch]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col">
      {/* Top Operations Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white font-serif font-black shadow-md">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-lg text-white">Elaf Restaurant Portal</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Staff & Admin
              </span>
            </div>
            <p className="text-xs text-zinc-400">Order Dispatch, Kitchen KDS, Menu & Analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {pendingCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/80 border border-rose-800 rounded-xl text-xs font-bold text-rose-300 animate-pulse">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>{pendingCount} New Orders Awaiting Action!</span>
            </div>
          )}

          <button
            onClick={onBackToCustomerView}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 rounded-xl border border-zinc-700 transition-colors"
          >
            ← Back to Customer Website
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-zinc-950 border-b border-zinc-800/80 px-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 py-2.5 min-w-max">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Operations Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
              activeTab === 'orders'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Orders Management</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'menu'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menu & Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'categories'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'coupons'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <TicketPercent className="w-4 h-4" />
            <span>Promotions & Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* ==================== 1. OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider flex items-center justify-between">
                  <span>Today's Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </span>
                <p className="text-2xl sm:text-3xl font-bold font-sans text-white">
                  {totalRevenue.toLocaleString()} ETB
                </p>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3 h-3" /> Live verified orders
                </span>
              </div>

              <div className="p-5 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider flex items-center justify-between">
                  <span>Pending Action</span>
                  <Clock className="w-4 h-4 text-rose-500" />
                </span>
                <p className="text-2xl sm:text-3xl font-bold font-sans text-rose-400">
                  {pendingCount}
                </p>
                <span className="text-[11px] text-zinc-400">Awaiting kitchen confirmation</span>
              </div>

              <div className="p-5 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider flex items-center justify-between">
                  <span>Active Orders</span>
                  <ChefHat className="w-4 h-4 text-amber-400" />
                </span>
                <p className="text-2xl sm:text-3xl font-bold font-sans text-amber-400">
                  {activeCount}
                </p>
                <span className="text-[11px] text-zinc-400">In preparation or out on road</span>
              </div>

              <div className="p-5 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider flex items-center justify-between">
                  <span>Completed Today</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </span>
                <p className="text-2xl sm:text-3xl font-bold font-sans text-emerald-400">
                  {completedCount}
                </p>
                <span className="text-[11px] text-zinc-400">Fulfilled & satisfied guests</span>
              </div>
            </div>

            {/* Quick Action Alert if Pending */}
            {pendingCount > 0 && (
              <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white">
                    <Clock className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {pendingCount} Incoming Order(s) Need Approval
                    </h3>
                    <p className="text-xs text-rose-200/80">
                      Confirm order reception so the kitchen team can begin cooking.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950 transition-colors whitespace-nowrap"
                >
                  Go to Orders Console →
                </button>
              </div>
            )}

            {/* Recent Orders Overview */}
            <div className="p-6 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-serif font-bold text-white">Recent Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-rose-400">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white block">{ord.customerName}</span>
                          <span className="text-[11px] text-zinc-500">{ord.customerPhone}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-zinc-800 px-2 py-0.5 rounded text-[11px]">
                            {ord.orderType}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {ord.items.length} items ({ord.items[0]?.name})
                        </td>
                        <td className="py-3 px-4 font-bold text-white">{ord.total.toLocaleString()} ETB</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.orderStatus === 'PENDING'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : ord.orderStatus === 'COMPLETED'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setActiveTab('orders');
                            }}
                            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. ORDERS MANAGEMENT TAB ==================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              {/* Status Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      orderFilter === st
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {st === 'ALL' ? 'All Orders' : st}
                  </button>
                ))}
              </div>

              {/* Order Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order #, customer, phone"
                  className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3.5 px-4">Order #</th>
                      <th className="py-3.5 px-4">Time</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Items Preview</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Current Status</th>
                      <th className="py-3.5 px-4 text-center">Quick Transition</th>
                      <th className="py-3.5 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-zinc-500 text-xs">
                          No orders found matching the filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-rose-400">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                            {new Date(ord.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-white block">{ord.customerName}</span>
                            <span className="text-[11px] text-zinc-500">{ord.customerPhone}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 bg-zinc-800 rounded text-[11px]">
                              {ord.orderType}
                            </span>
                            {ord.tableNumber && (
                              <span className="block text-[10px] text-amber-400 mt-0.5">
                                {ord.tableNumber}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 max-w-[200px] truncate">
                            {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                          </td>
                          <td className="py-3 px-4 font-bold text-white">{ord.total.toLocaleString()} ETB</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded text-[10px] font-bold inline-block ${
                                ord.orderStatus === 'PENDING'
                                  ? 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                                  : ord.orderStatus === 'CONFIRMED'
                                  ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                  : ord.orderStatus === 'PREPARING'
                                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                  : ord.orderStatus === 'READY'
                                  ? 'bg-purple-950 text-purple-400 border border-purple-800'
                                  : ord.orderStatus === 'OUT_FOR_DELIVERY'
                                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                                  : ord.orderStatus === 'COMPLETED'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-zinc-800 text-zinc-500'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {/* Fast One-Click Step Button */}
                            {ord.orderStatus === 'PENDING' && (
                              <button
                                onClick={() => handleUpdateStatus(ord.id, 'CONFIRMED')}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow transition-colors"
                              >
                                Accept Order
                              </button>
                            )}
                            {ord.orderStatus === 'CONFIRMED' && (
                              <button
                                onClick={() => handleUpdateStatus(ord.id, 'PREPARING')}
                                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow transition-colors"
                              >
                                Start Cooking
                              </button>
                            )}
                            {ord.orderStatus === 'PREPARING' && (
                              <button
                                onClick={() => handleUpdateStatus(ord.id, 'READY')}
                                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold shadow transition-colors"
                              >
                                Mark Ready
                              </button>
                            )}
                            {ord.orderStatus === 'READY' && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    ord.id,
                                    ord.orderType === 'DELIVERY' ? 'OUT_FOR_DELIVERY' : 'COMPLETED'
                                  )
                                }
                                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shadow transition-colors"
                              >
                                {ord.orderType === 'DELIVERY' ? 'Dispatch Driver' : 'Handover / Done'}
                              </button>
                            )}
                            {ord.orderStatus === 'OUT_FOR_DELIVERY' && (
                              <button
                                onClick={() => handleUpdateStatus(ord.id, 'COMPLETED')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow transition-colors"
                              >
                                Complete Order
                              </button>
                            )}
                            {ord.orderStatus === 'COMPLETED' && (
                              <span className="text-emerald-400 text-xs font-medium">Fulfilled</span>
                            )}
                            {ord.orderStatus === 'CANCELLED' && (
                              <span className="text-zinc-500 text-xs italic">Cancelled</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition-colors"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. MENU MANAGEMENT TAB ==================== */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              <div>
                <h3 className="font-serif font-bold text-white text-base">Menu Items Catalog</h3>
                <p className="text-xs text-zinc-400">
                  Total of {menuItems.length} dishes in database. Toggle availability, adjust prices, or add seasonal specialties.
                </p>
              </div>

              <button
                onClick={handleOpenCreateItem}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Food Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((dish) => (
                <div
                  key={dish.id}
                  className={`p-4 bg-zinc-900/80 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                    dish.isAvailable ? 'border-zinc-800' : 'border-red-900/40 bg-zinc-950/80 opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-bold text-white text-sm truncate">
                          {dish.name}
                        </h4>
                      </div>
                      <span className="font-sans font-bold text-amber-400 text-sm block mt-0.5">
                        {dish.price.toLocaleString()} ETB
                      </span>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{dish.description}</p>
                    </div>
                  </div>

                  {/* Badges row */}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    {dish.isAvailable ? (
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded border border-emerald-800">
                        In Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-red-950 text-red-400 rounded border border-red-800">
                        86'd (Sold Out)
                      </span>
                    )}
                    {dish.isFeatured && (
                      <span className="px-2 py-0.5 bg-rose-950 text-rose-400 rounded">Featured</span>
                    )}
                    {dish.isPopular && (
                      <span className="px-2 py-0.5 bg-amber-950 text-amber-400 rounded">Popular</span>
                    )}
                  </div>

                  {/* Actions row */}
                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleStock(dish.id)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        dish.isAvailable
                          ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {dish.isAvailable ? 'Mark Sold Out' : 'Restock'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditItem(dish)}
                        className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(dish.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 4. CATEGORIES MANAGEMENT TAB ==================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              <h3 className="font-serif font-bold text-white text-base mb-1">
                Menu Category Hierarchy
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Categories dynamically order the customer menu filter tabs. Disable or add categories as the kitchen evolves.
              </p>

              {/* Add category form */}
              <form onSubmit={handleAddCategory} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="New Category Name (e.g. Seafood, Soups)"
                  className="flex-1 px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Create
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat, idx) => {
                const count = menuItems.filter((m) => m.categoryId === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-zinc-500">#{idx + 1}</span>
                        <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                      </div>
                      <span className="text-xs text-zinc-400 block mt-0.5">
                        {count} {count === 1 ? 'dish' : 'dishes'} in category
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          cat.isActive
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== 5. PROMOTIONS & COUPONS TAB ==================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            {/* Create Coupon Form */}
            <div className="p-6 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-4">
              <h3 className="font-serif font-bold text-white text-base">Generate Discount Coupon</h3>
              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. FLASH25"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white uppercase focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (ETB)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Min Order (ETB)</label>
                  <input
                    type="number"
                    min={0}
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="sm:col-span-4 pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    Publish Promo Code
                  </button>
                </div>
              </form>
            </div>

            {/* Coupons List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-amber-400 tracking-wider">
                      {c.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.isActive
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-medium">{c.description}</p>

                  <div className="text-[11px] text-zinc-400 space-y-1 pt-1 border-t border-zinc-800/80">
                    <div className="flex justify-between">
                      <span>Redeemed Count:</span>
                      <span className="text-white font-bold">{c.usedCount} times</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Order Required:</span>
                      <span className="text-white">{c.minOrderAmount.toLocaleString()} ETB</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => handleToggleCoupon(c.id)}
                      className="px-3 py-1 rounded-lg text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                    >
                      {c.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 6. ANALYTICS TAB ==================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Gross Platform Revenue
                </span>
                <p className="text-3xl font-black font-sans text-white">
                  {totalRevenue.toLocaleString()} ETB
                </p>
                <p className="text-xs text-zinc-400">
                  Average Order Value:{' '}
                  <strong className="text-emerald-400">
                    {orders.length > 0 ? (totalRevenue / orders.length).toFixed(0) : '0'} ETB
                  </strong>
                </p>
              </div>

              <div className="p-6 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Order Volume Breakdown
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Completed Orders:</span>
                    <span className="font-bold text-emerald-400">{completedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Active in Kitchen:</span>
                    <span className="font-bold text-amber-400">{activeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Cancelled / Refunded:</span>
                    <span className="font-bold text-zinc-500">
                      {orders.filter((o) => o.orderStatus === 'CANCELLED').length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Customer Satisfaction
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xl font-bold text-white">4.9 / 5</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Based on verified diner reviews across all delivery and dine-in experiences.
                </p>
              </div>
            </div>

            {/* Popular Items Breakdown */}
            <div className="p-6 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-4">
              <h3 className="font-serif font-bold text-white text-base">
                Top Ordered Signature Dishes
              </h3>
              <div className="space-y-3">
                {menuItems.slice(0, 5).map((item, idx) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white">
                        #{idx + 1} {item.name}
                      </span>
                      <span className="text-amber-400 font-bold">{item.price.toLocaleString()} ETB</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-600 to-amber-500 rounded-full"
                        style={{ width: `${95 - idx * 15}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 7. RESTAURANT SETTINGS TAB ==================== */}
        {activeTab === 'settings' && (
          <div className="p-6 bg-zinc-900/60 rounded-2xl border border-zinc-800 max-w-2xl mx-auto">
            <h3 className="font-serif font-bold text-white text-lg mb-4">
              Restaurant Brand & Dispatch Configuration
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Address / Location</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Hotline Phone</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Official Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Delivery Fee (ETB)</label>
                  <input
                    type="number"
                    step="10"
                    value={settings.deliveryFee}
                    onChange={(e) =>
                      setSettings({ ...settings, deliveryFee: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Min Order for Delivery (ETB)</label>
                  <input
                    type="number"
                    step="1"
                    value={settings.minOrderAmount}
                    onChange={(e) =>
                      setSettings({ ...settings, minOrderAmount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Service Hours</label>
                <input
                  type="text"
                  value={settings.openingHours}
                  onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl uppercase tracking-wider transition-colors shadow-lg shadow-rose-950 flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Restaurant Configuration</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ==================== SELECTED ORDER DETAIL MODAL ==================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                  Order Details
                </span>
                <h3 className="font-mono font-bold text-lg text-rose-400">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info Box */}
            <div className="p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Customer Name:</span>
                <span className="font-bold text-white">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Phone:</span>
                <span className="font-mono text-zinc-200">{selectedOrder.customerPhone}</span>
              </div>
              {selectedOrder.deliveryAddress && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Address:</span>
                  <span className="text-zinc-200 text-right max-w-xs">{selectedOrder.deliveryAddress}</span>
                </div>
              )}
              {selectedOrder.tableNumber && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Table:</span>
                  <span className="text-amber-400 font-bold">{selectedOrder.tableNumber}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-zinc-400 uppercase tracking-wider block">
                Ordered Items
              </span>
              <div className="divide-y divide-zinc-800/80 max-h-48 overflow-y-auto custom-scrollbar">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="py-2 flex justify-between">
                    <div>
                      <span className="font-semibold text-white">
                        {item.quantity}x {item.name}
                      </span>
                      {item.addons && item.addons.length > 0 && (
                        <p className="text-[11px] text-zinc-500">
                          +{item.addons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-[10px] text-zinc-400 italic">"{item.notes}"</p>
                      )}
                    </div>
                    <span className="font-mono text-zinc-300">
                      {item.totalPrice.toLocaleString()} ETB
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Internal Staff Notes */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Internal Kitchen / Dispatch Note
              </label>
              {selectedOrder.internalNotes && (
                <p className="p-2.5 bg-amber-950/20 border border-amber-800/40 rounded-lg text-xs text-amber-300">
                  {selectedOrder.internalNotes}
                </p>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={internalNoteInput}
                  onChange={(e) => setInternalNoteInput(e.target.value)}
                  placeholder="Add note (e.g. VIP guest, extra spicy per phone call)"
                  className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none"
                />
                <button
                  onClick={handleSaveInternalNote}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white rounded-xl"
                >
                  Save Note
                </button>
              </div>
            </div>

            {/* State Change Buttons */}
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Change Order State
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED'] as OrderStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
                        selectedOrder.orderStatus === st
                          ? 'bg-rose-600 text-white shadow'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MENU ITEM ADD/EDIT MODAL ==================== */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="font-serif font-bold text-white text-base">
                {editingItem ? 'Edit Dish' : 'Create New Menu Item'}
              </h3>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="e.g. Flame-Grilled Peri Chicken"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Category</label>
                  <select
                    value={itemForm.categoryId}
                    onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Price (ETB)</label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={itemForm.imageUrl}
                  onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">
                  Core Ingredients (Comma separated)
                </label>
                <input
                  type="text"
                  value={itemForm.ingredientsText}
                  onChange={(e) => setItemForm({ ...itemForm, ingredientsText: e.target.value })}
                  placeholder="Chicken breast, Rosemary, Garlic, Pepper"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isFeatured}
                    onChange={(e) => setItemForm({ ...itemForm, isFeatured: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-800 text-rose-600 focus:ring-rose-500"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isPopular}
                    onChange={(e) => setItemForm({ ...itemForm, isPopular: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-800 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Mark as Popular</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl uppercase tracking-wider transition-colors shadow mt-2"
              >
                {editingItem ? 'Update Dish Details' : 'Add Dish to Menu'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
