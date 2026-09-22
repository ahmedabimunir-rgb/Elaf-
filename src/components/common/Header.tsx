import React, { useState } from 'react';
import { ElafLogo } from './ElafLogo';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Search, Shield, BookOpen, Menu, X, Clock, MapPin, Phone } from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenArchitectureModal: () => void;
  onOpenOrderTracker: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenArchitectureModal,
  onOpenOrderTracker,
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, setRole, isAdmin, isStaff } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'story', label: 'Our Story' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as UserRole);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl">
      {/* Top Micro-Bar: Contact, Delivery Status, and Learning Guide */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 bg-zinc-900/90 text-xs text-zinc-400 border-b border-zinc-800/40">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-rose-500" /> Bole Medhanialem, Addis Ababa
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Open: 8:00 AM – 11:30 PM Daily
          </span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <Phone className="w-3.5 h-3.5 text-emerald-500" /> +251 911 234 567
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Architecture Guide modal trigger */}
          <button
            onClick={onOpenArchitectureModal}
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-medium transition-colors bg-rose-950/40 px-2.5 py-0.5 rounded-full border border-rose-800/40"
            title="Learn full-stack backend architecture concepts"
          >
            <BookOpen className="w-3 h-3" /> Full-Stack Architecture Guide
          </button>

          {/* Quick Role Switcher for Developer Testing */}
          <div className="flex items-center gap-1.5 bg-zinc-800/70 px-2 py-0.5 rounded-md border border-zinc-700/50">
            <Shield className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] text-zinc-300 font-medium">Role:</span>
            <select
              value={user.role}
              onChange={handleRoleChange}
              className="bg-transparent text-[11px] font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="CUSTOMER" className="bg-zinc-900 text-white">Customer View</option>
              <option value="STAFF" className="bg-zinc-900 text-amber-300">Kitchen / Staff View</option>
              <option value="ADMIN" className="bg-zinc-900 text-rose-400">Admin Manager</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg"
        >
          <ElafLogo size="md" />
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'text-white bg-zinc-800/90 shadow-sm border border-zinc-700/50'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900/70'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Track Order Direct Link */}
          <button
            onClick={onOpenOrderTracker}
            className="px-4 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" /> Track Order
          </button>

          {/* Admin Dashboard tab if staff/admin */}
          {isStaff && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`ml-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-zinc-800 text-rose-300 hover:bg-zinc-700 border border-rose-900/40'
              }`}
            >
              <Shield className="w-4 h-4 text-rose-400" />
              <span>{isAdmin ? 'Admin Console' : 'Kitchen Orders'}</span>
            </button>
          )}
        </nav>

        {/* Action Controls: Menu Search, Cart Button, Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('menu')}
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-400 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search dishes...</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            id="header-cart-button"
            className="relative flex items-center justify-center p-3 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white rounded-xl shadow-lg shadow-rose-900/30 transition-all focus:outline-none focus:ring-2 focus:ring-rose-400"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-black bg-amber-400 text-zinc-950 rounded-full border-2 border-zinc-950 animate-pulse">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-300 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-left ${
                  activeTab === item.id
                    ? 'bg-rose-600 text-white'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenOrderTracker();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold bg-zinc-900 text-rose-300 flex items-center justify-between"
            >
              <span>Track Live Order</span>
              <Clock className="w-4 h-4" />
            </button>

            {isStaff && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold bg-zinc-800 text-amber-300 flex items-center justify-between border border-amber-800/40"
              >
                <span>Admin & Operations Console</span>
                <Shield className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                onOpenArchitectureModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-rose-950/40 text-rose-300 flex items-center justify-between border border-rose-900/50"
            >
              <span>Full-Stack Architecture & Learning Guide</span>
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
